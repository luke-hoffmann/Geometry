import { CameraMover } from "./CameraMover";
import { Vector } from "../geometry/Vector";
import { Camera } from "../camera/Camera";
export class CameraSpotTracker {
    #trackSpot : Vector;

    #radius : number;
    #hTheta : number;
    #vTheta : number;
    #vChangeInverse : boolean;
    #mouseSensitivity : number = 0.01;
    constructor(trackSpot : Vector, radius: number, horizontalTheta : number, verticalTheta: number) {
        this.#trackSpot = trackSpot;
        this.#radius = radius;
        this.#hTheta = horizontalTheta;
        this.#vTheta = verticalTheta;
        this.#vChangeInverse = false;
    }

    update(camera : Camera) {
        let newCamera = camera.copy();
        const k = Math.abs(this.#radius * Math.cos(this.#vTheta));
        if (Math.cos(this.#vTheta) < 0) {
            this.#vChangeInverse = true;
        } else {
            this.#vChangeInverse = false;
        }
        const horizontalChange = new Vector(Math.cos(this.#hTheta) * k, 0, Math.sin(this.#hTheta) * k);
        const verticalChange = new Vector(0, this.#radius * Math.sin(this.#vTheta), 0)
        //y is up
        const updatedCameraPosition = Vector.add(this.#trackSpot,horizontalChange,verticalChange)
        camera.position = updatedCameraPosition;

        camera.pointAtPoint(this.#trackSpot);
        return newCamera;
    }
    changeRadius(deltaRadius : number) {
        this.#radius += deltaRadius;
    }
    mouseInputRotate(pmouseX : number,pmouseY : number,mouseX : number,mouseY : number) {
        const xChange = (mouseX - pmouseX) * this.#mouseSensitivity;
        const yChange = (mouseY - pmouseY) * this.#mouseSensitivity;
        this.#hTheta += xChange;
        this.#vTheta += (this.#vChangeInverse ? -1 : 1 ) * yChange;
    }
    get radius () {
        return this.#radius;
    }

}