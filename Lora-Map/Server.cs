using System;
using System.Collections.Generic;
using System.Net;

using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;
using BlubbFish.Utils.IoT.Connector;
using BlubbFish.Utils.IoT.Events;

using Fraunhofer.Fit.IoT.LoraMap.Model;
using Fraunhofer.Fit.IoT.LoraMap.Model.Admin;
using Fraunhofer.Fit.IoT.LoraMap.Model.Camera;
using Fraunhofer.Fit.IoT.LoraMap.Model.Position;
using Fraunhofer.Fit.IoT.LoraMap.Model.Sensor;
using Fraunhofer.Fit.IoT.LoraMap.Model.Svg;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap {
  class Server : Webserver {
    private readonly SortedDictionary<String, Object> jsonapi = new SortedDictionary<String, Object>() {
      { "camera", CameraModel.Instance },
      { "position", PositionModel.Instance },
      { "sensor", SensorModel.Instance },
      { "settings", Settings.Instance.External },
    };
    private readonly AdminModel admin;

    public Server(ADataBackend backend, Dictionary<String, String> settings) : base(backend, settings, null) {
      this.logger.SetPath(settings["loggingpath"]);
      this.admin = new AdminModel(settings);
      this.admin.SettingsUpdate += Settings.Instance.ReloadSettings;
      this.admin.GeoUpdate += Settings.Instance.ReloadGeo;
      this.admin.NamesUpdate += PositionModel.Instance.ReloadNames;
      this.StartListen();
      this.WaitForShutdown();
      this.Dispose();
    }

    protected override void Backend_MessageIncomming(Object sender, BackendEvent mqtt) {
      try {
        JsonData d = JsonMapper.ToObject(mqtt.Message);
        PositionModel.Instance.ParseMqttJson(d, (String)mqtt.From);
        CameraModel.Instance.ParseMqttJson(d, (String)mqtt.From);
        SensorModel.Instance.ParseMqttJson(d, (String)mqtt.From);
      } catch(Exception e) {
        Helper.WriteError("Backend_MessageIncomming(): "+e.Message + "\n\n" + e.StackTrace);
      }
    }

    protected override Boolean SendWebserverResponse(HttpListenerContext cont) {
      try {
        if(cont.Request.Url.AbsolutePath.StartsWith("/api/json/")) {
          if(cont.Request.Url.AbsolutePath.Length > 10) {
            String parts = cont.Request.Url.AbsolutePath[10..];
            Dictionary<String, Object> ret = new Dictionary<String, Object>();
            foreach(String part in parts.Split(",")) {
              if(this.jsonapi.ContainsKey(part)) {
                ret.Add(part, this.jsonapi[part]);
              }
            }
            return SendJsonResponse(ret, cont);
          }
        } else if(cont.Request.Url.AbsolutePath.StartsWith("/api/time")) {
          return SendJsonResponse(new Dictionary<String, DateTime>() { { "utc", DateTime.UtcNow } }, cont);
        } else if(cont.Request.Url.AbsolutePath.StartsWith("/api/svg/")) {
          return SvgModel.Instance.ParseRequest(cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/admin/")) {
          return this.admin.ParseReuqest(cont);
        } else if(cont.Request.Url.PathAndQuery.StartsWith("/maps/")) {
          return SendFileResponse(cont, "resources", false);
        } 
      } catch(Exception e) {
        Helper.WriteError("SendWebserverResponse(): 500 - " + e.Message + "\n\n" + e.StackTrace);
        cont.Response.StatusCode = 500;
        return false;
      }
      return SendFileResponse(cont);
    }

    public override void Dispose() {
      SensorModel.Instance.Dispose();
      base.Dispose();
    }
  }
}