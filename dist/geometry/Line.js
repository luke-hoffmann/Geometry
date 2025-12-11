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
var _Line_p1, _Line_p2;
import { Vector } from "./Vector.js";
export class Line {
    constructor(p1, p2) {
        _Line_p1.set(this, void 0);
        _Line_p2.set(this, void 0);
        __classPrivateFieldSet(this, _Line_p1, p1, "f");
        __classPrivateFieldSet(this, _Line_p2, p2, "f");
    }
    get p1() {
        return __classPrivateFieldGet(this, _Line_p1, "f");
    }
    get p2() {
        return __classPrivateFieldGet(this, _Line_p2, "f");
    }
    isEqual(line) {
        if (this === line)
            return true;
        if (__classPrivateFieldGet(this, _Line_p1, "f") === line.p1 && __classPrivateFieldGet(this, _Line_p2, "f") === line.p2)
            return true;
        if (__classPrivateFieldGet(this, _Line_p1, "f") === line.p2 && __classPrivateFieldGet(this, _Line_p2, "f") == line.p1)
            return true;
        return false;
    }
    distanceToPoint(v) {
        const BA = Vector.sub(v, __classPrivateFieldGet(this, _Line_p1, "f"));
        const BC = Vector.sub(__classPrivateFieldGet(this, _Line_p2, "f"), __classPrivateFieldGet(this, _Line_p1, "f"));
        return Vector.magnitude(Vector.crossProduct(BA, BC)) / Vector.magnitude(BC);
    }
}
_Line_p1 = new WeakMap(), _Line_p2 = new WeakMap();
