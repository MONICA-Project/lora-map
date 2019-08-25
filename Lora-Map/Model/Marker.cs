using System;
using System.IO;
using System.Xml;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model
{
  class Marker {
    private readonly XmlDocument svg = new XmlDocument();

    public Marker(String hash) {
      this.svg.LoadXml(File.ReadAllText("resources/icons/marker/Marker.svg"));
      this.ParseParams(hash);
    }

    public static String ParseMarkerConfig(JsonData json, String name) {
      String ret = "icons/marker/Marker.svg";
      if(json.ContainsKey("person") && json["person"].IsObject) {
        ret += "?icon=person";
        if(json["person"].ContainsKey("org") && json["person"]["org"].IsString) {
          ret += "&person-org=" + (String)json["person"]["org"];
        }
        if(json["person"].ContainsKey("funct") && json["person"]["funct"].IsString) {
          ret += "&person-funct=" + (String)json["person"]["funct"];
        }
        if(json["person"].ContainsKey("rang") && json["person"]["rang"].IsString) {
          ret += "&person-rang=" + (String)json["person"]["rang"];
        }
        if(json["person"].ContainsKey("text") && json["person"]["text"].IsString) {
          ret += "&person-text=" + (String)json["person"]["text"];
        }
        if(json["person"].ContainsKey("typ") && json["person"]["typ"].IsArray) {
          foreach(JsonData item in json["person"]["typ"]) {
            if(item.IsString) {
              ret += "&person-typ=" + (String)item;
            }
          }
        }
      }
      ret += ret.Contains("?") ? "&name=" + name : "?name=" + name;
      return ret;
    }

    private void ParseParams(String hash) {
      String[] parts = hash.Split('&');
      foreach(String part in parts) {
        String[] keyvalue = part.Split('=');
        if(keyvalue.Length == 2) {
          switch(keyvalue[0].ToLower()) {
            case "name":
              XmlNodeList xmlname = this.svg.DocumentElement.SelectNodes("//*[local-name()='tspan'][@id='marker-name-text']");
              if(xmlname.Count == 1) {
                xmlname.Item(0).InnerText = keyvalue[1];
              }
              break;
            case "marker-bg":
              if(keyvalue[1].ToLower() == "hidden") {
                XmlNodeList markerbg = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='global-def']");
                if(markerbg.Count == 1) {
                  markerbg[0].InnerXml += "<style type=\"text/css\">#marker-bg {display: none;}#marker-name {display: none;}</style>";
                }
                XmlNodeList root = this.svg.DocumentElement.SelectNodes("//*[local-name()='svg']");
                if(root.Count == 1) {
                  foreach(XmlAttribute item in root[0].Attributes) {
                    if(item.Name.ToLower() == "height") {
                      item.Value = "38px";
                    }
                    if(item.Name.ToLower() == "width") {
                      item.Value = "40px";
                    }
                    if(item.Name.ToLower() == "viewbox") {
                      item.Value = "8 35 70 100";
                    }
                  }
                }
              }
              break;
            case "icon":
              if(keyvalue[1].ToLower() == "person") {
                XmlNodeList xmlicon = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='global-def']");
                if (xmlicon.Count == 1) {
                  xmlicon.Item(0).InnerXml += "<style type=\"text/css\">#marker-icon #person { display: inline; }</style>";
                }
              }
              break;
            case "person-org":
              XmlNodeList xmlpersonorg = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='people-def']");
              if (xmlpersonorg.Count == 1) {
                xmlpersonorg.Item(0).InnerXml += "<style type=\"text/css\">#person-layer-org #person-layer-org-"+ keyvalue[1] + " { display: inline; }</style>";
              }
              break;
            case "person-funct":
              XmlNodeList xmlpersonfunct = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='people-def']");
              if (xmlpersonfunct.Count == 1) {
                xmlpersonfunct.Item(0).InnerXml += "<style type=\"text/css\">#person-layer-funct #person-layer-funct-" + keyvalue[1] + " { display: inline; }</style>";
              }
              break;
            case "person-rang":
              XmlNodeList xmlpersonrang = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='people-def']");
              if (xmlpersonrang.Count == 1) {
                xmlpersonrang.Item(0).InnerXml += "<style type=\"text/css\">#person-layer-rang #person-layer-rang-" + keyvalue[1] + " { display: inline; }</style>";
              }
              break;
            case "person-text":
              XmlNodeList xmlpersontext = this.svg.DocumentElement.SelectNodes("//*[local-name()='tspan'][@id='person-layer-typ-text']");
              if (xmlpersontext.Count == 1) {
                xmlpersontext.Item(0).InnerText = keyvalue[1];
              }
              break;
            case "person-typ":
              XmlNodeList xmlpersontyp = this.svg.DocumentElement.SelectNodes("//*[local-name()='defs'][@id='people-def']");
              if(xmlpersontyp.Count == 1) {
                xmlpersontyp.Item(0).InnerXml += "<style type=\"text/css\">#person-layer-typ #person-layer-typ-" + keyvalue[1] + " { display: inline; }</style>";
              }
              break;
          }
        }
      }
    }

    public override String ToString() => this.svg.OuterXml;
  }
}
