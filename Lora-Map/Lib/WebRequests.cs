using System;
using System.IO;
using System.Net;

using BlubbFish.Utils;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Lib {
  public class WebRequests {
    private static readonly Object getLock = new Object();
    public JsonData GetJson(String url) {
      String text = null;
      for(Int32 i = 0; i < 3; i++) {
        try {
          text = this.GetString(url);
          break;
        } catch(Exception e) {
          Helper.WriteError(e.Message);
          if(i == 2) {
            throw;
          }
          System.Threading.Thread.Sleep(30000);
        }
      }
      if(text == null) {
        return new JsonData();
      }
      try {
        return JsonMapper.ToObject(text);
      } catch(Exception) {
        return new JsonData();
      }
    }

    private String GetString(String url, Boolean withoutput = true) {
      String ret = null;
      lock(getLock) {
        HttpWebRequest request = WebRequest.CreateHttp(url);
        request.Timeout = 10000;
        //request.Headers.Add(HttpRequestHeader.Authorization, this.auth);
        try {
          using(HttpWebResponse response = (HttpWebResponse)request.GetResponse()) {
            if(response.StatusCode == HttpStatusCode.Unauthorized) {
              Console.Error.WriteLine("Benutzer oder Passwort falsch!");
              throw new Exception("Benutzer oder Passwort falsch!");
            }
            if(withoutput) {
              StreamReader reader = new StreamReader(response.GetResponseStream());
              ret = reader.ReadToEnd();
            }
          }
        } catch(Exception e) {
          //Helper.WriteError("Konnte keine Verbindung zum Razzbery Server herstellen. Resource: \"" + this.server + v + "\" Fehler: " + e.Message);
          //return null;
          throw new Exception("Konnte keine Verbindung zum Server herstellen: " + e.Message);
        }
      }
      return ret;
    }
  }
}
