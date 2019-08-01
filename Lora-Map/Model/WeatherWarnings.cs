using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public class WeatherWarnings {
    private readonly Settings settings;

    public WeatherWarnings(Settings settings) { this.settings = settings;
      this.StartBackgroundThread();
    }

    private void StartBackgroundThread() {
    }
  }
}
