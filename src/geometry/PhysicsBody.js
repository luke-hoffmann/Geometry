import { Vector } from "./Vector.js";
export class PhysicsBody {
    constructor (position,velocity,acceleration,airFriction){
        
        this.position = position; 
        if (!(position instanceof Vector)) this.position = new Vector(0,0,0);  
        this.velocity = velocity;
        if (!(velocity instanceof Vector)) this.velocity = new Vector(0,0,0);
        this.acceleration = acceleration;
        if (!(acceleration instanceof Vector)) this.acceleration = new Vector(0,0,0);   
        this.airFriction = airFriction;
        if (airFriction == undefined) airFriction = .01;
    }
    update(deltaTime){
        this.position = Vector.add(this.position,Vector.scalarMult(this.velocity,deltaTime));
        this.velocity = Vector.add(this.velocity,Vector.scalarMult(this.acceleration,deltaTime));
        this.velocity = Vector.scalarMult(this.velocity,1-this.airFriction);
    }
    setPosition(position) {
        if (!(position instanceof Vector)) throw Error("Position input is not of type Vector");
        this.position = position;
    }
    setVelocity(velocity) {
        if (!(velocity instanceof Vector)) throw Error("Velocity input is not of type Vector");
        this.velocity = velocity;
    }
    setAcceleration(acceleration) {
        if (!(acceleration instanceof Vector)) throw Error("Acceleration input is not of type Vector");
        this.acceleration = acceleration;
    }
    copy(){
        return new this.constructor(this.position.copy(),this.velocity.copy(),this.acceleration.copy(),this.airFriction);
    }
}