import { CameraMover } from "../../../interface/CameraMover.js";
import { Vector } from "../../../geometry/Vector.js";
export class p5CameraMover extends CameraMover {
    constructor(acceleration) {
        super(acceleration);
        this.down = new Set();

        this._onKeyDown = (e) => {
            if (e.repeat) return;               // optional: ignore auto-repeat
            this.down.add(e.code);             // e.code: "KeyW", "ArrowLeft", etc.
        };

        this._onKeyUp = (e) => {
            this.down.delete(e.code);
        };

        this._onBlur = () => {
            this.down.clear();
        };
        this.currentTheta = 0;
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('blur', this._onBlur);
    }

    // optional cleanup if you ever destroy the mover
    dispose() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('blur', this._onBlur);
    }
    rotateCameraAroundPointOnXZPlane(camera,point,radius,deltaTheta) {
        let newCam = camera.copy();
        let newPos = Vector.add(point,new Vector(Math.sin(this.currentTheta)*radius,0,Math.cos(this.currentTheta)*radius));
        this.currentTheta+=deltaTheta;
        newCam.physicsBody.setPosition(newPos);
        newCam.pointAtPoint(point);
        return newCam;
    }
    moveCamera(camera) {
        let newCam = camera.copy();
        for (let code of this.down) {
            if (code == "KeyW") {
                newCam.setPosition(Vector.add(camera.physicsBody.position, Vector.scalarMult(camera.viewVector,this.speed)));
            }
            if (code == "KeyS") {
                newCam.setPosition(Vector.sub(camera.position, Vector.scalarMult(camera.viewVector,this.speed)));
            }
            if (code == "KeyA") {
                newCam.setPosition(Vector.add(camera.position, Vector.scalarMult(camera.right,this.speed)));
            }
            if (code == "KeyD") {
                newCam.setPosition(Vector.sub(camera.position, Vector.scalarMult(camera.right,this.speed)));
            }
            
        }
        return newCam;
    }
}