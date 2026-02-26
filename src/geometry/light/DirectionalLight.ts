import { ColorHandler } from "colorhandler";
import { Light } from "./Light";
import { Vector } from "../Vector";
import { TriangleInput } from "./Light";
export class DirectionalLight extends Light {
    #direction : Vector;
    constructor(color : ColorHandler, brightness : number, directionOfLight : Vector) {
        super(color,brightness);
        this.#direction = directionOfLight;
    }
    copy() : this {
        let clone = new DirectionalLight(this.color,this.brightness,this.#direction);
        return clone as this;
    }
    calculateTriangleColor(triangleInput : TriangleInput): ColorHandler {

        const angleBrightness = Vector.dotProduct(this.#direction,triangleInput.triangleNormalVector);
        let observedColor = this.calculateObservedColor(triangleInput.triangleColor);
        observedColor = observedColor.multiplyByNumber(angleBrightness);
        return observedColor;
    }
}