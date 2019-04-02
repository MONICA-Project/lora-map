using System;
using System.Collections.Generic;
using System.Net;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Bots;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Admin {
  class AdminModel {
    private readonly Dictionary<Int64, AdminSession> session = new Dictionary<Int64, AdminSession>();
    public Boolean ParseReuqest(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery == "/admin/login") {
        return this.Login(cont);
      }
      if(!this.CheckAuth(cont)) {
        return false;
      }
      return Webserver.SendFileResponse(cont);
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
