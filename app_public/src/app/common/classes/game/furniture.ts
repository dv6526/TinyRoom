export class Furniture {
  type: any;
  position: any;
  constructor(type, position) {
    this.type = type;
    this.position = position;
  }

  setPosition(position) {
    this.position = position;
  }
}
