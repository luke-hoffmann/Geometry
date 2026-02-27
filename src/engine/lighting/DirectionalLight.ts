import { ColorHandler } from "colorhandler";
import { Light } from "./Light";
import { Vector } from "../../core/math/Vector";
import { TriangleInput } from "./Light";
export class DirectionalLight extends Light {
    #direction : Vector;
    constructor(color : ColorHandler, brightness : number, directionOfLight : Vector) {
        super(color,brightness);
        this.#direction = directionOfLight;
        this.direction = directionOfLight;
    }
    protected clampBrightness( brightness : number) : number{
        if (brightness == undefined || !Number.isFinite(brightness)) return 1;
        brightness = Math.max(0,brightness);
        brightness = Math.min(brightness,1);
        return brightness;
    }
    set direction(direction : Vector) {
        this.#direction = Vector.unitVector(direction);
    }
    get direction(){
        return this.#direction.copy();
    }
    copy() : this {
        let clone = new DirectionalLight(this.color.copy(),this.brightness,this.#direction.copy());
        return clone as this;
    }
    calculateTriangleColor(triangleInput : TriangleInput): ColorHandler {
        const angleBrightness = Vector.dotProduct(this.#direction,triangleInput.triangleNormalVector);
        if (angleBrightness <= 0) {
            return new ColorHandler(0,0,0);
        }
        let observedColor = this.calculateObservedColor(triangleInput.triangleColor,1);
        observedColor = observedColor.multiplyByNumber(angleBrightness);
        return observedColor;
    }
}