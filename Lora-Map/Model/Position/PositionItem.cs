using System;
using System.Collections.Generic;
using System.Linq;

using Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects;
using Fraunhofer.Fit.IoT.LoraMap.Model.Svg;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Position {
  public class PositionItem {
    private Double _lastLat = 0;
    private Double _lastLon = 0;
    private readonly SortedDictionary<DateTime, Double[]> _history = new SortedDictionary<DateTime, Double[]>();
    private String _lastHash = "";
    private Boolean _isdublicate = false;

    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Lorarecievedtime { get; private set; }
    public DateTime Recievedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public UTMData UTM { get; private set; }
    public Double Hdop { get; private set; }
    public DateTime Lastgpspostime { get; private set; }
    public Double Battery { get; private set; }
    public Int32 Batterysimple { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }
    public String Name { get; private set; }
    public String Icon { get; private set; }
    public String MenuIcon { get; private set; }
    public String Group { get; private set; }
    public List<Double[]> History => this._history.Values.ToList();

    public PositionItem(LoraData data, NamesModel marker) {
      this.Update(data);
      this.UpdateMarker(marker, data.Name);
    }

    public void UpdateMarker(NamesModel marker, String id) {
      if(marker.Items.ContainsKey(id)) {
        this.Name = marker.Items[id].Name;
        Tuple<String, String> icons = this.ParseIconConfig(marker.Items[id]);
        this.Icon = icons.Item1;
        this.MenuIcon = icons.Item2;
        this.Group = marker.Items[id].Group;
      } else {
        this.Name = id;
        this.Icon = null;
        this.Group = null;
      }
    }

    private Tuple<String, String> ParseIconConfig(NamesModelData marker) {
      String icon = null;
      String menu = null;
      if(marker.MarkerSvg != null) {
        icon = SVGMarker.ParseConfig(marker.MarkerSvg, this.Name);
        if(marker.MarkerSvg.Person != null) {
          menu = SVGPerson.ParseConfig(marker.MarkerSvg.Person);
        }
      } else if(marker.Icon != null) {
        icon = marker.Icon;
      }
      return new Tuple<String, String>(icon, menu);
    }

    public virtual void Update(LoraData data) {
      this._isdublicate = false;
      if(data.Hash == this._lastHash) {
        if(!data.CorrectInterface) {
          Console.WriteLine("dublicate-Paket, reomove wrong reciever!");
          return;
        }
        this._isdublicate = true;
        Console.WriteLine("dublicate-Paket!");
      }
      this._lastHash = data.Hash;
      this.Rssi = data.Rssi;
      this.Snr = data.Snr;
      this.Lorarecievedtime = data.Receivedtime;
      this.Recievedtime = DateTime.UtcNow;
      this.Battery = Math.Round(data.BatteryLevel, 2);
      this.Batterysimple = this.Battery < 3.44 ? 0 : this.Battery < 3.53 ? 1 : this.Battery < 3.6525 ? 2 : this.Battery < 3.8825 ? 3 : 4;

      this.Latitude = data.Gps.Latitude;
      this.Longitude = data.Gps.Longitude;
      this.Fix = data.Gps.Fix;
      this.Height = data.Gps.Height;
      this.Hdop = data.Gps.Hdop;

      if(!this.Fix) {
        this.Latitude = this._lastLat;
        this.Longitude = this._lastLon;
      } else {
        this._lastLat = this.Latitude;
        this._lastLon = this.Longitude;
        this.Lastgpspostime = DateTime.UtcNow;
        if(!this._isdublicate) {
          this.StoreHistory();
        }
      }
      this.UTM = new UTMData(this.Latitude, this.Longitude);      
    }

    private void StoreHistory() {
      if(Settings.Instance.Internal.History.Enabled) {
        if(Settings.Instance.Internal.History.Amount != 0 && this._history.Count > Settings.Instance.Internal.History.Amount) {
          _ = this._history.Remove(this._history.Keys.ToList().First());
        }
        if(Settings.Instance.Internal.History.Time != 0) {
          List<DateTime> removeCandidates = new List<DateTime>();
          DateTime now = DateTime.UtcNow;
          foreach(KeyValuePair<DateTime, Double[]> item in this._history) {
            if((now - item.Key).TotalSeconds > Settings.Instance.Internal.History.Time) {
              removeCandidates.Add(item.Key);
            }
          }
          if(removeCandidates.Count > 0) {
            foreach(DateTime item in removeCandidates) {
              _ = this._history.Remove(item);
            }
          }
        }
        if(!this._history.ContainsKey(this.Recievedtime)) {
          this._history.Add(this.Recievedtime, new Double[] { this.Latitude, this.Longitude });
        }
      } else {
        this._history.Clear();
      }
    }
  }
}
