import { ColorHandler } from "colorhandler";
import { Vector } from "../Vector.js";
export type TriangleInput = {
    triangleNormalVector : Vector,
    trianglePosition : Vector,
    triangleColor: ColorHandler,
    distance : number
}   
export type Positionable = {position : Vector};
export abstract class Light {
    #color : ColorHandler;
    #brightness : number;

    constructor (color : ColorHandler, brightness : number){
        if (color == undefined) throw Error("Color is not defined");
        if (brightness == undefined) throw Error("Brightness is not defined");
        if (!Number.isFinite(brightness)) throw Error("Brightness is not finite");
        color = color.clampColor();
        this.#color=color;
        this.#brightness = brightness;
    }
    
    calculateObservedColor(color : ColorHandler, distance : number){
        const brightness = this.#brightness/distance;
        let light = this.#color.multiplyByNumber(brightness);
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
    set brightness(brightness : number){
        if (brightness == undefined) return
        if (!Number.isFinite(brightness)) return;
        brightness = Math.max(0,brightness);
        this.#brightness= this.clampBrightness(brightness);

    }
    protected clampBrightness(value:number) : number {
        return value;
    }
    abstract copy(): this;
    abstract calculateTriangleColor(triangleInput : TriangleInput): ColorHandler;
    static hasPosition(light: Light): light is Light & Positionable {
        return "position" in light;
    }
}



