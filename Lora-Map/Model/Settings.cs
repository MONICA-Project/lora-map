using BlubbFish.Utils;

using CoordinateSharp;
using LitJson;
using System;
using System.Collections.Generic;
using System.IO;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public class Settings : OwnSingeton<Settings> {
    
    private Int32 gridradius;

    public PublicSettings External {
      get; set;
    }

    public PrivateSettings Internal {
      get; set;
    }

    protected Settings() {
      this.External = new PublicSettings();
      this.Internal = new PrivateSettings();
      this.ParseSettingsJson();
      this.ParseGeoJson();
    }

    public void ReloadSettings(Object sender, EventArgs e) => this.ParseSettingsJson();
    public void ReloadGeo(Object sender, EventArgs e) => this.ParseGeoJson();

    private void ParseSettingsJson() {
      this.CheckJsonFiles();
      JsonData json = JsonMapper.ToObject(File.ReadAllText("json/settings.json"));
      if(json.ContainsKey("StartPos") && json["StartPos"].IsObject && json["StartPos"].ContainsKey("lat") && (json["StartPos"]["lat"].IsDouble || json["StartPos"]["lat"].IsInt) && json["StartPos"].ContainsKey("lon") && (json["StartPos"]["lon"].IsDouble || json["StartPos"]["lon"].IsInt)) {
        this.External.Startloclat = Double.Parse(json["StartPos"]["lat"].ToString());
        this.External.Startloclon = Double.Parse(json["StartPos"]["lon"].ToString());
      } else {
        this.External.Startloclat = 0;
        this.External.Startloclon = 0;
      }
      this.Internal.WeatherCellIDs.Clear();
      if(json.ContainsKey("CellIds") && json["CellIds"].IsArray && json["CellIds"].Count > 0) {
        foreach(JsonData item in json["CellIds"]) {
          if(Int32.TryParse(item.ToString(), out Int32 cellid)) {
            this.Internal.WeatherCellIDs.Add(cellid);
          }
        }
      }
      if(json.ContainsKey("FightDedection") && json["FightDedection"].IsObject) {
        Dictionary<String, Fight> fights = new Dictionary<String, Fight>();
        foreach(KeyValuePair<String, JsonData> entry in json["FightDedection"]) {
          Fight fight = new Fight {
            Polygon = new List<List<Double>>()
          };
          if(entry.Value.ContainsKey("Poly") && entry.Value["Poly"].IsArray) {
            foreach(JsonData coord in entry.Value["Poly"]) {
              List<Double> coords = new List<Double>();
              if(coord.ContainsKey("Lat") && coord["Lat"].IsDouble && coord.ContainsKey("Lon") && coord["Lon"].IsDouble) {
                coords.Add((Double)coord["Lat"]);
                coords.Add((Double)coord["Lon"]);
              }
              fight.Polygon.Add(coords);
            }
          }
          if(entry.Value.ContainsKey("Level") && entry.Value["Level"].IsDouble) {
            fight.Level = (Double)entry.Value["Level"];
          }
          if(entry.Value.ContainsKey("Alias") && entry.Value["Alias"].IsString) {
            fight.Alias = (String)entry.Value["Alias"];
          }
          fights.Add(entry.Key, fight);
        }
        this.External.FightDedection = fights;
      }
      if(json.ContainsKey("CrwodDensity") && json["CrwodDensity"].IsObject) {
        Dictionary<String, Density> densitys = new Dictionary<String, Density>();
        foreach(KeyValuePair<String, JsonData> entry in json["CrwodDensity"]) {
          Density density = new Density {
            Polygon = new List<List<Double>>()
          };
          if(entry.Value.ContainsKey("Poly") && entry.Value["Poly"].IsArray) {
            foreach(JsonData coord in entry.Value["Poly"]) {
              List<Double> coords = new List<Double>();
              if(coord.ContainsKey("Lat") && coord["Lat"].IsDouble && coord.ContainsKey("Lon") && coord["Lon"].IsDouble) {
                coords.Add((Double)coord["Lat"]);
                coords.Add((Double)coord["Lon"]);
              }
              density.Polygon.Add(coords);
            }
          }
          if(entry.Value.ContainsKey("Count") && (entry.Value["Count"].IsInt || entry.Value["Count"].IsDouble)) {
            density.Maximum = (Int32)entry.Value["Count"];
          }
          if(entry.Value.ContainsKey("Alias") && entry.Value["Alias"].IsString) {
            density.Alias = (String)entry.Value["Alias"];
          }
          densitys.Add(entry.Key, density);
        }
        this.External.DensityArea  = densitys;
      }
      if(json.ContainsKey("Sensors") && json["Sensors"].IsObject) {
        Dictionary<String, Sensor> sensors = new Dictionary<String, Sensor>();
        foreach(KeyValuePair<String, JsonData> entry in json["Sensors"]) {
          Sensor sensor = new Sensor {
            Coordinates = new List<Double>()
          };
          if(entry.Value.ContainsKey("Poly") && entry.Value["Poly"].IsObject) {
            JsonData coord = entry.Value["Poly"];
            List<Double> coords = new List<Double>();
            if(coord.ContainsKey("Lat") && coord["Lat"].IsDouble && coord.ContainsKey("Lon") && coord["Lon"].IsDouble) {
              coords.Add((Double)coord["Lat"]);
              coords.Add((Double)coord["Lon"]);
            }
            sensor.Coordinates = coords;
            if(entry.Value.ContainsKey("Level") && (entry.Value["Level"].IsInt || entry.Value["Level"].IsDouble)) {
              sensor.Level = entry.Value["Level"].IsInt ? (Int32)entry.Value["Level"] : (Double)entry.Value["Level"];
            }
            if(entry.Value.ContainsKey("Alias") && entry.Value["Alias"].IsString) {
              sensor.Alias = (String)entry.Value["Alias"];
            }
            sensors.Add(entry.Key, sensor);
          }
        }
        this.External.Sensors  = sensors;
      }
      if(json.ContainsKey("History") && json["History"].IsObject) {
        if(json["History"].ContainsKey("enabled") && json["History"]["enabled"].IsBoolean) {
          this.Internal.History.Enabled = (Boolean)json["History"]["enabled"];
        }
        if(this.Internal.History.Enabled) {
          this.Internal.History.Time = json["History"].ContainsKey("time") && json["History"]["time"].IsInt ? (Int32)json["History"]["time"] : 0;
          this.Internal.History.Amount = json["History"].ContainsKey("amount") && json["History"]["amount"].IsInt ? (Int32)json["History"]["amount"] : 0;
        } else {
          this.Internal.History.Amount = 0;
          this.Internal.History.Time = 0;
        }
      }
      this.gridradius = json.ContainsKey("GridRadius") && json["GridRadius"].IsInt && this.External.Startloclat != 0 && this.External.Startloclon != 0 ? (Int32)json["GridRadius"] : 0;
      this.GenerateGrid();
      this.FindMapLayer();
    }

    private void ParseGeoJson() {
      this.CheckJsonFiles();
      this.External.GeoLayer = JsonMapper.ToObject(File.ReadAllText("json/geo.json"));
    }

    private void GenerateGrid() {
      this.External.Grid = new Dictionary<String, List<Dictionary<String, List<Double>>>> {
        { "Major", new List<Dictionary<String, List<Double>>>() },
        { "Minor", new List<Dictionary<String, List<Double>>>() }
      };
      if(this.External.Startloclat == 0 || this.External.Startloclon == 0 || this.gridradius == 0) {
        return;
      }
      MilitaryGridReferenceSystem start = new Coordinate(this.External.Startloclat, this.External.Startloclon).MGRS;

      Double left = start.Easting - this.gridradius - (start.Easting - this.gridradius) % 100;
      Double bottom = start.Northing - this.gridradius - (start.Northing - this.gridradius) % 100;
      Double right = start.Easting + this.gridradius + (100 - (start.Easting + this.gridradius) % 100);
      Double top = start.Northing + this.gridradius + (100 - (start.Northing + this.gridradius) % 100);
      for(Double i = left; i <= right; i += 50) {
        Coordinate TopLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, i, top));
        Coordinate BottomLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, i, bottom));
        if(i % 100 == 0) {
          this.External.Grid["Major"].Add(new Dictionary<String, List<Double>> {
          { "from", new List<Double> {
              TopLeft.Latitude.DecimalDegree,
              TopLeft.Longitude.DecimalDegree
            }
          },
          { "to", new List<Double> {
              BottomLeft.Latitude.DecimalDegree,
              BottomLeft.Longitude.DecimalDegree
            }
          }
          });
        } else {
          this.External.Grid["Minor"].Add(new Dictionary<String, List<Double>> {
          { "from", new List<Double> {
              TopLeft.Latitude.DecimalDegree,
              TopLeft.Longitude.DecimalDegree
            }
          },
          { "to", new List<Double> {
              BottomLeft.Latitude.DecimalDegree,
              BottomLeft.Longitude.DecimalDegree
            }
          }
          });
        }
      }
      for(Double i = bottom; i <= top; i += 50) {
        Coordinate BottomLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, left, i));
        Coordinate BottomRight = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, right, i));
        if(i % 100 == 0) {
          this.External.Grid["Major"].Add(new Dictionary<String, List<Double>> {
          { "from", new List<Double> {
              BottomLeft.Latitude.DecimalDegree,
              BottomLeft.Longitude.DecimalDegree
            }
          },
          { "to", new List<Double> {
              BottomRight.Latitude.DecimalDegree,
              BottomRight.Longitude.DecimalDegree
            }
          }
          });
        } else {
          this.External.Grid["Minor"].Add(new Dictionary<String, List<Double>> {
          { "from", new List<Double> {
              BottomLeft.Latitude.DecimalDegree,
              BottomLeft.Longitude.DecimalDegree
            }
          },
          { "to", new List<Double> {
              BottomRight.Latitude.DecimalDegree,
              BottomRight.Longitude.DecimalDegree
            }
          }
          });
        }
      }
    }

    private void FindMapLayer() {
      this.External.Layers = new Dictionary<String, Dictionary<String, Object>> {
        { "online", new Dictionary<String, Object>() {
          { "title", "Online Map" },
          { "url", "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
          { "attribution", "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors" },
          { "minZoom", 1 },
          { "maxZoom", 19 }
        } }
      };
      if(Directory.Exists("resources" + Path.DirectorySeparatorChar + "maps")) {
        String[] dirs = Directory.GetDirectories("resources" + Path.DirectorySeparatorChar + "maps");
        foreach(String dir in dirs) {
          if(File.Exists(dir + Path.DirectorySeparatorChar + "tiles.json")) {
            try {
              JsonData map = JsonMapper.ToObject(File.ReadAllText(dir + Path.DirectorySeparatorChar + "tiles.json"));
              Dictionary<String, Object> entry = new Dictionary<String, Object> {
                { "title", (String)map["name"] },
                { "url", (String)map["tiles"][0] },
                { "attribution", (String)map["attribution"] },
                { "minZoom", (Int32)map["minzoom"] },
                { "maxZoom", (Int32)map["maxzoom"] },
                { "bounds", new Dictionary<String, Object>() {
                  { "corner1", new Double[] { (Double)map["bounds"][0], (Double)map["bounds"][1] } },
                  { "corner2", new Double[] { (Double)map["bounds"][2], (Double)map["bounds"][3] } }
                } }
              };
              this.External.Layers.Add(dir[(("resources" + Path.DirectorySeparatorChar + "maps").Length + 1)..], entry);
            } catch { }
          }
        }
      }
    }

    private void CheckJsonFiles() {
      if(!Directory.Exists("json")) {
        _ = Directory.CreateDirectory("json");
      }
      if(!File.Exists("json/settings.json")) {
        File.WriteAllText("json/settings.json", "{}");
      }
      if(!File.Exists("json/geo.json")) {
        File.WriteAllText("json/geo.json", "{}");
      }
    }

    public struct Density {
      public List<List<Double>> Polygon {
        get; set;
      }
      public Int32 Maximum {
        get; set;
      }
      public String Alias {
        get; set;
      }
    }

    public struct Fight {
      public List<List<Double>> Polygon {
        get; set;
      }
      public Double Level {
        get; set;
      }
      public String Alias {
        get; set;
      }
    }

    public struct Sensor {
      public List<Double> Coordinates {
        get; set;
      }
      public Double Level {
        get; set;
      }
      public String Alias {
        get; set;
      }
    }

    public class History {
      public Boolean Enabled {
        get; set;
      } = false;
      public Int32 Time {
        get; set;
      } = 0;
      public Int32 Amount {
        get; set;
      } = 0;
    }

    public class PublicSettings {
      public Double Startloclat {
        get; set;
      } = 0;
      public Double Startloclon {
        get; set;
      } = 0;
      public Dictionary<String, List<Dictionary<String, List<Double>>>> Grid {
        get; set;
      } = new Dictionary<String, List<Dictionary<String, List<Double>>>>();
      public Dictionary<String, Fight> FightDedection {
        get; set;
      } = new Dictionary<String, Fight>();
      public Dictionary<String, Density> DensityArea {
        get; set;
      } = new Dictionary<String, Density>();
      public Dictionary<String, Sensor> Sensors {
        get; set;
      } = new Dictionary<String, Sensor>();
      public Dictionary<String, Dictionary<String, Object>> Layers {
        get; set;
      } = new Dictionary<String, Dictionary<String, Object>>();
      public JsonData GeoLayer {
        get; set;
      }
    }

    public class PrivateSettings {
      public List<Int32> WeatherCellIDs { get; set; } = new List<Int32>();
      public History History {
        get; set;
      } = new History();
    }
  }
}
