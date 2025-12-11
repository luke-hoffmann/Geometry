import { CameraMover } from "../../../interface/CameraMover.js";
import { Vector } from "../../../geometry/Vector.js";
export class p5CameraMover extends CameraMover {
    constructor(acceleration) {
        super(acceleration);
        this.currentTheta = 0;
    }
    rotateCameraAroundPointOnXZPlane(camera, point, radius, deltaTheta) {
        let newCam = camera.copy();
        let newPos = Vector.add(point, new Vector(Math.sin(this.currentTheta) * radius, 0, Math.cos(this.currentTheta) * radius));
        this.currentTheta += deltaTheta;
        newCam.setPosition(newPos);
        newCam.pointAtPoint(point);
        return newCam;
    }
}
