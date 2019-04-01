using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using BlubbFish.Utils.IoT.Bots;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Admin {
  class AdminModel {
    public Boolean ParseReuqest(HttpListenerContext cont) {
      //cont.Request.Url.PathAndQuery = 
      if(!this.CheckAuth(cont)) {
        return false;
      }
      return Webserver.SendFileResponse(cont, "admin");
    }

    private Boolean CheckAuth(HttpListenerContext cont) {
      if(cont.Request.Url.PathAndQuery.StartsWith("/admin/login")) {
        return true;
      } else if(cont.Request.Url.PathAndQuery.StartsWith("/admin/logout")) {
      } else {
        cont.Response.StatusCode = 403;
      }
      return false;
    }
  }
}
