# Lora-Internal-Flow 1.0.0 documentation



Internal Communication for:
* Lora-Gateway
* Lora-Map


## Table of Contents



* [Servers](#servers)


* [Channels](#channels)





<a name="servers"></a>
## Servers

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Protocol</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
      <td>127.0.0.1:{port}</td>
      <td>mqtt</td>
      <td>Lora-Broker</td>
    </tr>
    <tr>
      <td colspan="3">
        <details>
          <summary>URL Variables</summary>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Default value</th>
                <th>Possible values</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>port</td>
                <td>
                    1883
                  </td>
                <td>
                  <ul><li>1883</li><li>8883</li></ul>
                  </td>
                <td>Secure connection (TLS) is available through port 8883.</td>
              </tr>
              </tbody>
          </table>
        </details>
      </td>
    </tr>
    <tr>
      <td colspan="3">
        <details>
          <summary>Security Requirements</summary>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>In</th>
                <th>Name</th>
                <th>Scheme</th>
                <th>Format</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody><tr>
                <td>userPassword</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><p>Using Username and Password to connect to online broker</p>
</td>
              </tr></tbody>
          </table>
        </details>
      </td>
    </tr>
    </tbody>
</table>






## Channels



<a name="channel-lora/data/{deviceID}"></a>


Topic witch contains the tracking data.




#### Channel Parameters



##### deviceID


The ID of the streetlight.



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>deviceID </td>
  <td>
    
    string</td>
  <td></td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>





###  `subscribe` lora/data/{deviceID}

#### Message



Informs you about a Position and Status of a Tracker







##### Payload




<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>Bandwidth </td>
  <td>
    
    integer</td>
  <td><p>Bandwidth on witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>BatteryLevel </td>
  <td>
    
    number</td>
  <td><p>Voltage of the battery from the device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Calculatedcrc </td>
  <td>
    
    integer</td>
  <td><p>The calculated CRC</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Codingrate </td>
  <td>
    
    integer</td>
  <td><p>The Codingrate in witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Crcstatus </td>
  <td>
    
    string</td>
  <td><p>Shows the CRC-Status in a Field</p>
</td>
  <td><code>Ok</code>, <code>Bad</code>, <code>No</code></td>
</tr>






    
      
<tr>
  <td>Frequency </td>
  <td>
    
    integer</td>
  <td><p>The Frequency on that the Message was arrived</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Gps </td>
  <td>
    
    object</td>
  <td><p>Gps-Data of a Message</p>
</td>
  <td><em>Any</em></td>
</tr>




<tr>
  <td>Gps.Fix </td>
  <td>
    
    boolean</td>
  <td><p>Status of the Tracker, true if it has GPS-Signal</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Hdop </td>
  <td>
    
    number</td>
  <td><p>Dislocation from GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Height </td>
  <td>
    
    number</td>
  <td><p>Height of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastGPSPos </td>
  <td>
    
    string</td>
  <td><p>Timestamp when the GPS-Reciever has its last position</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastLatitude </td>
  <td>
    
    number</td>
  <td><p>Last Latitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastLongitude </td>
  <td>
    
    number</td>
  <td><p>Last Longitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Latitude </td>
  <td>
    
    number</td>
  <td><p>Latitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Longitude </td>
  <td>
    
    number</td>
  <td><p>Longitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Time </td>
  <td>
    
    string</td>
  <td><p>Timestamp of the GPS-Reciever, that it gets from the Satelites</p>
</td>
  <td><em>Any</em></td>
</tr>










    
      
<tr>
  <td>Host </td>
  <td>
    
    string</td>
  <td><p>Name of the Gateway that Recieves the Data</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Name </td>
  <td>
    
    string</td>
  <td><p>Name of the GPS-Tracker, must be unique between every Device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>PacketRssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the whole LORA-Messgae</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Receivedtime </td>
  <td>
    
    string</td>
  <td><p>Timestamp of the Gateway, when it recieves the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverinterface </td>
  <td>
    
    integer</td>
  <td><p>Internal virtual Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverradio </td>
  <td>
    
    integer</td>
  <td><p>Internal Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Rssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snr </td>
  <td>
    
    number</td>
  <td><p>Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmax </td>
  <td>
    
    number</td>
  <td><p>Maximum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmin </td>
  <td>
    
    number</td>
  <td><p>Minimum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Spreadingfactor </td>
  <td>
    
    integer</td>
  <td><p>The Spreadingfactor of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Time </td>
  <td>
    
    integer</td>
  <td><p>Internal Timecounter of the LORA-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>



###### Example of payload _(generated)_

```json
{
  "Bandwidth": 7800,
  "BatteryLevel": 2.5,
  "Calculatedcrc": 0,
  "Codingrate": 5,
  "Crcstatus": "Ok",
  "Frequency": 0,
  "Gps": {
    "Fix": true,
    "Hdop": 0.8,
    "Height": 0,
    "LastGPSPos": "01/01/2019 12:00:00",
    "LastLatitude": 50.7,
    "LastLongitude": 7.2,
    "Latitude": 50.7,
    "Longitude": 7.2,
    "Time": "01/01/2019 12:00:00"
  },
  "Host": "string",
  "Name": "string",
  "PacketRssi": 0,
  "Receivedtime": "01/01/2019 12:00:00",
  "Recieverinterface": 0,
  "Recieverradio": 0,
  "Rssi": 0,
  "Snr": 0,
  "Snrmax": 0,
  "Snrmin": 0,
  "Spreadingfactor": 7,
  "Time": 0
}
```








<a name="channel-lora/panic/{deviceID}"></a>


Topic witch contains the tracking data, when the panic buttons was pressed




#### Channel Parameters



##### deviceID


The ID of the streetlight.



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>deviceID </td>
  <td>
    
    string</td>
  <td></td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>





###  `subscribe` lora/panic/{deviceID}

#### Message



Informs you about a Position and Status of a Tracker







##### Payload




<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>Bandwidth </td>
  <td>
    
    integer</td>
  <td><p>Bandwidth on witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>BatteryLevel </td>
  <td>
    
    number</td>
  <td><p>Voltage of the battery from the device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Calculatedcrc </td>
  <td>
    
    integer</td>
  <td><p>The calculated CRC</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Codingrate </td>
  <td>
    
    integer</td>
  <td><p>The Codingrate in witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Crcstatus </td>
  <td>
    
    string</td>
  <td><p>Shows the CRC-Status in a Field</p>
</td>
  <td><code>Ok</code>, <code>Bad</code>, <code>No</code></td>
</tr>






    
      
<tr>
  <td>Frequency </td>
  <td>
    
    integer</td>
  <td><p>The Frequency on that the Message was arrived</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Gps </td>
  <td>
    
    object</td>
  <td><p>Gps-Data of a Message</p>
</td>
  <td><em>Any</em></td>
</tr>




<tr>
  <td>Gps.Fix </td>
  <td>
    
    boolean</td>
  <td><p>Status of the Tracker, true if it has GPS-Signal</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Hdop </td>
  <td>
    
    number</td>
  <td><p>Dislocation from GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Height </td>
  <td>
    
    number</td>
  <td><p>Height of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastGPSPos </td>
  <td>
    
    string</td>
  <td><p>Timestamp when the GPS-Reciever has its last position</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastLatitude </td>
  <td>
    
    number</td>
  <td><p>Last Latitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.LastLongitude </td>
  <td>
    
    number</td>
  <td><p>Last Longitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Latitude </td>
  <td>
    
    number</td>
  <td><p>Latitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Longitude </td>
  <td>
    
    number</td>
  <td><p>Longitude of the GPS-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>








<tr>
  <td>Gps.Time </td>
  <td>
    
    string</td>
  <td><p>Timestamp of the GPS-Reciever, that it gets from the Satelites</p>
</td>
  <td><em>Any</em></td>
</tr>










    
      
<tr>
  <td>Host </td>
  <td>
    
    string</td>
  <td><p>Name of the Gateway that Recieves the Data</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Name </td>
  <td>
    
    string</td>
  <td><p>Name of the GPS-Tracker, must be unique between every Device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>PacketRssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the whole LORA-Messgae</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Receivedtime </td>
  <td>
    
    string</td>
  <td><p>Timestamp of the Gateway, when it recieves the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverinterface </td>
  <td>
    
    integer</td>
  <td><p>Internal virtual Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverradio </td>
  <td>
    
    integer</td>
  <td><p>Internal Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Rssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snr </td>
  <td>
    
    number</td>
  <td><p>Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmax </td>
  <td>
    
    number</td>
  <td><p>Maximum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmin </td>
  <td>
    
    number</td>
  <td><p>Minimum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Spreadingfactor </td>
  <td>
    
    integer</td>
  <td><p>The Spreadingfactor of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Time </td>
  <td>
    
    integer</td>
  <td><p>Internal Timecounter of the LORA-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>



###### Example of payload _(generated)_

```json
{
  "Bandwidth": 7800,
  "BatteryLevel": 2.5,
  "Calculatedcrc": 0,
  "Codingrate": 5,
  "Crcstatus": "Ok",
  "Frequency": 0,
  "Gps": {
    "Fix": true,
    "Hdop": 0.8,
    "Height": 0,
    "LastGPSPos": "01/01/2019 12:00:00",
    "LastLatitude": 50.7,
    "LastLongitude": 7.2,
    "Latitude": 50.7,
    "Longitude": 7.2,
    "Time": "01/01/2019 12:00:00"
  },
  "Host": "string",
  "Name": "string",
  "PacketRssi": 0,
  "Receivedtime": "01/01/2019 12:00:00",
  "Recieverinterface": 0,
  "Recieverradio": 0,
  "Rssi": 0,
  "Snr": 0,
  "Snrmax": 0,
  "Snrmin": 0,
  "Spreadingfactor": 7,
  "Time": 0
}
```








<a name="channel-lora/status/{deviceID}"></a>


Topic witch contains status of the devices




#### Channel Parameters



##### deviceID


The ID of the streetlight.



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>deviceID </td>
  <td>
    
    string</td>
  <td></td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>





###  `subscribe` lora/status/{deviceID}

#### Message



Informs you about a Status of a Tracker







##### Payload




<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    
      
<tr>
  <td>Bandwidth </td>
  <td>
    
    integer</td>
  <td><p>Bandwidth on witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>BatteryLevel </td>
  <td>
    
    number</td>
  <td><p>Voltage of the battery from the device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Calculatedcrc </td>
  <td>
    
    integer</td>
  <td><p>The calculated CRC</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Codingrate </td>
  <td>
    
    integer</td>
  <td><p>The Codingrate in witch the Signal was recieved</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Crcstatus </td>
  <td>
    
    string</td>
  <td><p>Shows the CRC-Status in a Field</p>
</td>
  <td><code>Ok</code>, <code>Bad</code>, <code>No</code></td>
</tr>






    
      
<tr>
  <td>DeviceStatus </td>
  <td>
    
    string</td>
  <td><p>Shows the internal state in a Field</p>
</td>
  <td><code>Startup</code>, <code>Powersave</code>, <code>Shutdown</code></td>
</tr>






    
      
<tr>
  <td>Frequency </td>
  <td>
    
    integer</td>
  <td><p>The Frequency on that the Message was arrived</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>FrequencyOffset </td>
  <td>
    
    integer</td>
  <td><p>The internal offset to the base frequency, to compensate cheap china rf modules</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Host </td>
  <td>
    
    string</td>
  <td><p>Name of the Gateway that Recieves the Data</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>IpAddress </td>
  <td>
    
    string</td>
  <td><p>IP-Address of the device, for debug</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Name </td>
  <td>
    
    string</td>
  <td><p>Name of the GPS-Tracker, must be unique between every Device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>PacketRssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the whole LORA-Messgae</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Receivedtime </td>
  <td>
    
    string</td>
  <td><p>Timestamp of the Gateway, when it recieves the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverinterface </td>
  <td>
    
    integer</td>
  <td><p>Internal virtual Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Recieverradio </td>
  <td>
    
    integer</td>
  <td><p>Internal Radio of the Gateway, witch recieves the LORA-Messange</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Rssi </td>
  <td>
    
    number</td>
  <td><p>Recieve Signal Strength Index for the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snr </td>
  <td>
    
    number</td>
  <td><p>Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmax </td>
  <td>
    
    number</td>
  <td><p>Maximum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Snrmin </td>
  <td>
    
    number</td>
  <td><p>Minimum Signal to Noise Ratio of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Spreadingfactor </td>
  <td>
    
    integer</td>
  <td><p>The Spreadingfactor of the LORA-Message</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Time </td>
  <td>
    
    integer</td>
  <td><p>Internal Timecounter of the LORA-Reciever</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>Version </td>
  <td>
    
    integer</td>
  <td><p>Software-Versionsnumber of the Device</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>WifiActive </td>
  <td>
    
    boolean</td>
  <td><p>Status if the Device successufly connect to a wifi</p>
</td>
  <td><em>Any</em></td>
</tr>






    
      
<tr>
  <td>WifiSsid </td>
  <td>
    
    string</td>
  <td><p>SSID of the WIFI witch the device connects to.</p>
</td>
  <td><em>Any</em></td>
</tr>






    
  </tbody>
</table>



###### Example of payload _(generated)_

```json
{
  "Bandwidth": 7800,
  "BatteryLevel": 2.5,
  "Calculatedcrc": 0,
  "Codingrate": 5,
  "Crcstatus": "Ok",
  "DeviceStatus": "Startup",
  "Frequency": 0,
  "FrequencyOffset": 0,
  "Host": "string",
  "IpAddress": "0.0.0.0",
  "Name": "string",
  "PacketRssi": 0,
  "Receivedtime": "01/01/2019 12:00:00",
  "Recieverinterface": 0,
  "Recieverradio": 0,
  "Rssi": 0,
  "Snr": 0,
  "Snrmax": 0,
  "Snrmin": 0,
  "Spreadingfactor": 7,
  "Time": 0,
  "Version": 0,
  "WifiActive": true,
  "WifiSsid": "string"
}
```










