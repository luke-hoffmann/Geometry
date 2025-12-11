import { Vector } from "./Vector.js";
export class Line {
    #p1 : Vector;
    #p2 : Vector;
    constructor(p1 : Vector ,p2: Vector){
        this.#p1 = p1;
        this.#p2 = p2;
    }
    get p1 () : Vector{
        return this.#p1;
    }
    get p2(): Vector{
        return this.#p2;
    }
    isEqual(line : this){
        if (this===line) return true;
        if (this.#p1 === line.p1 && this.#p2 === line.p2) return true;
        if (this.#p1 === line.p2 && this.#p2 == line.p1) return true;
        return false;
    }
    
    distanceToPoint(v : Vector) : number{
       const BA = Vector.sub(v,this.#p1);
       const BC = Vector.sub(this.#p2,this.#p1);
       return Vector.magnitude(Vector.crossProduct(BA,BC)) / Vector.magnitude(BC)
    }
    
}
