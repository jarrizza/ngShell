import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import * as d3 from 'd3';
import * as c3 from 'c3';

@Component({
  selector: 'c3-pie-chart',
  templateUrl: './c3piechart.component.html',
  styleUrls: ['./c3piechart.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class C3PieChartComponent implements OnInit, OnChanges {
  @ViewChild("piechart") private chartContainer: ElementRef;
  @Input() private data: Array<any>;

  public chart: any;

  constructor() {
  }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    this.updateChart();
  }

  private createChart() {
    console.log('=====> pie CREATED');
    console.log(this.data);
    this.chart = c3.generate({
      bindto: '#piechart',
      data: {
        // iris data from R
        columns: [
          ['owner1', 100]
        ],
       type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },

      color: {
        pattern: [
          "#ff3300", "#9933cc", "#00acff", "#ff9900", "#00cc00", "#995500", "#003399", "#cc0000", "#009999", "#6600cc", "#ff6600", "#006600", "#333333", "#888888", "#aaaaaa"
        ]
      },
      // hide legend under pie
      legend: {
        show: false
      },

      tooltip: {
        format: {
          //title: function (d) { return 'Owner ' + d; },
          value: function (value, ratio, id) {
            var format = id === 'owner1' ? d3.format(',') : d3.format('$');
            return format(value);
          }
        }
      },

      pie: {

        // hide labels on pie
        label: {
          show: false
        }

/*
         // show labels on pie
        label: {
          format: function (value, ratio, id) {
            //return id;
            return (ratio * 100).toFixed(0)+'%';
            //return d3.format('$')(value*100);
            // return d3.format(',')(value);
          }
        }
*/

      }

    });
    console.log(this.chart);
  }

  private updateChart(): void {
    console.log('---> pie updated');
    console.log(this.data);
    if (this.chart) {
      let updateData = [];
      for (let i=0 ; i < this.data.length; i++) {
        updateData.push(['owner'+(i+1).toString(), this.data[i]])
      }
      this.chart.load({
        columns: updateData
      });
    }

  }

}
