using System;
using System.Collections.Generic;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Connector;

namespace Fraunhofer.Fit.IoT.LoraMap {
  class Program {
    static void Main(String[] args) {
      InIReader.SetSearchPath(new List<String>() { "/etc/loramap", Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + "\\loramap" });
      if (!InIReader.ConfigExist("settings")) {
        Helper.WriteError("settings.ini not found!");
        Console.ReadLine();
        return;
      }
      if(!InIReader.ConfigExist("requests")) {
        Helper.WriteError("requests.ini not found!");
        Console.ReadLine();
        return;
      }
      InIReader ini = InIReader.GetInstance("settings");
      Dictionary<String, String> backenddata = ini.GetSection("mqtt");
      backenddata.Add("topic", "lora/#;camera/#");
      ADataBackend b = (ADataBackend)ABackend.GetInstance(backenddata, ABackend.BackendType.Data);
      new Server(b, ini.GetSection("webserver"), InIReader.GetInstance("requests"));
      while(true) {
        System.Threading.Thread.Sleep(1000);
      }
    }
  }
}
