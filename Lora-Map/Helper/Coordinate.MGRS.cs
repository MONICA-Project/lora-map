using System;
using System.Linq;
using System.Diagnostics;
using System.ComponentModel;

namespace CoordinateSharp {
  /// <summary>
  /// Military Grid Reference System (MGRS). Uses the WGS 84 Datum.
  /// Relies upon values from the UniversalTransverseMercator class
  /// </summary>
  [Serializable]
  public class MilitaryGridReferenceSystem : INotifyPropertyChanged {
    /// <summary>
    /// Create an MGRS object with WGS84 datum
    /// </summary>
    /// <param name="latz">Lat Zone</param>
    /// <param name="longz">Long Zone</param>
    /// <param name="d">Digraph</param>
    /// <param name="e">Easting</param>
    /// <param name="n">Northing</param>
    public MilitaryGridReferenceSystem(String latz, Int32 longz, String d, Double e, Double n) {
      String digraphLettersE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      String digraphLettersN = "ABCDEFGHJKLMNPQRSTUV";
      if(longz < 1 || longz > 60) { Debug.WriteLine("Longitudinal zone out of range", "UTM longitudinal zones must be between 1-60."); }
      if(!Verify_Lat_Zone(latz)) { throw new ArgumentException("Latitudinal zone invalid", "UTM latitudinal zone was unrecognized."); }
      if(n < 0 || n > 10000000) { throw new ArgumentOutOfRangeException("Northing out of range", "Northing must be between 0-10,000,000."); }
      if(d.Count() < 2 || d.Count() > 2) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      if(digraphLettersE.ToCharArray().ToList().Where(x => x.ToString() == d.ToUpper()[0].ToString()).Count() == 0) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      if(digraphLettersN.ToCharArray().ToList().Where(x => x.ToString() == d.ToUpper()[1].ToString()).Count() == 0) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      this.LatZone = latz;
      this.LongZone = longz;
      this.Digraph = d;
      this.Easting = e;
      this.Northing = n;
      //WGS84
      this.equatorialRadius = 6378137.0;
      this.inverseFlattening = 298.257223563;

    }
    /// <summary>
    /// Create an MGRS object with custom datum
    /// </summary>
    /// <param name="latz">Lat Zone</param>
    /// <param name="longz">Long Zone</param>
    /// <param name="d">Digraph</param>
    /// <param name="e">Easting</param>
    /// <param name="n">Northing</param>
    /// <param name="rad">Equatorial Radius</param>
    /// <param name="flt">Inverse Flattening</param>
    public MilitaryGridReferenceSystem(String latz, Int32 longz, String d, Double e, Double n, Double rad, Double flt) {
      String digraphLettersE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      String digraphLettersN = "ABCDEFGHJKLMNPQRSTUV";
      if(longz < 1 || longz > 60) { Debug.WriteLine("Longitudinal zone out of range", "UTM longitudinal zones must be between 1-60."); }
      if(!Verify_Lat_Zone(latz)) { throw new ArgumentException("Latitudinal zone invalid", "UTM latitudinal zone was unrecognized."); }
      if(n < 0 || n > 10000000) { throw new ArgumentOutOfRangeException("Northing out of range", "Northing must be between 0-10,000,000."); }
      if(d.Count() < 2 || d.Count() > 2) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      if(digraphLettersE.ToCharArray().ToList().Where(x => x.ToString() == d.ToUpper()[0].ToString()).Count() == 0) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      if(digraphLettersN.ToCharArray().ToList().Where(x => x.ToString() == d.ToUpper()[1].ToString()).Count() == 0) { throw new ArgumentException("Digraph invalid", "MGRS Digraph was unrecognized."); }
      this.LatZone = latz;
      this.LongZone = longz;
      this.Digraph = d;
      this.Easting = e;
      this.Northing = n;

      this.equatorialRadius = rad;
      this.inverseFlattening = flt;
    }

    private Double equatorialRadius;
    private Double inverseFlattening;

    private Boolean Verify_Lat_Zone(String l) {
      if(LatZones.longZongLetters.Where(x => x == l.ToUpper()).Count() != 1) {
        return false;
      }
      return true;
    }


    /// <summary>
    /// MGRS Zone Letter
    /// </summary>
    public String LatZone { get; private set; }

    /// <summary>
    /// MGRS Zone Number
    /// </summary>
    public Int32 LongZone { get; private set; }

    /// <summary>
    /// MGRS Easting
    /// </summary>
    public Double Easting { get; private set; }

    /// <summary>
    /// MGRS Northing
    /// </summary>
    public Double Northing { get; private set; }

    /// <summary>
    /// MGRS Digraph
    /// </summary>
    public String Digraph { get; private set; }

    /// <summary>
    /// Is MGRS conversion within the coordinate system's accurate boundaries after conversion from Lat/Long.
    /// </summary>
    public Boolean WithinCoordinateSystemBounds { get; private set; } = true;

    internal MilitaryGridReferenceSystem(UniversalTransverseMercator utm) => ToMGRS(utm);
    internal void ToMGRS(UniversalTransverseMercator utm) {
      Digraphs digraphs = new Digraphs();

      String digraph1 = digraphs.getDigraph1(utm.LongZone, utm.Easting);
      String digraph2 = digraphs.getDigraph2(utm.LongZone, utm.Northing);

      this.Digraph = digraph1 + digraph2;
      this.LatZone = utm.LatZone;
      this.LongZone = utm.LongZone;

      //String easting = String.valueOf((int)_easting);
      String e = ((Int32)utm.Easting).ToString();
      if(e.Length < 5) {
        e = "00000" + ((Int32)utm.Easting).ToString();
      }
      e = e.Substring(e.Length - 5);

      this.Easting = Convert.ToInt32(e);

      String n = ((Int32)utm.Northing).ToString();
      if(n.Length < 5) {
        n = "0000" + ((Int32)utm.Northing).ToString();
      }
      n = n.Substring(n.Length - 5);

      this.Northing = Convert.ToInt32(n);
      this.equatorialRadius = utm.equatorial_radius;
      this.inverseFlattening = utm.inverse_flattening;

      this.WithinCoordinateSystemBounds = utm.WithinCoordinateSystemBounds;
    }

    /// <summary>
    /// Creates a Coordinate object from an MGRS/NATO UTM Coordinate
    /// </summary>
    /// <param name="mgrs">MilitaryGridReferenceSystem</param>
    /// <returns>Coordinate object</returns>
    public static Coordinate MGRStoLatLong(MilitaryGridReferenceSystem mgrs) {
      String latz = mgrs.LatZone;
      String digraph = mgrs.Digraph;

      Char eltr = digraph[0];
      Char nltr = digraph[1];

      String digraphLettersE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      String digraphLettersN = "ABCDEFGHJKLMNPQRSTUV";
      String digraphLettersAll = "";
      for(Int32 lt = 1; lt < 25; lt++) {
        digraphLettersAll += "ABCDEFGHJKLMNPQRSTUV";
      }

      Int32 eidx = digraphLettersE.IndexOf(eltr);
      Int32 nidx = digraphLettersN.IndexOf(nltr);
      if(mgrs.LongZone / 2.0 == Math.Floor(mgrs.LongZone / 2.0)) {
        nidx -= 5;  // correction for even numbered zones
      }

      Double ebase = 100000 * (1 + eidx - 8 * Math.Floor(Convert.ToDouble(eidx) / 8));
      Int32 latBand = digraphLettersE.IndexOf(latz);
      Int32 latBandLow = 8 * latBand - 96;
      Int32 latBandHigh = 8 * latBand - 88;

      if(latBand < 2) {
        latBandLow = -90;
        latBandHigh = -80;
      } else if(latBand == 21) {
        latBandLow = 72;
        latBandHigh = 84;
      } else if(latBand > 21) {
        latBandLow = 84;
        latBandHigh = 90;
      }

      Double lowLetter = Math.Floor(100 + 1.11 * latBandLow);
      Double highLetter = Math.Round(100 + 1.11 * latBandHigh);

      String latBandLetters = null;
      Int32 l = Convert.ToInt32(lowLetter);
      Int32 h = Convert.ToInt32(highLetter);
      if(mgrs.LongZone / 2.0 == Math.Floor(mgrs.LongZone / 2.0)) {
        latBandLetters = digraphLettersAll.Substring(l + 5, h + 5).ToString();
      } else {
        latBandLetters = digraphLettersAll.Substring(l, h).ToString();
      }
      Double nbase = 100000 * (lowLetter + latBandLetters.IndexOf(nltr));
      //latBandLetters.IndexOf(nltr) value causing incorrect Northing below -80
      Double x = ebase + mgrs.Easting;
      Double y = nbase + mgrs.Northing;
      if(y > 10000000) {
        y = y - 10000000;
      }
      if(nbase >= 10000000) {
        y = nbase + mgrs.Northing - 10000000;
      }

      Boolean southern = nbase < 10000000;
      UniversalTransverseMercator utm = new UniversalTransverseMercator(mgrs.LatZone, mgrs.LongZone, x, y) {
        equatorial_radius = mgrs.equatorialRadius,
        inverse_flattening = mgrs.inverseFlattening
      };
      Coordinate c = UniversalTransverseMercator.ConvertUTMtoLatLong(utm);

      c.Set_Datum(mgrs.equatorialRadius, mgrs.inverseFlattening);

      return c;
    }

    /// <summary>
    /// MGRS Default String Format
    /// </summary>
    /// <returns>MGRS Formatted Coordinate String</returns>
    public override String ToString() {
      if(!this.WithinCoordinateSystemBounds) { return ""; }//MGRS Coordinate is outside its reliable boundaries. Return empty.
      return this.LongZone.ToString() + this.LatZone + " " + this.Digraph + " " + ((Int32)this.Easting).ToString("00000") + " " + ((Int32)this.Northing).ToString("00000");
    }
    /// <summary>
    /// Property changed event
    /// </summary>
    public event PropertyChangedEventHandler PropertyChanged;
    /// <summary>
    /// Notify property changed
    /// </summary>
    /// <param name="propName">Property name</param>
    public void NotifyPropertyChanged(String propName) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
  }
}
