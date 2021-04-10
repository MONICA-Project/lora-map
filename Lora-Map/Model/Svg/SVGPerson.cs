using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Svg {
  public class SVGPerson : SVGFile {
    private String organisation;
    private String function;
    private String rang;
    private String text;
    private String[] typs;



    public SVGPerson(String query, Boolean withOutline = true) : base(query, 74.953316, 84.703323, new List<Double>() { -37.5, -12, 74.953316, 84.703323 }, withOutline) {
      this.css.Add("#person-layer-org rect {\n  stroke: black;\n  stroke-width: 3px;\n}");
      this.css.Add("#person-layer-funct path {\n  stroke: #000000;\n  stroke-width: 3px;\n  fill: #000000;\n}");
      this.css.Add("#person-layer-rang circle {\n  fill: #000000;\n}");
      this.css.Add("#person-layer-typ tspan {\n  font-size: 20px;\n  font-family: DIN1451;\n  text-align: center;\n  text-anchor: middle;\n  fill: #000000;\n}");
      this.css.Add("#person-layer-typ line {\n  stroke-width: 3px;\n  stroke: black;\n}");
    }

    public static String ParseConfig(JsonData json) => "api/svg/person.svg" + DictionaryConfigToString(GenerateConfig(json));

    protected override void ParseParams() {
      String[] parts = this.query.Split('&');
      foreach(String part in parts) {
        String[] keyvalue = part.Split('=');
        if(keyvalue.Length == 2) {
          switch(keyvalue[0].ToLower()) {
            case "person-org":
              this.organisation = keyvalue[1].ToLower();
              break;
            case "person-funct":
              this.function = keyvalue[1].ToLower();
              break;
            case "person-rang":
              this.rang = keyvalue[1].ToLower();
              break;
            case "person-text":
              this.text = keyvalue[1];
              break;
            case "person-typ":
              this.typs = keyvalue[1].ToLower().Split(",");
              break;
          }
        }
      }
    }

    public static Dictionary<String, String> GenerateConfig(JsonData json) {
      Dictionary<String, String> config = new Dictionary<String, String>();
      if(json.ContainsKey("org") && json["org"].IsString) {
        config.Add("person-org", json["org"].ToString());
      }
      if(json.ContainsKey("funct") && json["funct"].IsString) {
        config.Add("person-funct", json["funct"].ToString());
      }
      if(json.ContainsKey("rang") && json["rang"].IsString) {
        config.Add("person-rang", json["rang"].ToString());
      }
      if(json.ContainsKey("text") && json["text"].IsString) {
        config.Add("person-text", json["text"].ToString());
      }
      if(json.ContainsKey("typ") && json["typ"].IsArray) {
        List<String> typs = new List<String>();
        foreach(JsonData item in json["person"]["typ"]) {
          if(item.IsString) {
            typs.Add(item.ToString());
          }
        }
        config.Add("person-typ", String.Join(",", typs));
      }
      return config;
    }

    protected override String DrawSvgContent() {
      String svg = "";
      if(this.organisation != null && this.orglookup.ContainsKey(this.organisation)) {
        svg += "<g inkscape:groupmode=\"layer\" id=\"person-layer-org\" inkscape:label=\"Organisation\">\n";
        svg += $"<g inkscape:groupmode=\"layer\" id=\"person-layer-org-{this.organisation}\" inkscape:label=\"{this.orglookup[this.organisation].Name}\">\n";
        svg += $"<rect style=\"fill: {this.orglookup[this.organisation].Color}\" height=\"50\" width=\"50\" transform=\"rotate(45)\"/>\n";
        svg += "</g>\n";
        svg += "</g>\n";
      }
      if(this.function != null && this.funclookup.ContainsKey(this.function)) {
        svg += "<g inkscape:groupmode=\"layer\" id=\"person-layer-funct\" inkscape:label=\"Funktion\">\n";
        svg += $"<g inkscape:groupmode=\"layer\" id=\"person-layer-funct-{this.function}\" inkscape:label=\"{this.funclookup[this.function].Name}\">\n";
        svg += $"<path d=\"{this.funclookup[this.function].Path}\" />\n";
        svg += "</g>\n";
        svg += "</g>\n";
      }
      if(this.rang != null && this.ranglookup.ContainsKey(this.rang)) {
        svg += "<g inkscape:groupmode=\"layer\" id=\"person-layer-rang\" inkscape:label=\"Rang\">\n";
        svg += $"<g inkscape:groupmode=\"layer\" id=\"person-layer-rang-{this.rang}\" inkscape:label=\"{this.ranglookup[this.rang].Name}\">\n";
        svg += "<g style=\"display: inline;\">\n";
        foreach(Double item in this.ranglookup[this.rang].Circles) {
          svg += $"<circle cx=\"{item.ToString(CultureInfo.InvariantCulture)}\" cy=\"-8\" r=\"3\" />\n";
        }
        svg += "</g>\n";
        svg += "</g>\n";
        svg += "</g>\n";
      }
      if(this.text != null || this.typs != null && this.typs.All(x => this.typlookup.ContainsKey(x))) {
        svg += "<g inkscape:groupmode=\"layer\" id=\"person-layer-typ\" inkscape:label=\"Typ\">\n";
        if(this.text != null && this.typs == null) {
          svg += $"<text><tspan y=\"42\" x=\"0\" id=\"person-layer-typ-text\">{this.text}</tspan></text>\n";
        }
        if(this.text == null && this.typs != null && this.typs.All(x => this.typlookup.ContainsKey(x))) {
          foreach(String typ in this.typs) {
            svg += $"<g id=\"person-layer-typ-{typ}\" inkscape:label=\"{this.typlookup[typ].Name}\">\n";
            foreach(Tuple<Double, Double, Double, Double> item in this.typlookup[typ].Lines) {
              svg += $"<line x1=\"{item.Item1.ToString(CultureInfo.InvariantCulture)}\" y1=\"{item.Item2.ToString(CultureInfo.InvariantCulture)}\" x2=\"{item.Item3.ToString(CultureInfo.InvariantCulture)}\" y2=\"{item.Item4.ToString(CultureInfo.InvariantCulture)}\" />\n";
            }
            svg += "</g>\n";
          }
        }
        svg += "</g>\n";
      }
      return svg;
    }

    private readonly Dictionary<String, Organistaion> orglookup = new Dictionary<String, Organistaion>() {
      { "thw", new Organistaion("THW", "#0069b4") },
      { "fw", new Organistaion("Feuerwehr", "#e30613") },
      { "hilo", new Organistaion("Hilo", "#ffffff") },
      { "pol", new Organistaion("Polizei", "#13a538") },
      { "fueh", new Organistaion("Führung", "#ffed00") },
      { "sonst", new Organistaion("Sonstig", "#ec6725") }
    };
    private readonly Dictionary<String, Funktion> funclookup = new Dictionary<String, Funktion>() {
      { "sonder", new Funktion("Sonder", "M -10,10 H 10") },
      { "fueh", new Funktion("Führungskraft", "M -10,10 H 10 L 0,0 Z") }
    };
    private readonly Dictionary<String, Rang> ranglookup = new Dictionary<String, Rang>() {
      { "trupp", new Rang("Truppführer", new List<Double>() { 0 }) },
      { "grupp", new Rang("Gruppenführer", new List<Double>() { -4.5, 4.5 }) },
      { "zug", new Rang("Zugführer", new List<Double>() { -9, 0, 9 }) }
    };
    private readonly Dictionary<String, Typ> typlookup = new Dictionary<String, Typ>() {
      { "loesch", new Typ("Brandbekämpfung/Löscheinsatz", new List<Tuple<Double, Double, Double, Double>>() { new Tuple<Double, Double, Double, Double>(-35, 35.5, 35, 35.5), new Tuple<Double, Double, Double, Double>(17.5, 35.5, 25, 26), new Tuple<Double, Double, Double, Double>(17.5, 35.5, 25, 44) }) },
      { "sani", new Typ("Rettungswesen, Sanitätswesen, Gesundheitswesen", new List<Tuple<Double, Double, Double, Double>>() { new Tuple<Double, Double, Double, Double>(0, 0, 0, 70), new Tuple<Double, Double, Double, Double>(-35, 35.5, 35, 35.5) }) },
      { "betreu", new Typ("Betreuung", new List<Tuple<Double, Double, Double, Double>>() { new Tuple<Double, Double, Double, Double>(-17, 53, 0, 35.5), new Tuple<Double, Double, Double, Double>(17, 53, 0, 35.5) }) }
    };

    private struct Organistaion {
      public String Name {
        get;
      }
      public String Color {
        get;
      }
      public Organistaion(String name, String color) {
        this.Name = name;
        this.Color = color;
      }
    }
    private struct Funktion {
      public String Name {
        get;
      }
      public String Path {
        get;
      }
      public Funktion(String name, String path) {
        this.Name = name;
        this.Path = path;
      }
    }
    private struct Rang {
      public String Name {
        get;
      }
      public List<Double> Circles {
        get;
      }
      public Rang(String name, List<Double> circles) {
        this.Name = name;
        this.Circles = circles;
      }
    }
    private struct Typ {
      public String Name {
        get;
      }
      public List<Tuple<Double, Double, Double, Double>> Lines {
        get;
      }
      public Typ(String name, List<Tuple<Double, Double, Double, Double>> lines) {
        this.Name = name;
        this.Lines = lines;
      }
    }
  }
}