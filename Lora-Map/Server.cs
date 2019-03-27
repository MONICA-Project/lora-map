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
    private readonly SortedDictionary<String, Panicclient> panics = new SortedDictionary<String, Panicclient>();
    private readonly JsonData marker;
    private readonly Dictionary<String, Marker> markertable = new Dictionary<String, Marker>();

    public Server(ADataBackend backend, Dictionary<String, String> settings, InIReader requests) : base(backend, settings, requests) => this.marker = JsonMapper.ToObject(File.ReadAllText("names.json"));

    protected override void Backend_MessageIncomming(Object sender, BackendEvent e) {
      try {
        JsonData d = JsonMapper.ToObject(e.Message);
        if (Botclient.CheckJson(d) && ((String)e.From).Contains("lora/data")) {
          String name = Botclient.GetId(d);
          if (this.locations.ContainsKey(name)) {
            this.locations[name].Update(d);
          } else {
            this.locations.Add(name, new Botclient(d, this.marker));
          }
          Console.WriteLine("Koordinate erhalten!");
        } else if(Panicclient.CheckJson(d) && ((String)e.From).Contains("lora/panic")) {
          String name = Panicclient.GetId(d);
          if(this.panics.ContainsKey(name)) {
            this.panics[name].Update(d);
          } else {
            this.panics.Add(name, new Panicclient(d));
          }
          Console.WriteLine("PANIC erhalten!");
        }
      } catch (Exception ex) {
        Helper.WriteError(ex.Message);
      }
    }

    protected override void SendResponse(HttpListenerContext cont) {
      try {
        if (cont.Request.Url.PathAndQuery.StartsWith("/loc")) {
          this.SendJsonResponse(this.locations, cont);
          return;
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/panic")) {
          this.SendJsonResponse(this.panics, cont);
          return;
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
          return;
        }
      } catch (Exception e) {
        Helper.WriteError("500 - " + e.Message);
        cont.Response.StatusCode = 500;
        return;
      }
      base.SendResponse(cont);
    }
  }
}