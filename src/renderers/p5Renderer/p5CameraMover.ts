import { CameraMover } from "../../interface/CameraMover.js";
import { Vector } from "../../geometry/Vector.js";
import { Camera } from "../../camera/Camera.js";
export class p5CameraMover extends CameraMover {
    private currentTheta : number;
    constructor(acceleration: Vector) {
        super(acceleration);
        this.currentTheta = 0;
        
    }
    rotateCameraAroundPointOnXZPlane(camera : Camera,point : Vector,radius : number,deltaTheta : number) {
        let newCam = camera.copy();
        let newPos = Vector.add(point,new Vector(Math.sin(this.currentTheta)*radius,0,Math.cos(this.currentTheta)*radius));
        this.currentTheta+=deltaTheta;
        newCam.setPosition(newPos);
        newCam.pointAtPoint(point);
        return newCam;
    }
    
}