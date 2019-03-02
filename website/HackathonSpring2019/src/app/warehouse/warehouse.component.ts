import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import * as io from 'socket.io-client';
import { Device } from '../device';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit, OnDestroy {
  @ViewChildren('devices') someDevices;

  private socket;
  private map;
  private firstLoad = true;

  private offStateIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569';
  private onStateIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF33';
  private colorChange = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  private currentAppliance;

  private appliances = [
    'Lights',
    'Printer',
    'Projector',
    'Computer Lab',
    'Turing',
  ];

  private markers = [];

  private allDevices: Device[] = [];

  lat = 51.678418;
  lng = 7.809007;
  zoom = 2;
  url = 'http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.zoom,
      center: { lat: this.lat, lng: this.lng },
      disableDefaultUI: true,
      mapTypeId: 'roadmap',
      scrollwheel: false,
      draggable: true,
    });

    google.maps.event.addListener(this.map, 'click', (event) => {
      this.addAppliance(event.latLng);
   });

    this.socket = io(this.url);

    this.socket.emit('setAsMain');

    this.socket.on('lat-lng', coords => {
      console.log(coords);
      const latCoord = parseFloat(coords.lat);
      const lngCoord = parseFloat(coords.lng);
      this.map.setCenter({ lat: latCoord, lng: lngCoord });
      this.map.setZoom(20);
    });

    this.socket.on('allDevices', (devices) => {
      this.allDevices = [];
      this.allDevices = devices;
      this.addAllCurrentAppliances(this.allDevices);
      console.log(this.allDevices);
    });

    this.socket.on('deviceUpdate', (device) => {
      console.log(device);
      for (const appliance of this.allDevices) {
        if (appliance.deviceId === device.deviceId) {
          appliance.isOn = device.state;
        }
      }
      for (const marker of this.markers) {
        if (+marker.deviceId === device.deviceId) {
          marker.onState = device.state;
          console.log(marker.onState);
          (document.getElementById(`${marker.deviceId}applianceState`) as HTMLInputElement).checked = marker.onState;
        }
      }
    });
  }

  ngOnDestroy() {
    this.markers = [];
    this.allDevices = [];
  }

  public setCurrentAppliance(appliance) {
    this.currentAppliance = appliance;
  }

  public addAppliance(location) {
    for (const device of this.allDevices) {
      console.log(typeof device.deviceId, typeof this.currentAppliance.deviceId);
      console.log(+device.deviceId === +this.currentAppliance.deviceId);
      console.log(device.deviceId, this.currentAppliance.deviceId);
      if (+device.deviceId === +this.currentAppliance.deviceId) {
        device.onMap = true;
      }
    }
    console.log(this.allDevices);
    console.log(location);
    console.log(this.currentAppliance);
    if (!this.firstLoad) {
      if (!this.currentAppliance.lat) {
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: this.currentAppliance.name,
            deviceId: this.currentAppliance.deviceId,
            onState: this.currentAppliance.isOn,
        });

        console.log(marker);

        this.markers.push(marker);

        this.currentAppliance.lat = location.lat();
        this.currentAppliance.lng = location.lng();

        fetch(`${this.url}device/setCoords?deviceId=${this.currentAppliance.deviceId}` +
                                                    `&lat=${this.currentAppliance.lat}` +
                                                    `&lng=${this.currentAppliance.lng}`);

        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div>
                          <h3 style="text-align: center;">${marker.title}</h3>
                          <input type="checkbox" id="${marker.deviceId}applianceState" name="applianceState"
                            onclick="this.changeState(this, ${marker.deviceId})" checked=${marker.onState}>On
                    </div>`
          });
          console.log(marker);
          infoWindow.open(this.map, marker);
          fetch(`${this.url}device/metrics?deviceId=${marker.deviceId}`).
              then(x => x.json()).
              then(metrics => {
                console.log(marker.deviceId);
                console.log({ metrics });
                const timeOn = (metrics.timeOn / 1000.0).toFixed(2);
                const kwHours = (metrics.kwHours).toFixed(2);
                const cost = (metrics.cost).toFixed(2);
                infoWindow.setContent(`
                  <div>
                        <h3 style="text-align: center;">${marker.title}</h3>
                        <div>Time On: ${timeOn} seconds</div>
                        <div>Kilowatt/hrs: ${kwHours} kilowatt hours</div>
                        <div>Cost: ${cost} cents</div>
                        <input type="checkbox" id="${marker.deviceId}applianceState" name="applianceState"
                            onclick="this.changeState(this, ${marker.deviceId})" checked=${marker.onState}>On
                  </div>
                `);
                (document.getElementById(`${marker.deviceId}applianceState`) as HTMLInputElement).checked = marker.onState;
                document.getElementById(`${marker.deviceId}applianceState`).onclick = (event) => {
                  console.log(event, marker.deviceId);
                  const value = (event.srcElement as HTMLInputElement).checked === true ? true : false;
                  fetch(`${this.url}device/setState?deviceId=${marker.deviceId}&state=${value}`);
                };
              });
        });
      }
    } else {

      if (this.currentAppliance.lat) {
        const markerLocation = new google.maps.LatLng(parseFloat(location.lat), parseFloat(location.lng));
        const marker = new google.maps.Marker({
            position: markerLocation,
            map: this.map,
            title: this.currentAppliance.name,
            deviceId: this.currentAppliance.deviceId,
            onState: this.currentAppliance.isOn,
        });

        console.log(marker);

        this.markers.push(marker);

        marker.addListener('click', () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `<div>
                          <h3 style="text-align: center;">${marker.title}</h3>
                          <input type="checkbox" id="${marker.deviceId}applianceState" name="applianceState"
                            onclick="this.changeState(this, ${marker.deviceId})">On
                    </div>`
          });
          infoWindow.open(this.map, marker);
          fetch(`${this.url}device/metrics?deviceId=${marker.deviceId}`).
              then(x => x.json()).
              then(metrics => {
                console.log({ metrics });
                const timeOn = (metrics.timeOn / 1000.0).toFixed(2);
                const kwHours = (metrics.kwHours).toFixed(2);
                const cost = (metrics.cost).toFixed(2);
                infoWindow.setContent(`
                  <div>
                        <h3 style="text-align: center;">${marker.title}</h3>
                        <div>Time On: ${timeOn} seconds</div>
                        <div>Kilowatt/hrs: ${kwHours} kilowatt hours</div>
                        <div>Cost: ${cost} cents</div>
                        <input type="checkbox" id="${marker.deviceId}applianceState" name="applianceState">On
                  </div>
                `);
                (document.getElementById(`${marker.deviceId}applianceState`) as HTMLInputElement).checked = marker.onState;
                document.getElementById(`${marker.deviceId}applianceState`).onclick = (event) => {
                  console.log(event, marker.deviceId);
                  const value = (event.srcElement as HTMLInputElement).checked === true ? true : false;
                  fetch(`${this.url}device/setState?deviceId=${marker.deviceId}&state=${value}`);
                };
              });
        });
      }
    }
  }

  public addAllCurrentAppliances(devices) {
    for (const device of devices) {
      console.log(device);
      if (device.lat && device.lng) {
        this.currentAppliance = device;
        this.addAppliance({lat: this.currentAppliance.lat, lng: this.currentAppliance.lng});
      }
    }
    this.firstLoad = false;
  }

  public changeState(event, marker) {
    console.log(event, marker);
  }
}
