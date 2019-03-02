import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  private url = 'http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/';

  @ViewChild('total-timeOn') timeOn;
  @ViewChild('total-kwHours') kwHours;
  @ViewChild('total-costs') costs;

  ngOnInit() {
    setInterval(() => {
      fetch(`${this.url}device/allMetrics`)
        .then(x => x.json())
        .then(metrics => {
          const timeOn = (metrics.timeOn / 1000.0).toFixed(2);
          const kwHours = metrics.kwHours.toFixed(2);
          const cost = metrics.cost.toFixed(2);

          (document.getElementById(
            'total-timeOn'
          ) as HTMLDivElement).innerHTML = timeOn;
          (document.getElementById(
            'total-kwHours'
          ) as HTMLDivElement).innerHTML = kwHours;
          (document.getElementById(
            'total-costs'
          ) as HTMLDivElement).innerHTML = cost;
        });
    }, 5000);
  }
}
