using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class Marker {
    private readonly XmlDocument svg = new XmlDocument();

    public Marker(String hash) {
      this.svg.LoadXml(File.ReadAllText("resources/icons/marker/Marker.svg"));
      this.ParseParams(hash);
    }

    private void ParseParams(String hash) {
      String[] parts = hash.Split('&');
      foreach(String part in parts) {
        String[] keyvalue = part.Split('=');
        if(keyvalue.Length == 2) {
          switch(keyvalue[0].ToLower()) {
            case "name":
              XmlNodeList node = this.svg.DocumentElement.SelectNodes("//*[local-name()='tspan'][@id='marker-name-text']");
              if(node.Count == 1) {
                node.Item(0).InnerText = keyvalue[1];
              }
              break;
          }
        }
      }
    }

    public override String ToString() => this.svg.OuterXml;
  }
}
