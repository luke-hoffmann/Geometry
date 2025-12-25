import { Vector } from "../geometry/Vector.js";
import { Camera } from "../camera/Camera.js";
export class CameraMover {
    private acceleration : Vector;
    private currentTheta : number;
    constructor (acceleration: Vector) {
        this.currentTheta = 0;
        this.acceleration = acceleration;
    }
    
    rotateCameraAroundPointOnXZPlane(camera : Camera,point : Vector,radius : number,deltaTheta : number) : Camera{
        let newCam = camera.copy();
        let newPos = Vector.add(point,new Vector(Math.sin(this.currentTheta)*radius,0,Math.cos(this.currentTheta)*radius));
        this.currentTheta+=deltaTheta;
        newCam.position = (newPos);
        newCam.pointAtPoint(point);
        return newCam;
    }
    rotateCameraAroundPointAtYAbove(camera : Camera, point : Vector, radius : number, yAbove: number,deltaTheta : number) : Camera{
        let newCam = camera.copy();
        newCam = this.rotateCameraAroundPointOnXZPlane(camera,Vector.add(point, new Vector(0,yAbove,0)),radius,deltaTheta);
        newCam.pointAtPoint(point);
        return newCam
    }
}