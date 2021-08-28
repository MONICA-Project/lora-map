using System;
using System.Collections.Generic;
using System.IO;

using BlubbFish.Utils;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects {
  public class NamesModel {
    public SortedDictionary<String, NamesModelData> Items {
      get;
    }

    public static Boolean CheckJson(JsonData json) {
      if(!json.IsObject) {
        return false;
      }
      foreach(String item in json.Keys) {
        if(!NamesModelData.CheckJson(json[item])) {
          return false;
        }
      }
      return true;
    }

    public NamesModel() {
      this.Items = new SortedDictionary<String, NamesModelData>();
      JsonData json = this.LoadFromFile();
      if(json != null && CheckJson(json)) {
        foreach(String item in json.Keys) {
          this.Items.Add(item, new NamesModelData(json[item]));
        }
      }
    }

    private JsonData LoadFromFile() {
      try {
        if(!Directory.Exists("json")) {
          _ = Directory.CreateDirectory("json");
        }
        if(!File.Exists("json/names.json")) {
          File.WriteAllText("json/names.json", "{}");
        }
        return JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      } catch {
        Helper.WriteError("Could not load json/names.json");
        return null;
      }
    }
  }

  public class NamesModelData {
    #region mandatory field
    public String Name {
      get;
    }
    public String Group {
      get;
    }
    #endregion

    #region optional field
    public String Icon {
      get;
    }
    public NamesModelDataMarkerSvg MarkerSvg {
      get;
    }
    #endregion

    public static Boolean CheckJson(JsonData json) =>
      json.ContainsKey("name") && json["name"].IsString
      && json.ContainsKey("Group") && json["Group"].IsString;

    public NamesModelData(JsonData json) {
      //mandatory field
      this.Name = (String)json["name"];
      this.Group = (String)json["Group"];
      //optional field
      this.MarkerSvg = json.ContainsKey("marker.svg") && json["marker.svg"].IsObject && NamesModelDataMarkerSvg.CheckJson(json["marker.svg"]) ? new NamesModelDataMarkerSvg(json["marker.svg"]) : null;
      this.Icon = json.ContainsKey("icon") && json["icon"].IsString ? (String)json["icon"] : null;
    }
  }

  public class NamesModelDataMarkerSvg {
    #region optional field
    public NamesModelDataMarkerSvgPerson Person {
      get;
    }
    #endregion

    public static Boolean CheckJson(JsonData json) =>
      json.ContainsKey("person") && json["person"].IsObject;

    public NamesModelDataMarkerSvg(JsonData json) {
      //optional field
      #pragma warning disable IDE0021 // Ausdruckskörper für Konstruktoren verwenden
      this.Person = json.ContainsKey("person") && json["person"].IsObject && NamesModelDataMarkerSvgPerson.CheckJson(json["person"]) ? new NamesModelDataMarkerSvgPerson(json["person"]) : null;
      #pragma warning restore IDE0021 // Ausdruckskörper für Konstruktoren verwenden
    }
  }

  public class NamesModelDataMarkerSvgPerson {
    #region mandatory field
    public String Funktion {
      get;
    }
    public String Organisation {
      get;
    }
    public String Rang {
      get;
    }
    #endregion

    #region optional field
    public String Text {
      get;
    }
    public List<String> Typ {
      get;
    }

    #endregion
    public static Boolean CheckJson(JsonData json) =>
      json.ContainsKey("org") && json["org"].IsString
      && json.ContainsKey("funct") && json["funct"].IsString
      && json.ContainsKey("rang") && json["rang"].IsString;

    public NamesModelDataMarkerSvgPerson(JsonData json) {
      //mandatory field
      this.Organisation = (String)json["org"];
      this.Funktion = (String)json["funct"];
      this.Rang = (String)json["rang"];
      //optional field
      this.Text = json.ContainsKey("text") && json["text"].IsString ? (String)json["text"] : null;
      List<String> typs = new List<String>();
      if(json.ContainsKey("typ") && json["typ"].IsArray) {
        foreach(JsonData item in json["typ"]) {
          if(item.IsString) {
            typs.Add(item.ToString());
          }
        }
      }
      this.Typ = typs;
    }
  }
}
