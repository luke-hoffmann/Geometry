var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ProjectionPlane_tL, _ProjectionPlane_bL, _ProjectionPlane_tR, _ProjectionPlane_bR;
import { Field } from "../geometry/Field.js";
import { Vector } from "../geometry/Vector.js";
export class ProjectionPlane {
    constructor(topLeft, bottomLeft, topRight, bottomRight) {
        _ProjectionPlane_tL.set(this, void 0);
        _ProjectionPlane_bL.set(this, void 0);
        _ProjectionPlane_tR.set(this, void 0);
        _ProjectionPlane_bR.set(this, void 0);
        __classPrivateFieldSet(this, _ProjectionPlane_tL, topLeft, "f");
        __classPrivateFieldSet(this, _ProjectionPlane_bL, bottomLeft, "f");
        __classPrivateFieldSet(this, _ProjectionPlane_tR, topRight, "f");
        __classPrivateFieldSet(this, _ProjectionPlane_bR, bottomRight, "f");
    }
    static generateProjectionPlaneFromCamera(camera) {
        // aspect ratio is a number that is equivalent to height/width of the Projection Box/Plane
        let pointsOfProjectionPlane = new Field([]);
        let centerPointOfPlane = Vector.add(Vector.scalarMult(camera.viewVector, focalDistance), camera.position);
        let verticalUnitVector = Vector.upVector();
        let lateralUnitVector = Vector.unitVector(Vector.crossProduct(camera.viewVector, verticalUnitVector));
        let lateralVector = Vector.scalarMult(lateralUnitVector, focalDistance / Math.tan(90 - (fovAngle / 2)));
        let verticalVector = Vector.scalarMult(verticalUnitVector, lateralVector.magnitude() * aspectRatio);
        let left = Vector.add(centerPointOfPlane, lateralVector);
        let right = Vector.sub(centerPointOfPlane, lateralVector);
        return new this(Vector.add(left, verticalVector), Vector.sub(left, verticalVector), Vector.add(right, verticalVector), Vector.sub(right, verticalVector));
    }
    projectPointOntoPlane() { }
    projectFieldOntoPlane(field) {
    }
}
_ProjectionPlane_tL = new WeakMap(), _ProjectionPlane_bL = new WeakMap(), _ProjectionPlane_tR = new WeakMap(), _ProjectionPlane_bR = new WeakMap();
