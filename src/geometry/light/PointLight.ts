import { ColorHandler } from "colorhandler";
import { Light } from "./Light";
import { Vector } from "../Vector";
import { TriangleInput } from "./Light";
export class PointLight extends Light {
    #position : Vector;
    constructor(color : ColorHandler, brightness : number, position : Vector) {
        super(color,brightness);
        this.#position = position;
    }
    copy() : this {
        let clone = new PointLight(this.color,this.brightness,this.#position);
        return clone as this;
    }
    calculateTriangleColor(triangleInput : TriangleInput): ColorHandler {
        const lightingVector = Vector.unitVector(Vector.sub(this.#position,triangleInput.trianglePosition));
        const angleBrightness = Math.max(0,Vector.dotProduct(lightingVector,triangleInput.triangleNormalVector));
        let observedColor = this.calculateObservedColor(triangleInput.triangleColor);
        observedColor = observedColor.multiplyByNumber(angleBrightness);
        return observedColor;
    }
    get position () {
        return this.#position;
    }
    set position(position : Vector) {
        this.#position = position;
    }
}