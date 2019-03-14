using System;
using System.IO;
using System.Xml;

namespace Fraunhofer.Fit.IoT.LoraMap.Model
{
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
              XmlNodeList xmlname = this.svg.DocumentElement.SelectNodes("//*[local-name()='tspan'][@id='marker-name-text']");
              if(xmlname.Count == 1) {
                xmlname.Item(0).InnerText = keyvalue[1];
              }
              break;
            case "icon":
              if(keyvalue[1] == "person") {
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
          }
        }
      }
    }

    public override String ToString() => this.svg.OuterXml;
  }
}
