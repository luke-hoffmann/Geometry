import { ColorHandler } from "../libs/ColorHandler/src/ColorHandler.js"
import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
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
        let light = UsefulFunction.multiplyArray(this.#color.color,this.#brightness);
        let normalizedLight = UsefulFunction.divideArray(light,255);
        let normalizedColor = UsefulFunction.divideArray(color.color,255);
        let observedColor = UsefulFunction.elementWiseMultiplication(normalizedColor,normalizedLight);
        observedColor = UsefulFunction.multiplyArray(observedColor,255);
        return new ColorHandler(observedColor[0],observedColor[1],observedColor[2]);
    }
    
    
}



