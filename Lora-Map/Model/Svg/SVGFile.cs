using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Svg {
  public abstract class SVGFile {
    protected String query;
    protected Double width;
    protected Double height;
    protected List<Double> viewbox;
    private readonly Boolean withSvgHeader;
    protected List<String> css = new List<String>();

    public SVGFile(String query, Double width, Double heigt, List<Double> viewbox, Boolean withSvGHeader = true) {
      this.query = query;
      this.width = width;
      this.height = heigt;
      this.viewbox = viewbox;
      this.withSvgHeader = withSvGHeader;
      this.ParseParams();
      #region add css font
      if(withSvGHeader) {
        this.css.Add("@font-face {\nfont-family: DIN1451;\nsrc: url(data:application/font-woff;charset=utf-8;base64,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) format('woff');\n}");
      }
      #endregion
    }

    protected static String DictionaryConfigToString(Dictionary<String, String> config) {
      String query = "";
      if(config.Count > 0) {
        query += "?";
        List<String> queryparts = new List<String>();
        foreach(KeyValuePair<String, String> item in config) {
          queryparts.Add(HttpUtility.UrlEncode(item.Key) + "=" + HttpUtility.UrlEncode(item.Value));
        }
        query += String.Join("&", queryparts);
      }
      return query;
    }
    
    protected abstract void ParseParams();

    protected abstract String DrawSvgContent();

    public override String ToString() {
      String svg = "";
      if(this.withSvgHeader) {
        svg += "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n";
        svg += $"<svg width=\"{this.width.ToString(CultureInfo.InvariantCulture)}mm\" height=\"{this.height.ToString(CultureInfo.InvariantCulture)}mm\" viewBox=\"";
        foreach(Double item in this.viewbox) {
          svg += item.ToString(CultureInfo.InvariantCulture) + " ";
        }
        svg += "\" preserveAspectRatio=\"xMinYMin slice\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n";
      }
      if(this.css.Count > 0) {
        svg += "<defs><style type=\"text/css\">\n";
        foreach(String item in this.css) {
          svg += item + "\n";
        }
        svg += "</style></defs>\n";
      }
      svg += this.DrawSvgContent();
      if(this.withSvgHeader) {
        svg += "</svg>\n";
      }
      return svg;
    }
  }
}