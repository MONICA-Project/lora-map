using System;
using System.Text.RegularExpressions;
using CoordinateSharp;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public struct UTMData {
    public String MGRS;
    public String Base;
    public String FieldWidth;
    public String FieldHeight;
    public String Width;
    public String Height;

    public UTMData(Double latitude, Double longitude) {
      this.MGRS = new Coordinate(latitude, longitude).MGRS.ToString();
      String[] d = Regex.Split(this.MGRS, "([0-9]+[A-Z] [A-Z]+) ([0-9]{3})([0-9]{2}) ([0-9]{3})([0-9]{2})");
      this.Base = d[1];
      this.FieldWidth = d[2];
      this.Width = d[3];
      this.FieldHeight = d[4];
      this.Height = d[5];
    }
  }
}
