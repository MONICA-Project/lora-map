using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Svg {
  public class SVGMarker : SVGFile {
    private String name;
    private String icon;

    public SVGMarker(String query) : base(query, 86, 121.25, new List<Double>() { 0, 0, 86, 121.25 }) => this.css.Add("#marker-name tspan {\n  font-size: 20px;\n  font-family: DIN1451;\n}");

    public static String ParseConfig(JsonData json, String name) => "api/svg/marker.svg" + DictionaryConfigToString(GenerateConfig(json, name));

    protected override void ParseParams() {
      String[] parts = this.query.Split('&');
      foreach(String part in parts) {
        String[] keyvalue = part.Split('=');
        if(keyvalue.Length == 2) {
          switch(keyvalue[0].ToLower()) {
            case "name":
              this.name = keyvalue[1];
              break;
            case "icon":
              this.icon = keyvalue[1].ToLower();
              break;
          }
        }
      }
    }

    public static Dictionary<String, String> GenerateConfig(JsonData json, String name) {
      Dictionary<String, String> config = new Dictionary<String, String>();
      if(name != "") {
        config.Add("name", name);
      }
      if(json.ContainsKey("person") && json["person"].IsObject) {
        config.Add("icon", "person");
        Dictionary<String, String> personconfig = SVGPerson.GenerateConfig(json["person"]);
        personconfig.ToList().ForEach(x => config.Add(x.Key, x.Value));
      }
      return config;
    }

    protected override String DrawSvgContent() {
      String svg = "<g inkscape:groupmode=\"layer\" id=\"marker-bg\" inkscape:label=\"Marker\">\n";
      svg += "<rect style=\"fill:#ffffff;stroke:#000000;stroke-width:1.5px;\" width=\"82.5\" height=\"110\" x=\"2\" y=\"0.75\" />\n";
      svg += "<path style=\"stroke:#000000;stroke-width:1.5px;\" d=\"m 2,110.75 0,8.5\" />\n";
      svg += "<circle style=\"fill:#000000;\" cx=\"2\" cy=\"119.25\" r=\"2\" />\n";
      svg += "</g>\n";

      svg += "<g inkscape:groupmode=\"layer\" id=\"marker-name\" inkscape:label=\"Name\">\n";
      svg += $"<text><tspan x=\"5\" y=\"20\" id=\"marker-name-text\">{this.name}</tspan></text>\n";
      svg += "</g>\n";

      if(this.icon == "person") {
        svg += "<g inkscape:groupmode=\"layer\" id=\"marker-icon\" inkscape:label=\"Icon\" transform=\"translate(42.5 45) scale(0.8)\">\n";
        svg += new SVGPerson(this.query, false);
        svg += "</g>\n";
      }
      return svg;
    }
  }
}
