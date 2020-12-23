
export class Position {
  x: number;
  y: number;
}

export class Objects {
  type: string;
  position: Position;
}

export class PrivateRoom {
  owner: string;
  objects: Objects[];
}
