var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Light_color, _Light_position, _Light_brightness;
import { ColorHandler } from "../libs/ColorHandler/src/ColorHandler.js";
import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
export class Light {
    constructor(color, position, brightness) {
        _Light_color.set(this, void 0);
        _Light_position.set(this, void 0);
        _Light_brightness.set(this, void 0);
        // brightness should be between 0 and 1;
        // r, g, b should be between 0 and 255;
        __classPrivateFieldSet(this, _Light_color, color, "f");
        __classPrivateFieldSet(this, _Light_brightness, brightness, "f");
        __classPrivateFieldSet(this, _Light_position, position, "f");
    }
    calculateObservedColor(color) {
        let light = UsefulFunction.multiplyArray(__classPrivateFieldGet(this, _Light_color, "f").color, __classPrivateFieldGet(this, _Light_brightness, "f"));
        let normalizedLight = UsefulFunction.divideArray(light, 255);
        let normalizedColor = UsefulFunction.divideArray(color.color, 255);
        let observedColor = UsefulFunction.elementWiseMultiplication(normalizedColor, normalizedLight);
        observedColor = UsefulFunction.multiplyArray(observedColor, 255);
        return new ColorHandler(observedColor[0], observedColor[1], observedColor[2]);
    }
}
_Light_color = new WeakMap(), _Light_position = new WeakMap(), _Light_brightness = new WeakMap();
//# sourceMappingURL=Light.js.map