import { ColorHandler } from "colorhandler";
import { Light } from "./Light";
import { TriangleInput } from "./Light";
export class GlobalLight extends Light {
    constructor (color : ColorHandler, brightness : number) {
        super(color,brightness);
    }
    calculateTriangleColor(triangleInput: TriangleInput): ColorHandler {
        let observedColor = this.calculateObservedColor(triangleInput.triangleColor,1);
        return observedColor;
    }

    copy() : this {
        let clone = new GlobalLight(this.color.copy(),this.brightness);
        return clone as this;
    }
}