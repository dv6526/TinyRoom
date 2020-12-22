import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { RoomEditor } from "../../classes/room-editor";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {

  constructor(
    public dataService: DataService
  ) { }

  public message: string = "";

  private room: RoomEditor;

  updateFurniture() {
    let furniture = JSON.parse(JSON.stringify(this.room.furniture));
    const width = this.room.canvas.width;

    for (let i = 0; i < furniture.length; i++) {
      const f = furniture[i];
      f.position.x -= this.room.roomMargin;
      f.position.y -= this.room.roomMargin;
      f.position.x /= this.room.room_width;
      f.position.y /= this.room.room_width;
      f.position.x -= 0.5;
      f.position.y -= 0.5;
    }
    if(this.dataService.user) {
      this.dataService.updatePrivateRoom(this.dataService.user.username, furniture).then( response => {
        this.message = "Furniture has been updated!";
      });
    } else {
      console.log("User is not aquired yet!");
    }
  }

  initPrivateRoom() {
    this.room = new RoomEditor('room', this.dataService);

    let furniture: any = document.getElementsByClassName('furniture');
    for (let i = 0; i < furniture.length; i++) {
      const individualFurniture = furniture[i];

      individualFurniture.draggable = true;
      individualFurniture.ondragstart = function(event) {
        event.dataTransfer.setData('furniture', event.target.dataset.furniture);
      }
    }
  }

  ngOnInit(): void {
    this.initPrivateRoom();
  }
}






