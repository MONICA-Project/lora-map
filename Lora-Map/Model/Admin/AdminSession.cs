using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Admin {
  class AdminSession {
    public Boolean IsLoggedin { get; internal set; }
    public static Int64 GetRandomSessionid() {
      Byte[] buf = new Byte[8];
      Random rand = new Random();
      rand.NextBytes(buf);
      return BitConverter.ToInt64(buf, 0);
    }
  }
}
