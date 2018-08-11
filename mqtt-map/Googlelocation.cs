using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using BlubbFish.Utils.IoT.Bots;
using BlubbFish.Utils.IoT.Connector;
using BlubbFish.Utils.IoT.Events;
using LitJson;

namespace Fraunhofer.Fit.IoT.Bots.LoraBot.Moduls_broken {
  class Botclient {

    public Botclient(Int32 paketrssi, Int32 rssi, Double snr, String updatetime, Double lat, Double lon, Double hdop, Int32 sat, Boolean fix) {
      this.PacketRssi = paketrssi;
      this.Rssi = rssi;
      this.Snr = snr;
      this.Upatedtime = updatetime;
      this.Latitude = lat;
      this.Longitude = lon;
      this.Hdop = hdop;
      this.Satelites = sat;
      this.Fix = fix;
    }

    public Int32 PacketRssi { get; private set; }
    public Int32 Rssi { get; private set; }
    public Double Snr { get; private set; }
    public String Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Int32 Satelites { get; private set; }
    public Boolean Fix { get; private set; }

    public virtual Dictionary<String, Object> ToDictionary() {
      Dictionary<String, Object> dictionary = new Dictionary<String, Object>();
      foreach (PropertyInfo item in this.GetType().GetProperties()) {
        if (item.CanRead && item.GetValue(this) != null) {
          if (item.GetValue(this).GetType().GetMethod("ToDictionary") != null) {
            dictionary.Add(item.Name, item.GetValue(this).GetType().GetMethod("ToDictionary").Invoke(item.GetValue(this), null));
          } else if (item.GetValue(this).GetType().HasInterface(typeof(IDictionary))) {
            Dictionary<String, Object> subdict = new Dictionary<String, Object>();
            foreach (DictionaryEntry subitem in (IDictionary)item.GetValue(this)) {
              if (subitem.Value.GetType().GetMethod("ToDictionary") != null) {
                subdict.Add(subitem.Key.ToString(), subitem.Value.GetType().GetMethod("ToDictionary").Invoke(subitem.Value, null));
              }
            }
            dictionary.Add(item.Name, subdict);
          } else if (item.GetValue(this).GetType().BaseType == typeof(Enum)) {
            dictionary.Add(item.Name, Helper.GetEnumDescription((Enum)item.GetValue(this)));
          } else {
            dictionary.Add(item.Name, item.GetValue(this));
          }
        }
      }
      return dictionary;
    }
  }

  class Googlelocation {
    private readonly HttpListener _listener = new HttpListener();
    private readonly Dictionary<String, List<Botclient>> locations = new Dictionary<String, List<Botclient>>();
    private readonly Dictionary<String, String> config;

    public Googlelocation(ADataBackend backend, Dictionary<String, String> settings) {
      this.config = settings;
      backend.MessageIncomming += this.Backend_MessageIncomming;
      this._listener.Prefixes.Add("http://"+ this.config["prefix"] + ":8080/");
      this._listener.Start();
      this.Run();
    }

    private void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if (d.ContainsKey("PacketRssi") && d["PacketRssi"].IsInt
          && d.ContainsKey("Rssi") && d["Rssi"].IsInt
          && d.ContainsKey("Snr") && d["Snr"].IsDouble
          && d.ContainsKey("Upatedtime") && d["Upatedtime"].IsString
          && d.ContainsKey("Gps") && d["Gps"].IsObject
          && d["Gps"].ContainsKey("Breitengrad") && d["Gps"]["Breitengrad"].IsDouble
          && d["Gps"].ContainsKey("Laengengrad") && d["Gps"]["Laengengrad"].IsDouble
          && d["Gps"].ContainsKey("Hdop") && d["Gps"]["Hdop"].IsDouble
          && d["Gps"].ContainsKey("Satelites") && d["Gps"]["Satelites"].IsInt
          && d["Gps"].ContainsKey("Fix") && d["Gps"]["Fix"].IsBoolean
          && d.ContainsKey("Name") && d["Name"].IsString) {
          String name = (String)d["Name"];
          Botclient b = new Botclient((Int32)d["PacketRssi"], (Int32)d["Rssi"], (Double)d["Snr"], (String)d["Upatedtime"], (Double)d["Gps"]["Breitengrad"], (Double)d["Gps"]["Laengengrad"], (Double)d["Gps"]["Hdop"], (Int32)d["Gps"]["Satelites"], (Boolean)d["Gps"]["Fix"]);
          if (b.Fix) {
            if (this.locations.ContainsKey(name)) {
              this.locations[name].Add(b);
            } else {
              this.locations.Add(name, new List<Botclient> { b });
            }
            Console.WriteLine("Koodinate erhalten!");
          } else {
            Console.WriteLine("Daten erhalten! (Kein Fix)");
          }
        }
      } catch { }
    }

    private void Run() {
      ThreadPool.QueueUserWorkItem((o) => {
        Console.WriteLine("Webserver is Running...");
        try {
          while(this._listener.IsListening) {
            ThreadPool.QueueUserWorkItem((c) => {
              HttpListenerContext ctx = c as HttpListenerContext;
              try {
                String rstr = this.SendResponse(ctx.Request);
                Byte[] buf = Encoding.UTF8.GetBytes(rstr);
                ctx.Response.ContentLength64 = buf.Length;
                ctx.Response.OutputStream.Write(buf, 0, buf.Length);
              }
              catch { }
              finally {
                ctx.Response.OutputStream.Close();
              }
            }, this._listener.GetContext());
          }
        } 
        catch { };
      });
    }

    private String SendResponse(HttpListenerRequest request) {
      if(request.Url.PathAndQuery == "/") {
        if(File.Exists("resources/google.html")) {
          try {
            String file = File.ReadAllText("resources/google.html");
            file = file.Replace("{%YOUR_API_KEY%}", this.config["api_key"]);
            file = file.Replace("{%REQUEST-PAGE%}", request.Url.Host);
            return file;
          }
          catch { return "500";  }
        }
        return "404";
      }
      if (request.Url.PathAndQuery.StartsWith("/loc?i=")) {
        try {
          String requeststrings = request.Url.PathAndQuery.Substring(7);
          Dictionary<String, Int32> requestquerys = new Dictionary<String, Int32>();
          if (requeststrings.Length != 0) {
            foreach (String requeststring in requeststrings.Split(';')) {
              String[] item = requeststring.Split(':');
              requestquerys.Add(item[0], Int32.Parse(item[1]));

            }
          }
          Dictionary<String, Object> ret = new Dictionary<String, Object>();
          foreach (KeyValuePair<String, List<Botclient>> devices in this.locations) {
            if(!requestquerys.ContainsKey(devices.Key) || (requestquerys.ContainsKey(devices.Key) && devices.Value.Count > requestquerys[devices.Key])) {
              Int32 qindex = requestquerys.ContainsKey(devices.Key)?requestquerys[devices.Key]:0;
              Dictionary<String, Object> subret = new Dictionary<String, Object>();
              Int32 i = 0;
              List<Botclient> sub = devices.Value.GetRange(qindex, devices.Value.Count - qindex);
              foreach (Botclient item in sub) {
                subret.Add(i++.ToString(), item);
              }
              ret.Add(devices.Key, subret);
            }
          }
          Console.WriteLine("Koordiante abgefragt!");
          return JsonMapper.ToJson(ret);
        } catch {
          return "{}";
        }  
      }
      return "<h1>Works</h1>"+ request.Url.PathAndQuery;
    }

    public void Dispose() {
      this._listener.Stop();
      this._listener.Close();
    }
    
  }
}