import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph-and-data',
  templateUrl: './graph-and-data.component.html',
  styleUrls: ['./graph-and-data.component.css']
})
export class GraphAndDataComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  private getComponentName(): string {
    return "GraphAndDataComponent";
  }

}
