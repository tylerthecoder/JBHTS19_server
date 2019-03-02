import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { Device } from '../device';

declare const google: any;

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit, OnDestroy {
  @ViewChildren('devices') someDevices;

  public infoWindow = new google.maps.InfoWindow();
  private socket;
  private map;

  private currentAppliance;

  private markers = [];

  private allDevices: Device[] = [];

  private selectedMarker;

  lat = 38.383008;
  lng = -98.022284;
  zoom = 4;
  url = 'http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/';

  constructor() {}

  ngOnInit() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.zoom,
      center: { lat: this.lat, lng: this.lng },
      disableDefaultUI: true,
      mapTypeId: 'roadmap',
      scrollwheel: false,
      draggable: true
    });

    google.maps.event.addListener(this.map, 'click', event => {
      this.addAppliance(event.latLng, true);
    });

    this.socket = io(this.url);

    this.socket.emit('setAsMain');

    this.socket.on('lat-lng', coords => {
      const latCoord = parseFloat(coords.lat);
      const lngCoord = parseFloat(coords.lng);
      this.map.setCenter({ lat: latCoord, lng: lngCoord });
      this.map.setZoom(20);
    });

    this.socket.on('allDevices', devices => {
      console.log('All Devices: ', devices);
      this.allDevices = [];
      this.allDevices = devices;
      this.addAllCurrentAppliances(this.allDevices);
    });

    this.socket.on('deviceUpdate', device => {
      console.log(device);
      for (const appliance of this.allDevices) {
        if (appliance.deviceId === device.deviceId) {
          appliance.isOn = device.state;
        }
      }
      for (const marker of this.markers) {
        if (+marker.deviceId === device.deviceId) {
          console.log(marker);
          marker.onState = device.state;
          (document.getElementById(
            `${marker.deviceId}applianceState`
          ) as HTMLInputElement).checked = marker.onState;
          if (marker.onState) {
            marker.setIcon(
              'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            );
          } else {
            marker.setIcon(
              'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            );
          }
        }
      }
    });

    google.maps.event.addListener(this.infoWindow, 'domready', () => {
      const marker = this.selectedMarker;
      const markerId = `${marker.deviceId}applianceState`;

      const markerElement = document.getElementById(
        markerId
      ) as HTMLInputElement;
      markerElement.checked = marker.onState;
      markerElement.onclick = event => {
        const value = (event.srcElement as HTMLInputElement).checked;
        fetch(
          `${this.url}device/setState?deviceId=${
            marker.deviceId
          }&state=${value}`
        );
        if (value) {
          marker.setIcon(
            'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
          );
        } else {
          marker.setIcon(
            'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          );
        }
      };
    });
  }

  ngOnDestroy() {
    this.markers = [];
    this.allDevices = [];
  }

  public setCurrentAppliance(appliance) {
    this.currentAppliance = appliance;
  }

  public addAppliance(location, wasClick: boolean) {
    for (const device of this.allDevices) {
      if (+device.deviceId === +this.currentAppliance.deviceId) {
        device.onMap = true;
      }
    }

    let marker;

    if (!this.currentAppliance.lat) {
      marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: this.currentAppliance.name,
        deviceId: this.currentAppliance.deviceId,
        onState: this.currentAppliance.isOn
      });

      this.markers.push(marker);

      this.currentAppliance.lat = location.lat();
      this.currentAppliance.lng = location.lng();
    } else {
      const markerLocation = new google.maps.LatLng(
        parseFloat(location.lat),
        parseFloat(location.lng)
      );

      marker = new google.maps.Marker({
        position: markerLocation,
        map: this.map,
        title: this.currentAppliance.name,
        deviceId: this.currentAppliance.deviceId,
        onState: this.currentAppliance.isOn
      });

      this.markers.push(marker);
    }

    if (marker.onState) {
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
    } else {
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    }

    if (wasClick) {
      fetch(
        `${this.url}device/setCoords?deviceId=${
          this.currentAppliance.deviceId
        }&lat=${this.currentAppliance.lat}&lng=${this.currentAppliance.lng}`
      );
    }

    marker.addListener('click', () => {
      this.selectedMarker = marker;
      const markerId = `${marker.deviceId}applianceState`;
      this.infoWindow.setContent(`
        <div>
            <h3 style="text-align: center;">${marker.title}</h3>
            <p> Loading metrics... </p>
            <input type="checkbox"
              id="${markerId}"
              name="applianceState"
              ${marker.onState ? 'checked' : ''}
            >On
        </div>`);

      this.infoWindow.open(this.map, marker);

      console.log('Getting Metrics');
      fetch(`${this.url}device/metrics?deviceId=${marker.deviceId}`)
        .then(x => x.json())
        .then(metrics => {
          console.log(metrics);
          const timeOn = (metrics.timeOn / 1000.0).toFixed(2);
          const kwHours = metrics.kwHours.toFixed(2);
          const cost = metrics.cost.toFixed(2);
          this.infoWindow.setContent(`
            <div>
              <h3 style="text-align: center;">${marker.title}</h3>
              <div>Time On: ${timeOn} seconds</div>
              <div>Kilowatt/hrs: ${kwHours} kilowatt hours</div>
              <div>Cost: ${cost} cents</div>
              <input
                type="checkbox"
                id="${markerId}"
                name="applianceState"
                ${marker.onState ? 'checked' : ''}
              >
              On
            </div>
          `);
        });
    });
  }

  public addAllCurrentAppliances(devices) {
    for (const device of devices) {
      if (device.lat && device.lng) {
        this.currentAppliance = device;
        this.addAppliance(
          { lat: this.currentAppliance.lat, lng: this.currentAppliance.lng },
          false
        );
      }
    }
  }
}
