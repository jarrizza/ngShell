import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  constructor() {}
/*
  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.refreshData();

      // change the data periodically
      setInterval(() => this.refreshData(), 3000);
    }, 1000);
  }

  refreshData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
        `Index ${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }
  }
  */
}
