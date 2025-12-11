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
var _NormalVector_position, _NormalVector_direction;
import { Vector } from "./Vector.js";
export class NormalVector {
    constructor(position, direction) {
        _NormalVector_position.set(this, void 0);
        _NormalVector_direction.set(this, void 0);
        __classPrivateFieldSet(this, _NormalVector_position, position, "f");
        __classPrivateFieldSet(this, _NormalVector_direction, direction, "f");
    }
    worldPositionOfDirection() {
        return Vector.add(__classPrivateFieldGet(this, _NormalVector_position, "f"), __classPrivateFieldGet(this, _NormalVector_direction, "f"));
    }
    copy() {
        return new NormalVector(__classPrivateFieldGet(this, _NormalVector_position, "f").copy(), __classPrivateFieldGet(this, _NormalVector_direction, "f").copy());
    }
}
_NormalVector_position = new WeakMap(), _NormalVector_direction = new WeakMap();
//# sourceMappingURL=NormalVector.js.map