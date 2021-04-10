using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

using BlubbFish.Utils;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Svg {
  public class SvgModel : OwnSingeton<SvgModel> {
    private readonly Dictionary<String, SVGFile> svgtable = new Dictionary<String, SVGFile>();
    public Boolean ParseRequest(HttpListenerContext cont) {
      Byte[] svg = this.GetSvg(cont.Request.Url.PathAndQuery);
      if(svg.Length > 0) {
        cont.Response.ContentType = "image/svg+xml";
        cont.Response.ContentLength64 = svg.Length;
        cont.Response.OutputStream.Write(svg, 0, svg.Length);
        Console.WriteLine("200 - " + cont.Request.Url.PathAndQuery);
        return true;
      }
      cont.Response.StatusCode = 404;
      Helper.WriteError("404 - " + cont.Request.Url.PathAndQuery + " not found!");
      return false;
    }

    private Byte[] GetSvg(String pathAndQuery) {
      if(this.svgtable.ContainsKey(pathAndQuery)) {
        return Encoding.UTF8.GetBytes(this.svgtable[pathAndQuery].ToString());
      } else {
        if(pathAndQuery.StartsWith("/api/svg/marker.svg") && pathAndQuery.Contains("?")) {
          String query = pathAndQuery[(pathAndQuery.IndexOf('?') + 1)..];
          this.svgtable.Add(pathAndQuery, new SVGMarker(query));
          return Encoding.UTF8.GetBytes(this.svgtable[pathAndQuery].ToString());
        } else if(pathAndQuery.StartsWith("/api/svg/person.svg") && pathAndQuery.Contains("?")) {
          String query = pathAndQuery[(pathAndQuery.IndexOf('?') + 1)..];
          this.svgtable.Add(pathAndQuery, new SVGPerson(query));
          return Encoding.UTF8.GetBytes(this.svgtable[pathAndQuery].ToString());
        }
      }
      return new Byte[0];
    }
  }
}
