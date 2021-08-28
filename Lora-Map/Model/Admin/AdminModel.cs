using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;

using Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Admin {
  class AdminModel {
    public delegate void AdminEvent(Object sender, EventArgs e);
    #pragma warning disable 0067
    public event AdminEvent NamesUpdate;
    public event AdminEvent GeoUpdate;
    public event AdminEvent SettingsUpdate;
    #pragma warning restore 0067

    private readonly SortedDictionary<String, Tuple<String, String>> datastorage = new SortedDictionary<String, Tuple<String, String>>() {
      { "name", new Tuple<String, String>("names", "NamesUpdate") },
      { "geo", new Tuple<String, String>("geo", "GeoUpdate") },
      { "setting", new Tuple<String, String>("settings", "SettingsUpdate") }
    };

    private readonly Dictionary<Int64, AdminSession> session = new Dictionary<Int64, AdminSession>();
    private readonly Dictionary<String, String> settings;

    public AdminModel(Dictionary<String, String> settings) {
      this.settings = settings;
      if(!settings.ContainsKey("admin_user") || !settings.ContainsKey("admin_pass")) {
        Helper.WriteError("Kann die Einstellungen [webserver] admin_user und admin_pass nicht laden!");
        throw new FileNotFoundException("Kann die Einstellungen [webserver] admin_user und admin_pass nicht laden!");
      }
    }

    public Boolean ParseReuqest(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery == "/admin/login") {
        return this.Login(cont);
      }
      if(!this.CheckAuth(cont)) {
        return false;
      }
      if(cont.Request.Url.PathAndQuery.StartsWith("/admin/api/json/")) {
        if(cont.Request.HttpMethod == "GET") {
          if(cont.Request.Url.AbsolutePath.Length > 16) {
            String parts = cont.Request.Url.AbsolutePath[16..];
            Dictionary<String, JsonData> ret = new Dictionary<String, JsonData>();
            foreach(String part in parts.Split(",")) {
              if(this.datastorage.ContainsKey(part)) {
                ret.Add(part, JsonMapper.ToObject(File.ReadAllText("json/" + this.datastorage[part].Item1 + ".json")));
              }
            }
            Console.WriteLine("200 - Send names.json " + cont.Request.Url.PathAndQuery);
            return cont.SendStringResponse(JsonMapper.ToJson(ret));
          }
        } else if(cont.Request.HttpMethod == "PUT") {
          if(cont.Request.Url.AbsolutePath.Length > 16) {
            String part = cont.Request.Url.AbsolutePath[16..];
            if(this.datastorage.ContainsKey(part)) {
              return this.SetJsonFile(cont, part);
            }
          }
        }
      }
      return cont.SendFileResponse();
    }

    private Boolean SetJsonFile(HttpListenerContext cont, String part) {
      StreamReader reader = new StreamReader(cont.Request.InputStream, cont.Request.ContentEncoding);
      String filename = "json/" + this.datastorage[part].Item1 + ".json";
      String rawData = reader.ReadToEnd();
      cont.Request.InputStream.Close();
      reader.Close();
      try {
        JsonData json = JsonMapper.ToObject(rawData);
        if(part == "name") {
          if(!NamesModel.CheckJson(json)) {
            throw new Exception("Check against model failed.");
          }   
        }
      } catch (Exception) {
        Helper.WriteError("501 - Error recieving " + filename + ", no valid json " + cont.Request.Url.PathAndQuery);
        cont.Response.StatusCode = 501;
        return false;
      }
      File.WriteAllText(filename, rawData);
      Console.WriteLine("200 - PUT " + filename + " " + cont.Request.Url.PathAndQuery);
      this.GetEvent<AdminEvent>(this.datastorage[part].Item2)?.Invoke(this, new EventArgs());
      return true;
    }

    private Boolean Login(HttpListenerContext cont) {
      Dictionary<String, String> POST = cont.Request.GetPostParams();
      if(POST.ContainsKey("user") && POST["user"] == this.settings["admin_user"] && POST.ContainsKey("pass") && POST["pass"] == this.settings["admin_pass"]) {
        Int64 sessionid;
        while(true) {
          sessionid = AdminSession.GetRandomSessionid();
          if(!this.session.ContainsKey(sessionid)) {
            break;
          }
        }
        if(cont.Request.Cookies["loramapsession"] != null) {
          if(Int64.TryParse(cont.Request.Cookies["loramapsession"].Value, out Int64 cookiesessionid)) {
            if(this.session.ContainsKey(cookiesessionid)) {
              if(!this.session[sessionid].IsLoggedin) {
                sessionid = cookiesessionid;
              }
            }
          }
        }
        if(!this.session.ContainsKey(sessionid)) {
          this.session.Add(sessionid, new AdminSession());
        }
        this.session[sessionid].IsLoggedin = true;
        cont.Response.AppendCookie(new Cookie("loramapsession", sessionid.ToString()) {
          Expires = DateTime.Now.AddYears(1)
        });
        cont.Response.AddHeader("Location", "/admin");
        cont.Response.StatusCode = 307;
        Console.WriteLine("200 - Login OK! " + cont.Request.Url.PathAndQuery);
        return true;
      }
      cont.Response.AddHeader("Location", "/admin/login.html");
      cont.Response.StatusCode = 307;
      Helper.WriteError("307 - Login WRONG! " + cont.Request.Url.PathAndQuery);
      return false;
    }

    private Boolean CheckAuth(HttpListenerContext cont) {
      #if DEBUG
        Helper.WriteError("200 - AUTH-Bypassed!");
        return true;
      #else
        if(cont.Request.Url.PathAndQuery.StartsWith("/admin/login.html")) {
          return true;
        } else {
          if(cont.Request.Cookies["loramapsession"] != null) {
            if(Int64.TryParse(cont.Request.Cookies["loramapsession"].Value, out Int64 sessionid)) {
              if(this.session.ContainsKey(sessionid)) {
                return this.session[sessionid].IsLoggedin;
              }
            }
          }
          cont.Response.StatusCode = 403;
          Helper.WriteError("403 - " + cont.Request.Url.PathAndQuery);
        }
        return false;
      #endif
    }
  }
}
