import { ColorHandler } from "../../dep/Color-Handler/src/ColorHandler.js";
import { UsefulFunction } from "../../dep/Useful-Function/src/UsefulFunction.js";
export class Light {
    constructor (color,position,brightness){
        // brightness should be between 0 and 1;
        // r, g, b should be between 0 and 255;
        this.color=color;
        this.brightness = brightness;
        this.position = position;
    }
    
    static calculateObservedColor(light,color){
        light = UsefulFunction.multiplyArray(light.color.color,light.brightness);
        let normalizedLight = UsefulFunction.divideArray(light,255);
        let normalizedColor = UsefulFunction.divideArray(color.color,255);
        let observedColor = UsefulFunction.elementWiseMultiplication(normalizedColor,normalizedLight);
        observedColor = UsefulFunction.multiplyArray(observedColor,255);
        return new ColorHandler(observedColor[0],observedColor[1],observedColor[2]);
    }
    
    
}



