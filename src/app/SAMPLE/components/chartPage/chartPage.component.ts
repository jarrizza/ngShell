import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chartPage.component.html',
  styleUrls: ['./chartPage.component.css']
})

export class ChartPageComponent implements OnInit {
  public chartData: Array<any> = [];
  public pieData: Array<any> = [];

  constructor() {}

  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.refreshData();

      // change the data periodically
      setInterval(() => this.refreshData(), 5000);
    }, 1000);
  }

  refreshData() {
    this.chartData = [];
    let total = 0.0;
    let num = +(3 + Math.floor(Math.random() * 3));
    for (let i = 0; i < num; i++) {
      let value = Math.floor(Math.random() * 100);
      this.chartData.push([
        `Index ${i}`,
        value
      ]);
      total += value;
    }

    this.pieData = [];

    let pieTotal = 0;
    for (let j=0; j < num; j++) {
      let value = Number(((this.chartData[j][1] / total) * 100).toFixed(0));
      this.pieData.push(value);
      pieTotal += value;
    }

   // console.log('PIE data: ' + pieTotal);
   // console.log(this.pieData);
  }
}
