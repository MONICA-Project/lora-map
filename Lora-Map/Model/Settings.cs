using CoordinateSharp;
using LitJson;
using System;
using System.Collections.Generic;
using System.IO;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public class Settings {
    private readonly List<Int32> weatherCellIDs = new List<Int32>();
    private Int32 gridradius;

    public Double Startloclat { get; private set; }
    public Double Startloclon { get; private set; }
    public Dictionary<String, List<Dictionary<String, List<Double>>>> Grid { get; private set; }

    public Settings() => this.ParseJson();
    
    public void AdminModelUpdateSettings(Object sender, EventArgs e) => this.ParseJson();

    private void ParseJson() {
      JsonData json = JsonMapper.ToObject(File.ReadAllText("json/settings.json"));
      if(json.ContainsKey("StartPos") && json["StartPos"].IsObject &&
        json["StartPos"].ContainsKey("lat") && json["StartPos"]["lat"].IsDouble &&
        json["StartPos"].ContainsKey("lon") && json["StartPos"]["lon"].IsDouble) {
        this.Startloclat = (Double)json["StartPos"]["lat"];
        this.Startloclon = (Double)json["StartPos"]["lon"];
      } else {
        this.Startloclat = 0;
        this.Startloclon = 0;
      }
      this.weatherCellIDs.Clear();
      if (json.ContainsKey("CellIds") && json["CellIds"].IsArray && json["CellIds"].Count > 0) {
        foreach (JsonData item in json["CellIds"]) {
          if(Int32.TryParse(item.ToString(), out Int32 cellid)) {
            this.weatherCellIDs.Add(cellid);
          }
        }
      }
      this.gridradius = json.ContainsKey("GridRadius") && json["GridRadius"].IsInt && this.Startloclat != 0 && this.Startloclon != 0 ? (Int32)json["GridRadius"] : 0;
      this.GenerateGrid();
    }

    private void GenerateGrid() {
      if(this.Startloclat == 0 || this.Startloclon == 0 || this.gridradius == 0) {
        return;
      }
      MilitaryGridReferenceSystem start = new Coordinate(this.Startloclat, this.Startloclon).MGRS;

      Double left = start.Easting - this.gridradius - (start.Easting - this.gridradius) % 100;
      Double bottom = start.Northing - this.gridradius - (start.Northing - this.gridradius) % 100;
      Double right = start.Easting + this.gridradius + (100 - (start.Easting + this.gridradius) % 100);
      Double top = start.Northing + this.gridradius + (100 - (start.Northing + this.gridradius) % 100);
      this.Grid = new Dictionary<String, List<Dictionary<String, List<Double>>>> {
        { "Major", new List<Dictionary<String, List<Double>>>() },
        { "Minor", new List<Dictionary<String, List<Double>>>() }
      };
      for (Double i = left; i <= right; i += 50) {
        Coordinate TopLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, i, top));
        Coordinate BottomLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, i, bottom));
        if(i%100 == 0) {
          this.Grid["Major"].Add(new Dictionary<String, List<Double>> {
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
          this.Grid["Minor"].Add(new Dictionary<String, List<Double>> {
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
      for (Double i = bottom; i <= top; i += 50) {
        Coordinate BottomLeft = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, left, i));
        Coordinate BottomRight = MilitaryGridReferenceSystem.MGRStoLatLong(new MilitaryGridReferenceSystem(start.LatZone, start.LongZone, start.Digraph, right, i));
        if (i % 100 == 0) {
          this.Grid["Major"].Add(new Dictionary<String, List<Double>> {
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
          this.Grid["Minor"].Add(new Dictionary<String, List<Double>> {
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

    public List<Int32> GetWeatherCellIds() => this.weatherCellIDs;
  }
}
