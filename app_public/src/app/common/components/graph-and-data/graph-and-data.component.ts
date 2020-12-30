import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Message } from "../../classes/models/message";
import { ChartDataSets } from "chart.js";

@Component({
  selector: 'app-graph-and-data',
  templateUrl: './graph-and-data.component.html',
  styleUrls: ['./graph-and-data.component.css']
})
export class GraphAndDataComponent implements OnInit {

  public date: string = "";
  public error: string = "Choose a date to get data!";
  public messages: Message[];
  public allMessages: Message[];
  public currentPage: number;
  public numOfPages: number;
  public perPage: number;

  public messageData: ChartDataSets[] = [
    { data: [], label: 'Number of messages per hour on a picked date' }     // our UNprocessed data goes here
  ];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    console.log(this.date);
    // set current input date
    this.date = (new Date()).toISOString().split('T')[0];
    console.log(this.date);
    // get messages of this current date
    this.currentPage = 0;
    this.numOfPages = 0;
    this.perPage = 10;
    // TODO: mogoce bi lahko dodal, koliko se jih na stran prikaze (perPage)
    this.getAllMessages();  // also gets numberOfPages
    this.getMessages();
  }

  getMessages(): void {
    console.log(this.date);
    this.messages = null;
    // get current page
    this.dataService.getMessages(this.date, this.currentPage, this.perPage)
      .then(response => {
        this.messages = response;
        console.log("Messages at your service!");
      }).catch(error => {
      console.log("Something went wrong when acquiring messages: " + error)
    });
  }

  processMessageData(): void {
    let temp: number[] = [];
    for(let i=0;i<24;i++) {
      temp.push(0);
    }
    let hour: number;
    for(let i=0; i<this.allMessages.length; i++) {
      hour = new Date(this.allMessages[i].date).getHours();
      temp[hour] += 1;
    }
    this.messageData[0].data = temp;
  }

  getAllMessages(): void {
    this.dataService.getMessages(this.date, 0, 0)
      .then(response => {
        this.allMessages = response;
        this.numOfPages = Math.ceil(this.allMessages.length/this.perPage)-1;
        this.processMessageData();
        console.log("Graph data at your service!");
      }).catch(error => {
      console.log("Something went wrong when acquiring messages: " + error)
    });
  }

  getData(): void {
    console.log("GetDATA");
    this.currentPage=0;
    let tempDate: string[] = this.date.split("-");
    if(tempDate.length == 3) {
      this.getAllMessages();
      this.getMessages();
    } else {
      //this.message = "Choose a date to get data!";
      console.log("Izberi datum!");
    }
  }

  nextPage(): void {
    this.currentPage += 1;
    this.getMessages();
    console.log("Next page");
  }

  previousPage(): void {
    this.currentPage -= 1;
    this.getMessages();
    console.log("Previous page");
  }

  private getComponentName(): string {
    return "GraphAndDataComponent";
  }

}
