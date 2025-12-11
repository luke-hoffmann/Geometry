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
var _PhysicsBody_position, _PhysicsBody_velocity, _PhysicsBody_acceleration, _PhysicsBody_airFriction;
import { Vector } from "./Vector.js";
export class PhysicsBody {
    constructor(position, velocity, acceleration, airFriction) {
        _PhysicsBody_position.set(this, void 0);
        _PhysicsBody_velocity.set(this, void 0);
        _PhysicsBody_acceleration.set(this, void 0);
        _PhysicsBody_airFriction.set(this, void 0);
        __classPrivateFieldSet(this, _PhysicsBody_position, position, "f");
        if (!(position instanceof Vector))
            __classPrivateFieldSet(this, _PhysicsBody_position, new Vector(0, 0, 0), "f");
        __classPrivateFieldSet(this, _PhysicsBody_velocity, velocity, "f");
        if (!(velocity instanceof Vector))
            __classPrivateFieldSet(this, _PhysicsBody_velocity, new Vector(0, 0, 0), "f");
        __classPrivateFieldSet(this, _PhysicsBody_acceleration, acceleration, "f");
        if (!(acceleration instanceof Vector))
            __classPrivateFieldSet(this, _PhysicsBody_acceleration, new Vector(0, 0, 0), "f");
        __classPrivateFieldSet(this, _PhysicsBody_airFriction, airFriction, "f");
        if (airFriction == undefined)
            __classPrivateFieldSet(this, _PhysicsBody_airFriction, .01, "f");
    }
    update(deltaTime) {
        __classPrivateFieldSet(this, _PhysicsBody_position, Vector.add(__classPrivateFieldGet(this, _PhysicsBody_position, "f"), Vector.scalarMult(__classPrivateFieldGet(this, _PhysicsBody_velocity, "f"), deltaTime)), "f");
        __classPrivateFieldSet(this, _PhysicsBody_velocity, Vector.add(__classPrivateFieldGet(this, _PhysicsBody_velocity, "f"), Vector.scalarMult(__classPrivateFieldGet(this, _PhysicsBody_acceleration, "f"), deltaTime)), "f");
        __classPrivateFieldSet(this, _PhysicsBody_velocity, Vector.scalarMult(__classPrivateFieldGet(this, _PhysicsBody_velocity, "f"), 1 - __classPrivateFieldGet(this, _PhysicsBody_airFriction, "f")), "f");
    }
    get position() {
        return __classPrivateFieldGet(this, _PhysicsBody_position, "f").copy();
    }
    get velocity() {
        return __classPrivateFieldGet(this, _PhysicsBody_velocity, "f").copy();
    }
    get acceleration() {
        return __classPrivateFieldGet(this, _PhysicsBody_acceleration, "f").copy();
    }
    set position(position) {
        if (!(position instanceof Vector))
            throw Error("Position input is not of type Vector");
        __classPrivateFieldSet(this, _PhysicsBody_position, position, "f");
    }
    set velocity(velocity) {
        if (!(velocity instanceof Vector))
            throw Error("Velocity input is not of type Vector");
        __classPrivateFieldSet(this, _PhysicsBody_velocity, velocity, "f");
    }
    set acceleration(acceleration) {
        if (!(acceleration instanceof Vector))
            throw Error("Acceleration input is not of type Vector");
        __classPrivateFieldSet(this, _PhysicsBody_acceleration, acceleration, "f");
    }
    copy() {
        return new PhysicsBody(__classPrivateFieldGet(this, _PhysicsBody_position, "f").copy(), __classPrivateFieldGet(this, _PhysicsBody_velocity, "f").copy(), __classPrivateFieldGet(this, _PhysicsBody_acceleration, "f").copy(), __classPrivateFieldGet(this, _PhysicsBody_airFriction, "f"));
    }
}
_PhysicsBody_position = new WeakMap(), _PhysicsBody_velocity = new WeakMap(), _PhysicsBody_acceleration = new WeakMap(), _PhysicsBody_airFriction = new WeakMap();
