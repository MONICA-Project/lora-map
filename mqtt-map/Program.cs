using System;
using System.Collections.Generic;
using BlubbFish.Utils;
using BlubbFish.Utils.IoT.Connector;
using Fraunhofer.Fit.IoT.Bots.LoraBot.Moduls_broken;

namespace mqtt_map {
  class Program {
    static void Main(String[] args) {
      if(!InIReader.ConfigExist("settings")) {
        Console.WriteLine("settings.ini not found!");
        Console.ReadLine();
        return;
      }
      InIReader ini = InIReader.GetInstance("settings");
      ADataBackend b = (ADataBackend)ABackend.GetInstance(ini.GetSection("mqtt"), ABackend.BackendType.Data);
      new Googlelocation(b, ini.GetSection("google"));
      while(true) {
        System.Threading.Thread.Sleep(1000);
      }
    }
  }
}
