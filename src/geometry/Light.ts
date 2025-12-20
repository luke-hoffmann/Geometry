
import { ColorHandler } from "colorhandler";
import { Vector } from "./Vector.js";
export class Light {
    #color : ColorHandler;
    #position : Vector;
    #brightness : number;

    constructor (color : ColorHandler,position : Vector,brightness : number){
        // brightness should be between 0 and 1;
        // r, g, b should be between 0 and 255;
        this.#color=color;
        this.#brightness = brightness;
        this.#position = position;
    }
    
    calculateObservedColor(color : ColorHandler){
        let light = this.#color.multiplyByNumber(this.#brightness);
        let normalizedLight = light.multiplyByNumber(1/255);
        let normalizedColor = color.multiplyByNumber(1/255);
        let observedColor = normalizedColor.elementWiseMultiplication(normalizedLight);
        observedColor = observedColor.multiplyByNumber(255);
        return observedColor;
    }
    
    copy() {
        return new Light(this.#color.copy(),this.#position.copy(),this.#brightness);
    }
}



