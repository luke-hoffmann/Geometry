import { Vector } from "./Vector.js";

export class Plane {
    private p1 : Vector;
    private p2 : Vector;
    private p3 : Vector;
    constructor(p1 : Vector,p2 : Vector,p3 : Vector){
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}