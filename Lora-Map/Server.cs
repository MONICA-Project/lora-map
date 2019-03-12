using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;
using BlubbFish.Utils.IoT.Connector;
using BlubbFish.Utils.IoT.Events;
using Fraunhofer.Fit.IoT.LoraMap.Model;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap {
  class Server : Webserver
  {
    private readonly SortedDictionary<String, Botclient> locations = new SortedDictionary<String, Botclient>();
    private readonly JsonData marker;
    private readonly Dictionary<String, Marker> markertable = new Dictionary<String, Marker>();

    public Server(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) => this.marker = JsonMapper.ToObject(File.ReadAllText("names.json"));

    protected override void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if (d.ContainsKey("Rssi") && d["Rssi"].IsDouble
          && d.ContainsKey("Snr") && d["Snr"].IsDouble
          && d.ContainsKey("Receivedtime") && d["Receivedtime"].IsString
          && d.ContainsKey("BatteryLevel") && d["BatteryLevel"].IsDouble
          && d.ContainsKey("Gps") && d["Gps"].IsObject
          && d["Gps"].ContainsKey("Latitude") && d["Gps"]["Latitude"].IsDouble
          && d["Gps"].ContainsKey("Longitude") && d["Gps"]["Longitude"].IsDouble
          && d["Gps"].ContainsKey("LastLatitude") && d["Gps"]["LastLatitude"].IsDouble
          && d["Gps"].ContainsKey("LastLongitude") && d["Gps"]["LastLongitude"].IsDouble
          && d["Gps"].ContainsKey("Hdop") && d["Gps"]["Hdop"].IsDouble
          && d["Gps"].ContainsKey("Fix") && d["Gps"]["Fix"].IsBoolean
          && d["Gps"].ContainsKey("Height") && d["Gps"]["Height"].IsDouble
          && d.ContainsKey("Name") && d["Name"].IsString) {
          String name = (String)d["Name"];
          Botclient b = new Botclient(name, d, this.marker);
          if (this.locations.ContainsKey(name)) {
            this.locations[name] = b;
          } else {
            this.locations.Add(name, b);
          }
          Console.WriteLine("Koordinate erhalten!");
        }
      } catch (Exception ex) {
        Helper.WriteError(ex.Message);
      }
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
      if(cont.Request.Url.PathAndQuery.StartsWith("/icons/marker/Marker.svg") && cont.Request.Url.PathAndQuery.Contains("?")) {
        String hash = cont.Request.Url.PathAndQuery.Substring(cont.Request.Url.PathAndQuery.IndexOf('?')+1);
        if(!this.markertable.ContainsKey(hash)) {
          this.markertable.Add(hash, new Marker(hash));
        }
        cont.Response.ContentType = "image/svg+xml";
        Byte[] buf = Encoding.UTF8.GetBytes(this.markertable[hash].ToString());
        cont.Response.ContentLength64 = buf.Length;
        cont.Response.OutputStream.Write(buf, 0, buf.Length);
        Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
        return;
      }
      base.SendResponse(cont);
    }
  }
}