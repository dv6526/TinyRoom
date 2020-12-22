import {DataService} from "../services/data.service";
import { Vector } from './vector';
import { Furniture } from './furniture';
import * as $ from 'jquery';
import {Observable} from "rxjs";
import { Room, Objects } from "../classes/room";

function returnImageObject(image_link, onload) {
  var img = document.createElement('img');
  img.src = image_link;
  img.onload = onload;
  return img;
}


export class RoomEditor {
  canvas: any;
  context: any;
  assets: any;
  dragging: any;
  dragged_furniture: any;
  furniture: any;
  room_width: any;
  roomMargin: any;
  constructor(canvas_id, private dataService:DataService) {
    this.canvas = document.getElementById(canvas_id);
    this.context = this.canvas.getContext('2d');
    this.assets = undefined;

    this.dragging = false;
    this.dragged_furniture = undefined;

    this.furniture = [];

    var room = this;
    room.room_width = Math.min(500, room.canvas.width-50);

    this.loadAssets(function() {
      room.animation();
      room.fillRoom();
      room.enableDragLogic();
      room.hookControls();
    });

    room.resize();
    $(window).resize(function() {
      room.resize();
    });
  }

  fillRoom() {
    var furniture = this.furniture;
    var room = this;
    if(this.dataService.user) {
      //let result: Room;
      this.dataService.getFurnitureLocation(this.dataService.user.username).then(result => {
        console.log(result);
        for(var i = 0; i < result.objects.length; i++) {
          var room_object = result.objects[i];
          var position = room_object.position;
          position.x += 0.5;
          position.y += 0.5;

          position.x *= room.room_width;
          position.y *= room.room_width;
          position.x += room.roomMargin;
          position.y += room.roomMargin;
          furniture.push(new Furniture(room_object.type,new Vector(position.x, position.y)));
        }
      });
    } else {
      //this.fillRoom();
    }
  }

  enableDragLogic() {
    this.canvas.ondragover = function(ev) {ev.preventDefault();}
    var room = this;
    this.canvas.ondrop = function(ev) {
      ev.preventDefault();
      room.addFurniture(ev.dataTransfer.getData('furniture'));
    }
  }

  resize() {
    var width = $(this.canvas).parent().width();
    if (this.canvas) {
      //console.log(width);
      this.canvas.style.width = '95%';
      this.canvas.style.height = '95%';
      this.canvas.width = 0.95 * width;
      this.canvas.height = this.canvas.width;
    }
  }

  loadAssets(callback) {
    this.assets = {
      "room": returnImageObject('/assets/editor/room.png', null),
      "fotelj": {img:returnImageObject('/assets/editor/fotelj.png', null), scale: 1.4},
      "stol": {img:returnImageObject('/assets/editor/stol.png', null), scale: 1.4},
      "stolcek": {img:returnImageObject('/assets/editor/stolcek.png', null), scale: 1.4},
      "light": {img:returnImageObject('/assets/editor/light.png', null), scale: 1.4}
    }

    callback();
  }


  addFurniture(type) {
    var furniture = new Furniture(type, new Vector(this.canvas.width/2, this.canvas.height/2));
    this.furniture.push(furniture);
  }

  getCanvasMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return new Vector(
      evt.clientX - rect.left,
      evt.clientY - rect.top
    );
  }

  getNearestToMouse(mouse_position) {
    var room = this;
    var min_distance = room.furniture[0].position.clone().subtract(mouse_position).length();
    var min_furniture = room.furniture[0]
    for (let i = 1; i < room.furniture.length; i++) {
      const furniture = room.furniture[i];
      var distance = furniture.position.clone().subtract(mouse_position).length();
      if (distance < min_distance) {
        min_furniture = furniture;
        min_distance = distance;
      }
    }

    return min_furniture;
  }

  hookControls() {
    var room = this;
    this.canvas.addEventListener('mousedown', function(event) {
      room.dragging = true;
      console.log('started dragging');
      if (room.furniture.length > 0) {
        var mouse_position = room.getCanvasMousePos(event);
        room.dragged_furniture = room.getNearestToMouse(mouse_position);
        //console.log(room.dragged_furniture);
      }
    });

    this.canvas.addEventListener('mouseup', function() {
      room.dragging = false;
      console.log('stopped dragging');
    });

    this.canvas.addEventListener('mousemove', function(event) {
      var mouse_position = room.getCanvasMousePos(event);
      if (room.dragging && room.dragged_furniture) {
        room.dragged_furniture.position = mouse_position;
      }
    });

    this.canvas.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      var mouse_position = room.getCanvasMousePos(event);
      if (room.furniture.length > 0) {
        var mouse_position = room.getCanvasMousePos(event);
        var to_delete = room.getNearestToMouse(mouse_position);
        room.furniture = room.furniture.filter(f => f !== to_delete);
        //console.log(room.dragged_furniture);
      }
    });
  }

  animation() {
    var room = this;
    var context = this.context;

    setInterval(function() {
      room.room_width = Math.min(500, room.canvas.width-50);
      const room_width = room.room_width;
      const scale = room_width/500;

      context.fillStyle = "#FFFFFF";
      context.imageSmoothingEnabled = false;
      context.fillRect(0, 0, room.canvas.width, room.canvas.height);

      room.roomMargin = (room.canvas.width-room_width)*0.5;
      const roomMargin = room.roomMargin;

      const roomSize = room_width;
      context.drawImage(room.assets.room, roomMargin, roomMargin, roomSize, roomSize);

      for (let i = 0; i < room.furniture.length; i++) {
        const furnitureObject = room.furniture[i];
        const furniture = room.assets[furnitureObject.type];
        context.drawImage(furniture.img, furnitureObject.position.x, furnitureObject.position.y, furniture.img.width*furniture.scale*scale, furniture.img.height*furniture.scale*scale);
      }
    }, 16.666);
  }
}

