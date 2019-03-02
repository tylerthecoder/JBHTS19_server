import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

declare const google: any;

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  private socket;
  private map;

  private appliances = [
    { name: 'Lights' },
    { name: 'Printer' },
    { name: 'Computer Lab' },
    { name: 'Projector' },
    { name: 'Turing' }
  ];

  lat = 51.678418;
  lng = 7.809007;
  zoom = 2;

  constructor() { }

  ngOnInit() {

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.zoom,
      center: {lat: this.lat, lng: this.lng},
      disableDefaultUI: true,
      mapTypeId: 'roadmap',
    });

    this.socket = io('http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/');

    this.socket.emit('setAsMain');

    this.socket.on('lat-lng', (coords) => {
      console.log(coords);
      const latCoord = parseFloat(coords.lat);
      const lngCoord = parseFloat(coords.lng);
      this.map.setCenter({lat: latCoord, lng: lngCoord});
      this.map.setZoom(20);
    });
  }

}
