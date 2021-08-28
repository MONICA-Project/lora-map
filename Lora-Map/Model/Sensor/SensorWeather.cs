using System;
using System.Collections.Generic;
using System.Threading;

using Fraunhofer.Fit.IoT.LoraMap.Lib;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Sensor {
  public class SensorWeather {
    private Thread bgthread;
    private Boolean backgroundrunnerAlive;
    private readonly WebRequests webrequests = new WebRequests();

    public List<Warning> Warnungen { get; private set; }

    public SensorWeather() => this.StartBackgroundThread();

    private void StartBackgroundThread() {
      this.Warnungen = new List<Warning>();
      this.bgthread = new Thread(this.BackGroundRunner);
      this.backgroundrunnerAlive = true;
      this.bgthread.Start();
    }

    private void BackGroundRunner() {
      while(this.backgroundrunnerAlive) {
        try {
          List<Warning> ret = new List<Warning>();
          foreach(Int32 item in Settings.Instance.Internal.WeatherCellIDs) {
            try {
              JsonData json = this.webrequests.GetJson("https://maps.dwd.de/geoserver/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeName=dwd:Warnungen_Gemeinden&outputFormat=application/json&cql_filter=WARNCELLID=" + item);
              if(json.ContainsKey("features") && json["features"].IsArray && json["features"].Count > 0) {
                foreach(JsonData warning in json["features"]) {
                  try {
                    ret.Add(new Warning(warning));
                  } catch { }
                }
              }
            } catch { }
          }
          this.Warnungen = ret;
          for(Int32 i = 0; i < 1000; i++) {
            if(this.backgroundrunnerAlive) {
              Thread.Sleep(60);
            }
          }
        } catch { }
      }
    }

    public void Dispose() {
      try {
        this.backgroundrunnerAlive = false;
        while (this.bgthread != null && this.bgthread.IsAlive) {
          Thread.Sleep(10);
        }
        this.bgthread = null;
      } catch { }
    }

    public class Warning {
      public Warning(JsonData warning) {
        this.Id = warning["id"].ToString();
        this.From = warning["properties"]["SENT"].ToString();
        this.To = warning["properties"]["EXPIRES"].ToString();
        this.Location = warning["properties"]["NAME"].ToString();
        this.Type = warning["properties"]["EVENT"].ToString().ToLower();
        this.Level = warning["properties"]["SEVERITY"].ToString().ToLower();
        this.Headline = warning["properties"]["HEADLINE"].ToString();
        this.Body = warning["properties"]["DESCRIPTION"].ToString();
        this.Instructions = warning["properties"]["INSTRUCTION"] != null ? warning["properties"]["INSTRUCTION"].ToString() : "";
      }

      public String Id { get; }
      public String From { get; }
      public String To { get; }
      public String Location { get; }
      public String Type { get; }
      public String Level { get; }
      public String Headline { get; }
      public String Body { get; }
      public String Instructions { get; }
    }
  }

  
}

/* https://maps.dwd.de/geoserver/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeName=dwd:Warnungen_Gemeinden&outputFormat=application/json&cql_filter=WARNCELLID=805314000
 * {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "Warnungen_Gemeinden.805314000.2.49.0.1.276.0.DWD.PVW.1565627520000.4edfa973-5fef-4b97-8990-7489828dbe5b.DEU",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [ 7.2072, 50.7395 ],
              [ 7.1534, 50.7599 ],
              [ 7.1255, 50.7744 ],
              [ 7.105, 50.7622 ],
              [ 7.0768, 50.7679 ],
              [ 7.0666, 50.7705 ],
              [ 7.0378, 50.7558 ],
              [ 7.0256, 50.7054 ],
              [ 7.0385, 50.6886 ],
              [ 7.0255, 50.665 ],
              [ 7.0473, 50.6391 ],
              [ 7.0639, 50.6309 ],
              [ 7.1054, 50.6595 ],
              [ 7.1278, 50.6472 ],
              [ 7.1564, 50.6547 ],
              [ 7.1954, 50.6434 ],
              [ 7.2119, 50.649 ],
              [ 7.1972, 50.6648 ],
              [ 7.1679, 50.7035 ],
              [ 7.1969, 50.7138 ],
              [ 7.2072, 50.7395 ]
            ]
          ]
        ]
      },
      "geometry_name": "THE_GEOM",
      "properties": {
        "AREADESC": "Bonn",
        "NAME": "Stadt Bonn",
        "WARNCELLID": 805314000,
        "IDENTIFIER": "2.49.0.1.276.0.DWD.PVW.1565627520000.4edfa973-5fef-4b97-8990-7489828dbe5b.DEU",
        "SENDER": "CAP@dwd.de",
        "SENT": "2019-08-12T16:32:00Z",
        "STATUS": "Actual",
        "MSGTYPE": "Update",
        "SOURCE": "PVW",
        "SCOPE": "Public",
        "CODE": "id:2.49.0.1.276.0.DWD.PVW.1565627520000.4edfa973-5fef-4b97-8990-7489828dbe5b",
        "LANGUAGE": "de-DE",
        "CATEGORY": "Met",
        "EVENT": "GEWITTER",
        "RESPONSETYPE": "Prepare",
        "URGENCY": "Immediate",
        "SEVERITY": "Minor",
        "CERTAINTY": "Likely",
        "EC_PROFILE": "2.1",
        "EC_LICENSE": "Geobasisdaten: Copyright Bundesamt für Kartographie und Geodäsie, Frankfurt am Main, 2017",
        "EC_II": "31",
        "EC_GROUP": "THUNDERSTORM;WIND",
        "EC_AREA_COLOR": "255 255 0",
        "EFFECTIVE": "2019-08-12T16:32:00Z",
        "ONSET": "2019-08-12T16:32:00Z",
        "EXPIRES": "2019-08-12T17:00:00Z",
        "SENDERNAME": "DWD / Nationales Warnzentrum Offenbach",
        "HEADLINE": "Amtliche WARNUNG vor GEWITTER",
        "DESCRIPTION": "Von Südwesten ziehen einzelne Gewitter auf. Dabei gibt es Windböen mit Geschwindigkeiten um 60 km/h (17m/s, 33kn, Bft 7).",
        "INSTRUCTION": "ACHTUNG! Hinweis auf mögliche Gefahren: Örtlich kann es Blitzschlag geben. Bei Blitzschlag besteht Lebensgefahr!",
        "WEB": "http://www.wettergefahren.de",
        "CONTACT": "Deutscher Wetterdienst",
        "PARAMETERNAME": "Böen;Gewitter;Gewitteraufzugsrichtung",
        "PARAMETERVALUE": "~60 [km/h];einzelne;SW",
        "ALTITUDE": 0,
        "CEILING": 9842.5197,
        "bbox": [ 7.0255, 50.6309, 7.2119, 50.7744 ]
      }
    }
  ],
  "totalFeatures": 1,
  "numberMatched": 1,
  "numberReturned": 1,
  "timeStamp": "2019-08-12T16:42:20.743Z",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:EPSG::4326" }
  },
  "bbox": [ 50.6309, 7.0255, 50.7744, 7.2119 ]
}
*/
