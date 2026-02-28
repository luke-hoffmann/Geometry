import { ColorHandler } from "colorhandler";
import { Light } from "./Light";
import { Vector } from "../../core/math/Vector";
import { TriangleInput } from "./Light";
export class PointLight extends Light {
    #position : Vector;
    #radius : number;
    constructor(color : ColorHandler, brightness : number, position : Vector, radius : number = 70) {
        super(color,brightness);
        this.#position = position;
        this.#radius = radius;
    }
    copy() : this {
        let clone = new PointLight(this.color,this.brightness,this.#position);
        return clone as this;
    }
    calculateTriangleColor(triangleInput : TriangleInput): ColorHandler {
        const lightingVector = Vector.unitVector(Vector.sub(this.#position,triangleInput.trianglePosition));
        const angleBrightness = Math.max(0,Vector.dotProduct(lightingVector,triangleInput.triangleNormalVector));
        if (angleBrightness <= 0) {
            return new ColorHandler(0,0,0);
        }
        let observedColor = this.calculateObservedColor(triangleInput.triangleColor,triangleInput.distance);
        observedColor = observedColor.multiplyByNumber(angleBrightness);
        return observedColor;
    }
    get radius () {
        return this.#radius;
    }
    set radius(radius: number) {
        this.#radius = radius;
    }
    get position () {
        return this.#position;
    }
    
    set position(position : Vector) {
        this.#position = position;
    }
}