using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Admin {
  class AdminModel {
    public delegate void AdminEvent(Object sender, EventArgs e);
    public event AdminEvent NamesUpdate;

    private readonly Dictionary<Int64, AdminSession> session = new Dictionary<Int64, AdminSession>();
    public Boolean ParseReuqest(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery == "/admin/login") {
        return this.Login(cont);
      }
      if(!this.CheckAuth(cont)) {
        return false;
      }
      if(cont.Request.Url.PathAndQuery.StartsWith("/admin/get_json_")) {
        return this.SendJson(cont);
      }
      if(cont.Request.Url.PathAndQuery.StartsWith("/admin/set_json_")) {
        return this.GetJson(cont);
      }
      return Webserver.SendFileResponse(cont);
    }

    private Boolean GetJson(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery == "/admin/set_json_names") {
        StreamReader reader = new StreamReader(cont.Request.InputStream, cont.Request.ContentEncoding);
        String rawData = reader.ReadToEnd();
        cont.Request.InputStream.Close();
        reader.Close();
        File.WriteAllText("json/names.json", rawData);
        Console.WriteLine("200 - Get names.json " + cont.Request.Url.PathAndQuery);
        this.NamesUpdate?.Invoke(this, new EventArgs());
        return true;
      }
      return false;
    }

    private Boolean SendJson(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery == "/admin/get_json_names") {
        String file = File.ReadAllText("json/names.json");
        Byte[] buf = Encoding.UTF8.GetBytes(file);
        cont.Response.ContentLength64 = buf.Length;
        cont.Response.OutputStream.Write(buf, 0, buf.Length);
        Console.WriteLine("200 - Send names.json " + cont.Request.Url.PathAndQuery);
        return true;
      }
      Helper.WriteError("404 - Section in get_json not found " + cont.Request.Url.PathAndQuery + "!");
      cont.Response.StatusCode = 404;
      return false;
    }

    private Boolean Login(HttpListenerContext cont) {
      Dictionary<String, String> POST = Webserver.GetPostParams(cont.Request);
      if(POST.ContainsKey("user") && POST["user"] == "admin" &&
        POST.ContainsKey("pass") && POST["pass"] == "password") {
        Int64 sessionid = 0;
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
        return true;
      #endif
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
    }
  }
}
