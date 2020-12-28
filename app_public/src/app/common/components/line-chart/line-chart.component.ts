import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  //@Input() public graphData: number[];

  @Input() public lineChartData: ChartDataSets[]; /* = [
    { data: [1,2], label: 'Number of messages per hour on a picked date' }     // our UNprocessed data goes here
  ];*/

  //public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];   // per hour 0<=x<24
  public lineChartLabels: Label[] = [];   // per hour 0<=x<24
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    { // all messages (could be 2 colors - one for public and one for private messages)
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor() { }

  ngOnInit(): void {
    // TODO: Process data
    for(let i=0;i<24;i++) {
      this.lineChartLabels.push(i.toString());
    }
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
