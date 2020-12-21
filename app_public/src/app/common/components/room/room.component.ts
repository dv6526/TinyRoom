import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {RoomEditor} from "../../classes/room-editor";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
