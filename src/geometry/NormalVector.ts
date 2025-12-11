import { Vector } from "./Vector.js";
export class NormalVector {
    #position : Vector;
    #direction : Vector;
    constructor(position : Vector,direction : Vector){
        this.#position = position;
        this.#direction = direction;
    }

    worldPositionOfDirection(){
        return Vector.add(this.#position,this.#direction);
    }
    copy(){
        return new NormalVector(this.#position.copy(),this.#direction.copy());
    }
    get position(){
        return this.#position;
    }
    get direction() {
        return this.#direction;
    }
}