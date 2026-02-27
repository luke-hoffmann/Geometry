import { Vector } from "../core/math/Vector";
import { Camera } from "../engine/scene/Camera";
import { KeyboardInput } from ".//KeyboardInput";
export class CameraMover {
    #acceleration : Vector;
    #velocity : Vector;
    #position : Vector;
    #vTheta : number;
    #hTheta : number;
    #vChangeInverse : boolean;
    #mouseSensitivity: number;
    #viewVector : Vector;
    #upVector : Vector;
    #rightVector : Vector;
    constructor (position: Vector, velocity : Vector, acceleration: Vector) {
        this.#hTheta = 0;
        this.#vTheta = 0;
        this.#vChangeInverse = false;
        this.#position = position;
        this.#velocity = velocity;
        this.#acceleration = acceleration;
        this.#mouseSensitivity = 0.01;
        this.#viewVector = new Vector(1,0,0);
        this.#upVector = new Vector(0,1,0);
        this.#rightVector = Vector.unitVector(Vector.crossProduct(this.#viewVector,this.#upVector));

        this.viewVector = this.#viewVector;
    }
    set vTheta(theta : number) {
        if (!Number.isFinite(theta)) throw Error("vTheta is not finite")
        if (Math.cos(this.#vTheta) < 0) {
            this.#vChangeInverse = true;
        } else {
            this.#vChangeInverse = false;
        }
        this.#vTheta =theta;
        this.updateViewDirectionFromAngles();
    }
    set hTheta(theta : number) {
        if (!Number.isFinite(theta)) throw Error("hTheta is not finite")
        this.#hTheta =theta;
        this.updateViewDirectionFromAngles();
    }
    get vTheta() : number{
        return this.#vTheta;
    }
    get hTheta() : number{
        return this.#hTheta;
    }
    set viewVector (v : Vector) {
        this.#viewVector = Vector.unitVector(v);
        this.#upVector = Vector.upVector();
        if (this.#viewVector.equals(Vector.upVector()) || this.#viewVector.equals(Vector.downVector())) this.#upVector = new Vector(1,0,0);
        
        this.#rightVector = Vector.unitVector(Vector.crossProduct(this.#viewVector,this.#upVector));
        this.#upVector = Vector.unitVector(Vector.crossProduct(this.#viewVector, this.#rightVector));
        this.updateAnglesFromViewDirection();

    }
    private updateViewDirectionFromAngles() {
        const k = Math.abs(Math.cos(this.#vTheta));

        const horizontalChange = new Vector(Math.cos(this.#hTheta) * k, 0, Math.sin(this.#hTheta) * k);
        const verticalChange = new Vector(0, Math.sin(this.#vTheta), 0)

        this.viewVector = Vector.unitVector(Vector.add(horizontalChange,verticalChange));
        
    }
    private updateAnglesFromViewDirection() {
        // credit chatgpt
        const v = Vector.unitVector(this.#viewVector);

        this.#vTheta = Math.asin(v.y);
        this.#hTheta = Math.atan2(v.z, v.x);
    }
    private updateKinematics(){
        this.#position = Vector.add(this.#position,this.#velocity);
        this.#velocity = Vector.add(this.#velocity,this.#acceleration);
        this.#velocity = Vector.scalarMult(this.#velocity, .98)
        this.#acceleration = Vector.zero();
    }
    update(camera : Camera) {
        let newCamera = camera.copy();
        
        newCamera.position = this.#position;
        newCamera.pointInDirection(this.#viewVector);

        this.updateKinematics();

        return newCamera;
    }
    keyboardInputs(keyboardInput : KeyboardInput) {
        let acceleration = keyboardInput.movementInCertainCoordinateSystem(this.#viewVector,this.#upVector,this.#rightVector);
        this.#acceleration = Vector.add(this.#acceleration,acceleration);
    }  
    mouseInputRotate(xChange : number, yChange: number) {
        if (!Number.isFinite(yChange)) yChange = 0;
        if (!Number.isFinite(xChange)) xChange = 0;

        xChange = (xChange) * this.#mouseSensitivity;
        yChange = (yChange) * this.#mouseSensitivity;

        this.hTheta = this.#hTheta + xChange;
        this.vTheta = this.#vTheta + (this.#vChangeInverse ? 1 : -1 ) * yChange;
    }
    
}