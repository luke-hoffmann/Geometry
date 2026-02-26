import { ColorHandler } from "colorhandler";
import { Vector } from "../Vector.js";
export type TriangleInput = {
    triangleNormalVector : Vector,
    trianglePosition : Vector,
    triangleColor: ColorHandler
}   
export type Positionable = {position : Vector};
export abstract class Light {
    #color : ColorHandler;
    #brightness : number;

    constructor (color : ColorHandler, brightness : number){
        if (color == undefined) throw Error("Color is not defined");
        if (brightness == undefined) throw Error("Brightness is not defined");
        if (0> brightness || brightness > 1) throw Error("Brightness is not between 0 and 1");
        color = color.clampColor();
        this.#color=color;
        this.#brightness = brightness;
    }
    
    calculateObservedColor(color : ColorHandler){
        let light = this.#color.multiplyByNumber(this.#brightness);
        let normalizedLight = light.multiplyByNumber(1/255);
        let normalizedColor = color.multiplyByNumber(1/255);
        let observedColor = normalizedColor.elementWiseMultiplication(normalizedLight);
        observedColor = observedColor.multiplyByNumber(255);
        return observedColor;
    }
    get color() : ColorHandler {
        return this.#color.copy();
    }
    get brightness() : number {
        return this.#brightness;
    }
    abstract copy(): this;
    abstract calculateTriangleColor(triangleInput : TriangleInput): ColorHandler;
    static hasPosition(light: Light): light is Light & Positionable {
        return "position" in light;
    }
}



