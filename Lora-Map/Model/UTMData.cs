using System;
using System.Text.RegularExpressions;
using CoordinateSharp;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public struct UTMData {
    public String MGRS;
    public Int32 FieldWidth;
    public Int32 FieldHeight;
    public Int32 Width;
    public Int32 Height;

    public UTMData(Double latitude, Double longitude) {
      this.MGRS = new Coordinate(latitude, longitude).MGRS.ToString();
      String[] d = Regex.Split(this.MGRS, "[0-9]+[A-Z] [A-Z]+ ([0-9]{3})([0-9]{2}) ([0-9]{3})([0-9]{2})");
      this.FieldWidth = Int32.Parse(d[1]);
      this.Width = Int32.Parse(d[2]);
      this.FieldHeight = Int32.Parse(d[3]);
      this.Height = Int32.Parse(d[4]);
    }
  }
}
