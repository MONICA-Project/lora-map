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
using Fraunhofer.Fit.IoT.LoraMap.Model.Admin;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap {
  class Server : Webserver {
    private readonly SortedDictionary<String, PositionItem> positions = new SortedDictionary<String, PositionItem>();
    private readonly SortedDictionary<String, AlarmItem> alarms = new SortedDictionary<String, AlarmItem>();
    private JsonData marker;
    private readonly Dictionary<String, Marker> markertable = new Dictionary<String, Marker>();
    private readonly AdminModel admin;

    public Server(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) {
      this.logger.SetPath(settings["loggingpath"]);
      this.CheckJsonFiles();
      this.admin = new AdminModel(settings);
      this.marker = JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      this.admin.NamesUpdate += this.AdminModelUpdateNames;
      this.StartListen();
    }

    private void AdminModelUpdateNames(Object sender, EventArgs e) {
      this.marker = JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      foreach(KeyValuePair<String, PositionItem> item in this.positions) {
        item.Value.UpdateMarker(this.marker, item.Key);
      }
      Console.WriteLine("Namen und Icons aktualisiert!");
    }

    private void CheckJsonFiles() {
      if(!Directory.Exists("json")) {
        Directory.CreateDirectory("json");
      }
      if(!File.Exists("json/names.json")) {
        File.WriteAllText("json/names.json", "{}");
      }
      if(!File.Exists("json/geo.json")) {
        File.WriteAllText("json/geo.json", "{}");
      }
    }

    protected override void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if(PositionItem.CheckJson(d) && ((String)e.From).Contains("lora/data")) {
          String name = PositionItem.GetId(d);
          if(this.positions.ContainsKey(name)) {
            this.positions[name].Update(d);
          } else {
            this.positions.Add(name, new PositionItem(d, this.marker));
          }
          Console.WriteLine("Koordinate erhalten!");
        } else if(AlarmItem.CheckJson(d) && ((String)e.From).Contains("lora/panic")) {
          String name = AlarmItem.GetId(d);
          if(this.alarms.ContainsKey(name)) {
            this.alarms[name].Update(d);
          } else {
            this.alarms.Add(name, new AlarmItem(d));
          }
          if(this.positions.ContainsKey(name)) {
            this.positions[name].Update(d);
          } else {
            this.positions.Add(name, new PositionItem(d, this.marker));
          }
          Console.WriteLine("PANIC erhalten!");
        }
      } catch(Exception ex) {
        Helper.WriteError(ex.Message);
      }
    }

    protected override Boolean SendWebserverResponse(HttpListenerContext cont) {
      try {
        if(cont.Request.Url.PathAndQuery.StartsWith("/loc")) {
          return SendJsonResponse(this.positions, cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/panic")) {
          return SendJsonResponse(this.alarms, cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/icons/marker/Marker.svg") && cont.Request.Url.PathAndQuery.Contains("?")) {
          String hash = cont.Request.Url.PathAndQuery.Substring(cont.Request.Url.PathAndQuery.IndexOf('?') + 1);
          if(!this.markertable.ContainsKey(hash)) {
            this.markertable.Add(hash, new Marker(hash));
          }
          cont.Response.ContentType = "image/svg+xml";
          Byte[] buf = Encoding.UTF8.GetBytes(this.markertable[hash].ToString());
          cont.Response.ContentLength64 = buf.Length;
          cont.Response.OutputStream.Write(buf, 0, buf.Length);
          Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
          return true;
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/currenttime")) {
          return SendJsonResponse(new Dictionary<String, DateTime>() { { "utc", DateTime.UtcNow } }, cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/admin")) {
          return this.admin.ParseReuqest(cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/getlayer")) {
          return SendJsonResponse(this.FindMapLayer(cont.Request), cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/maps/")) {
          return SendFileResponse(cont, "resources", false);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/getgeo")) {
          Byte[] buf = Encoding.UTF8.GetBytes(File.ReadAllText("json/geo.json"));
          cont.Response.ContentLength64 = buf.Length;
          cont.Response.OutputStream.Write(buf, 0, buf.Length);
          Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
          return true;
        }
      } catch(Exception e) {
        Helper.WriteError("500 - " + e.Message);
        cont.Response.StatusCode = 500;
        return false;
      }
      return SendFileResponse(cont);
    }

    private Dictionary<String, Dictionary<String, Object>> FindMapLayer(HttpListenerRequest request) {
      Dictionary<String, Dictionary<String, Object>> ret = new Dictionary<String, Dictionary<String, Object>> {
        { "online", new Dictionary<String, Object>() {
          { "title", "Online Map" },
          { "url", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
          { "attribution", "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors" },
          { "minZoom", 1 },
          { "maxZoom", 18 }
        } }
      };
      if(Directory.Exists("resources" + Path.DirectorySeparatorChar + "maps")) {
        String[] dirs = Directory.GetDirectories("resources" + Path.DirectorySeparatorChar + "maps");
        foreach(String dir in dirs) {
          if(File.Exists(dir + Path.DirectorySeparatorChar + "tiles.json")) {
            try {
              JsonData map = JsonMapper.ToObject(File.ReadAllText(dir + Path.DirectorySeparatorChar + "tiles.json"));
              Dictionary<String, Object> entry = new Dictionary<String, Object> {
                { "title", (String)map["name"] },
                { "url", (String)map["tiles"][0] },
                { "attribution", (String)map["attribution"] },
                { "minZoom", (Int32)map["minzoom"] },
                { "maxZoom", (Int32)map["maxzoom"] },
                { "bounds", new Dictionary<String, Object>() {
                  { "corner1", new Double[] { (Double)map["bounds"][0], (Double)map["bounds"][1] } },
                  { "corner2", new Double[] { (Double)map["bounds"][2], (Double)map["bounds"][3] } }
                } }
              };
              ret.Add(dir.Substring(("resources" + Path.DirectorySeparatorChar + "maps").Length+1), entry);
            } catch { }
          }
        }
      }
      return ret;
    }
  }
}