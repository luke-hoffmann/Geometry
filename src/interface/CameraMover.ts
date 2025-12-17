import { Vector } from "../geometry/Vector.js";
export class CameraMover {
    private acceleration : Vector;
    constructor(acceleration: Vector) {
        this.acceleration = acceleration;
    }
    
}