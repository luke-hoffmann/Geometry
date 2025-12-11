import { Vector } from "./Vector.js";
export class NormalVector {
    constructor(position,direction){
        this.position = position;
        this.direction = direction;
    }

    worldPositionOfDirection(){
        return Vector.add(this.position,this.direction);
    }
    copy(){
        return new NormalVector(this.position.copy(),this.direction.copy());
    }
}