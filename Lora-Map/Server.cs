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
    private readonly SortedDictionary<String, Camera> cameras = new SortedDictionary<String, Camera>();
    private readonly SortedDictionary<String, Crowd> crowds = new SortedDictionary<String, Crowd>();
    private JsonData marker;
    private Settings settings;
    private readonly Dictionary<String, Marker> markertable = new Dictionary<String, Marker>();
    private readonly AdminModel admin;
    private readonly Object lockData = new Object();
    private readonly Object lockPanic = new Object();

    public Server(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) {
      this.logger.SetPath(settings["loggingpath"]);
      this.CheckJsonFiles();
      this.admin = new AdminModel(settings);
      this.marker = JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      this.admin.NamesUpdate += this.AdminModelUpdateNames;
      this.settings = new Settings();
      this.admin.SettingsUpdate += this.settings.AdminModelUpdateSettings;
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
      if (!File.Exists("json/settings.json")) {
        File.WriteAllText("json/settings.json", "{}");
      }
    }

    protected override void Backend_MessageIncomming(Object sender, BackendEvent mqtt) {
      try {
        JsonData d = JsonMapper.ToObject(mqtt.Message);
        if(PositionItem.CheckJson(d) && ((String)mqtt.From).Contains("lora/data")) {
          String name = PositionItem.GetId(d);
          lock(this.lockData) {
            if(this.positions.ContainsKey(name)) {
              this.positions[name].Update(d);
            } else {
              this.positions.Add(name, new PositionItem(d, this.marker));
            }
          }
          Console.WriteLine("Koordinate erhalten!");
        } else if(AlarmItem.CheckJson(d) && ((String)mqtt.From).Contains("lora/panic")) {
          String name = AlarmItem.GetId(d);
          lock(this.lockPanic) {
            if(this.alarms.ContainsKey(name)) {
              this.alarms[name].Update(d);
            } else {
              this.alarms.Add(name, new AlarmItem(d));
            }
          }
          lock(this.lockData) {
            if(this.positions.ContainsKey(name)) {
              this.positions[name].Update(d);
            } else {
              this.positions.Add(name, new PositionItem(d, this.marker));
            }
          }
          Console.WriteLine("PANIC erhalten!");
        } else if(Camera.CheckJson(d) && ((String)mqtt.From).Contains("camera/count")) {
          String cameraid = Camera.GetId(d);
          if(this.cameras.ContainsKey(cameraid)) {
            this.cameras[cameraid].Update(d);
          } else {
            this.cameras.Add(cameraid, new Camera(d));
          }
        } else if((((String)mqtt.From).Contains("sfn/crowd_density_local") && Crowd.CheckJsonCrowdDensityLocal(d)) || 
          (((String)mqtt.From).Contains("sfn/fighting_detection") && Crowd.CheckJsonFightingDetection(d)) || 
          (((String)mqtt.From).Contains("sfn/flow") && Crowd.CheckJsonFlow(d))) {
          String cameraid = Crowd.GetId(d);
          if(this.crowds.ContainsKey(cameraid)) {
            this.crowds[cameraid].Update(d);
          } else {
            this.crowds.Add(cameraid, new Crowd(d));
          }
        }
      } catch(Exception e) {
        Helper.WriteError("Backend_MessageIncomming(): "+e.Message + "\n\n" + e.StackTrace);
      }
    }

    protected override Boolean SendWebserverResponse(HttpListenerContext cont) {
      try {
        if (cont.Request.Url.PathAndQuery.StartsWith("/get1000")) {
          return SendJsonResponse(new Dictionary<String, Object>() {
            { "loc", this.positions },
            { "panic", this.alarms },
            { "cameracount", this.cameras },
            { "crowdcount", this.crowds }
          }, cont);
        } else if (cont.Request.Url.PathAndQuery.StartsWith("/get60000")) {
          return SendJsonResponse(new Dictionary<String, Object>() {
            { "currenttime", new Dictionary<String, DateTime>() { { "utc", DateTime.UtcNow } } }
          }, cont);
        } else if (cont.Request.Url.PathAndQuery.StartsWith("/getonce")) {
          return SendJsonResponse(new Dictionary<String, Object>() {
            { "getlayer", this.FindMapLayer(cont.Request) },
            { "getgeo", JsonMapper.ToObject(File.ReadAllText("json/geo.json")) },
            { "startup", this.settings }
          }, cont);
        } else if (cont.Request.Url.PathAndQuery.StartsWith("/icons/marker/Marker.svg") && cont.Request.Url.PathAndQuery.Contains("?")) {
          String hash = cont.Request.Url.PathAndQuery.Substring(cont.Request.Url.PathAndQuery.IndexOf('?') + 1);
          if (!this.markertable.ContainsKey(hash)) {
            this.markertable.Add(hash, new Marker(hash));
          }
          cont.Response.ContentType = "image/svg+xml";
          Byte[] buf = Encoding.UTF8.GetBytes(this.markertable[hash].ToString());
          cont.Response.ContentLength64 = buf.Length;
          cont.Response.OutputStream.Write(buf, 0, buf.Length);
          Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
          return true;
        } else if (cont.Request.Url.PathAndQuery.StartsWith("/admin")) {
          return this.admin.ParseReuqest(cont);
        } else if (cont.Request.Url.PathAndQuery.StartsWith("/maps/")) {
          return SendFileResponse(cont, "resources", false);
        } 
      } catch(Exception e) {
        Helper.WriteError("SendWebserverResponse(): 500 - " + e.Message + "\n\n" + e.StackTrace);
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