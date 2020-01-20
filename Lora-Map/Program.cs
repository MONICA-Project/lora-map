using System;
using System.Collections.Generic;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Connector;

namespace Fraunhofer.Fit.IoT.LoraMap {
  class Program {
    static void Main(String[] _1) {
      InIReader.SetSearchPath(new List<String>() { "/etc/loramap", Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "\\loramap" });
      if (!InIReader.ConfigExist("settings")) {
        Helper.WriteError("settings.ini not found!");
        _ = Console.ReadLine();
        return;
      }
      InIReader ini = InIReader.GetInstance("settings");
      Dictionary<String, String> backenddata = ini.GetSection("mqtt");
      backenddata.Add("topic", "lora/#;camera/#;sfn/#");
      ADataBackend b = (ADataBackend)ABackend.GetInstance(backenddata, ABackend.BackendType.Data);
      _ = new Server(b, ini.GetSection("webserver"));
    }
  }
}
