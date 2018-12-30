using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;
using BlubbFish.Utils.IoT.Connector;
using BlubbFish.Utils.IoT.Events;
using LitJson;

namespace Fraunhofer.Fit.IoT.Bots.LoraBot.Moduls_broken {
  class Botclient {

    public Botclient(Int32 paketrssi, Int32 rssi, Double snr, String updatetime, Double lat, Double lon, Double hdop, Int32 battery, Boolean fix) {
      this.PacketRssi = paketrssi;
      this.Rssi = rssi;
      this.Snr = snr;
      this.Upatedtime = updatetime;
      this.Latitude = lat;
      this.Longitude = lon;
      this.Hdop = hdop;
      this.Battery = battery;
      this.Fix = fix;
    }

    public Int32 PacketRssi { get; private set; }
    public Int32 Rssi { get; private set; }
    public Double Snr { get; private set; }
    public String Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Int32 Battery { get; private set; }
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

  class Googlelocation : Webserver
  {
    private readonly Dictionary<String, List<Botclient>> locations = new Dictionary<String, List<Botclient>>();
    
    public Googlelocation(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) { }

    protected override void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if (d.ContainsKey("PacketRssi") && d["PacketRssi"].IsInt
          && d.ContainsKey("Rssi") && d["Rssi"].IsInt
          && d.ContainsKey("Snr") && d["Snr"].IsDouble
          && d.ContainsKey("Receivedtime") && d["Receivedtime"].IsString
          && d.ContainsKey("BatteryLevel") && d["BatteryLevel"].IsInt
          && d.ContainsKey("Gps") && d["Gps"].IsObject
          && d["Gps"].ContainsKey("Latitude") && d["Gps"]["Latitude"].IsDouble
          && d["Gps"].ContainsKey("Longitude") && d["Gps"]["Longitude"].IsDouble
          && d["Gps"].ContainsKey("Hdop") && d["Gps"]["Hdop"].IsDouble
          && d["Gps"].ContainsKey("Fix") && d["Gps"]["Fix"].IsBoolean
          && d.ContainsKey("Name") && d["Name"].IsString) {
          String name = (String)d["Name"];
          Botclient b = new Botclient((Int32)d["PacketRssi"], (Int32)d["Rssi"], (Double)d["Snr"], (String)d["Receivedtime"], (Double)d["Gps"]["Latitude"], (Double)d["Gps"]["Longitude"], (Double)d["Gps"]["Hdop"], (Int32)d["BatteryLevel"], (Boolean)d["Gps"]["Fix"]);
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

    protected override void SendResponse(HttpListenerContext cont) {
      if (cont.Request.Url.PathAndQuery.StartsWith("/loc")) {
        try {
          Dictionary<String, Object> ret = new Dictionary<String, Object>();
          Byte[] buf = Encoding.UTF8.GetBytes(JsonMapper.ToJson(this.locations));
          cont.Response.ContentLength64 = buf.Length;
          cont.Response.OutputStream.Write(buf, 0, buf.Length);
          Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
          return;
        } catch (Exception e) {
          Helper.WriteError("500 - " + e.Message);
          cont.Response.StatusCode = 500;
          return;
        }
      }
      base.SendResponse(cont);
    }
  }
}