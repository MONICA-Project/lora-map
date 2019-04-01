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
  class Server : Webserver
  {
    private readonly SortedDictionary<String, PositionItem> positions = new SortedDictionary<String, PositionItem>();
    private readonly SortedDictionary<String, AlarmItem> alarms = new SortedDictionary<String, AlarmItem>();
    private readonly JsonData marker;
    private readonly Dictionary<String, Marker> markertable = new Dictionary<String, Marker>();
    private readonly AdminModel admin = new AdminModel();

    public Server(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) => this.marker = JsonMapper.ToObject(File.ReadAllText("names.json"));

    protected override void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if (PositionItem.CheckJson(d) && ((String)e.From).Contains("lora/data")) {
          String name = PositionItem.GetId(d);
          if (this.positions.ContainsKey(name)) {
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
          Console.WriteLine("PANIC erhalten!");
        }
      } catch (Exception ex) {
        Helper.WriteError(ex.Message);
      }
    }

    protected override Boolean SendWebserverResponse(HttpListenerContext cont) {
      try {
        if (cont.Request.Url.PathAndQuery.StartsWith("/loc")) {
          return SendJsonResponse(this.positions, cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/panic")) {
          return SendJsonResponse(this.alarms, cont);
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
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/currenttime")) {
          return SendJsonResponse(new Dictionary<String, DateTime>() { { "utc", DateTime.UtcNow } }, cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/admin")) {
          return this.admin.ParseReuqest(cont);
        }
      } catch (Exception e) {
        Helper.WriteError("500 - " + e.Message);
        cont.Response.StatusCode = 500;
        return false;
      }
      return SendFileResponse(cont, "resources");
    }
  }
}