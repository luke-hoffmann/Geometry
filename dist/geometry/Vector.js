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
var _Vector_x, _Vector_y, _Vector_z;
export class Vector {
    constructor(x, y, z) {
        _Vector_x.set(this, void 0);
        _Vector_y.set(this, void 0);
        _Vector_z.set(this, void 0);
        __classPrivateFieldSet(this, _Vector_x, x, "f");
        __classPrivateFieldSet(this, _Vector_y, y, "f");
        __classPrivateFieldSet(this, _Vector_z, z, "f");
    }
    get x() {
        return __classPrivateFieldGet(this, _Vector_x, "f");
    }
    get y() {
        return __classPrivateFieldGet(this, _Vector_y, "f");
    }
    get z() {
        return __classPrivateFieldGet(this, _Vector_z, "f");
    }
    static zero() {
        return new this(0, 0, 0);
    }
    static isVectorEqual(v1, v2) {
        if (!(v1 instanceof Vector)) {
            throw Error("v1 must be a vector");
        }
        if (!(v2 instanceof Vector)) {
            throw Error("v2 must be a vector");
        }
        return v1.x === v2.x && v1.y === v2.y && v2.z === v2.z;
    }
    static unitVector(v) {
        if (!(v instanceof Vector)) {
            throw Error("v must be a vector");
        }
        let mag = v.magnitude();
        return new this(v.x / mag, v.y / mag, v.z / mag);
    }
    static upVector() {
        return new this(0, 0, 1);
    }
    static generateVectorInSphere(mag) {
        mag = Math.random() * mag * mag * mag;
        mag = Math.cbrt(mag);
        let d = 2;
        let x = 0, y = 0, z = 0;
        while (d > 1.0) {
            x = (Math.random() * 2) - 1;
            y = (Math.random() * 2) - 1;
            z = (Math.random() * 2) - 1;
            d = (x * x) + (y * y) + (z * z);
        }
        return new Vector(x * mag, y * mag, z * mag);
    }
    static magnitude(v) {
        if (!(v instanceof Vector)) {
            throw Error("p1 must be a vector");
        }
        return v.magnitude();
    }
    magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
    static distanceBetweenVectors(v1, v2) {
        if (!(v1 instanceof Vector)) {
            throw Error("v1 must be a vector");
        }
        if (!(v2 instanceof Vector)) {
            throw Error("v2 must be a vector");
        }
        return Math.hypot((v1.x - v2.x), (v1.y - v2.y), (v1.z - v2.z));
    }
    static lerp(p1, p2, t) {
        if (!Number.isFinite(p1)) {
            throw Error("p1 is not a finite number");
        }
        if (!Number.isFinite(p2)) {
            throw Error("p2 is not a finite number");
        }
        if (!Number.isFinite(t)) {
            throw Error("t is not a finite number");
        }
        return ((p2 - p1) * t) + p1;
    }
    static lerpVector(v1, v2, t) {
        return new this(this.lerp(v1.x, v2.x, t), this.lerp(v1.y, v2.y, t), this.lerp(v1.z, v2.z, t));
    }
    static normalize(v) {
        throw Error("depreciated : use Vector.unitVector(v) instead");
        let mag = Math.sqrt((v.x ** 2) + (v.y ** 2) + (v.z ** 2));
        return new this(v.x / mag, v.y / mag, v.z / mag);
    }
    static crossProduct(v1, v2) {
        return new this((v1.y * v2.z) - (v1.z * v2.y), (v1.z * v2.x) - (v1.x * v2.z), (v1.x * v2.y) - (v1.y * v2.x));
    }
    static dotProduct(v1, v2) {
        return ((v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z));
    }
    static sub(v1, v2) {
        return new this(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static add(v1, v2) {
        return new this(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static scalarMult(v, c) {
        return new this(v.x * c, v.y * c, v.z * c);
    }
    static rotateVector(v, xRotate, yRotate, zRotate) {
        v = this.rotateAroundX(v, xRotate);
        v = this.rotateAroundY(v, yRotate);
        v = this.rotateAroundZ(v, zRotate);
        return v;
    }
    static rotateAroundX(v, theta) {
        return new this(v.x, (v.y * Math.cos(theta)) - (v.z * Math.sin(theta)), (v.y * Math.sin(theta)) + (v.z * Math.cos(theta)));
    }
    static rotateAroundY(v, theta) {
        return new this((v.x * Math.cos(theta)) + (v.z * Math.sin(theta)), v.y, (-v.x * Math.sin(theta)) + (v.z * Math.cos(theta)));
    }
    static rotateAroundZ(v, theta) {
        return new this((v.x * Math.cos(theta)) - (v.y * Math.sin(theta)), (v.x * Math.sin(theta)) + (v.y * Math.cos(theta)), v.z);
    }
    static rotate2DVector(v, theta) {
        return new this((v.x * Math.cos(theta)) - (v.y * Math.sin(theta)), (v.x * Math.sin(theta)) + (v.y * Math.cos(theta)), 0);
    }
    isDotProductLEThanX(vector, x) {
        let dotProduct = Vector.dotProduct(this, vector);
        return (dotProduct <= x);
    }
    copy() {
        return new Vector(__classPrivateFieldGet(this, _Vector_x, "f"), __classPrivateFieldGet(this, _Vector_y, "f"), __classPrivateFieldGet(this, _Vector_z, "f"));
    }
}
_Vector_x = new WeakMap(), _Vector_y = new WeakMap(), _Vector_z = new WeakMap();
//# sourceMappingURL=Vector.js.map