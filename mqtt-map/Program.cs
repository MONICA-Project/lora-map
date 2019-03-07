﻿using System;
using System.Collections.Generic;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Connector;

namespace Fraunhofer.Fit.IoT.MqttMap {
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
      ADataBackend b = (ADataBackend)ABackend.GetInstance(ini.GetSection("mqtt"), ABackend.BackendType.Data);
      new Googlelocation(b, ini.GetSection("webserver"), InIReader.GetInstance("requests"));
      while(true) {
        System.Threading.Thread.Sleep(1000);
      }
    }
  }
}
