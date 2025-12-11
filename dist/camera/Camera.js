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
var _Camera_physicsBody, _Camera_viewVector, _Camera_fovAngle, _Camera_focalDistance, _Camera_aspectRatio, _Camera_up, _Camera_right;
import { Vector } from "../geometry/Vector.js";
import { Field } from "../geometry/Field.js";
export class Camera {
    constructor(physicsBody, viewVector, fovAngle, focalDistance, aspectRatio) {
        _Camera_physicsBody.set(this, void 0);
        _Camera_viewVector.set(this, void 0);
        _Camera_fovAngle.set(this, void 0);
        _Camera_focalDistance.set(this, void 0);
        _Camera_aspectRatio.set(this, void 0);
        _Camera_up.set(this, void 0);
        _Camera_right.set(this, void 0);
        __classPrivateFieldSet(this, _Camera_physicsBody, physicsBody, "f");
        __classPrivateFieldSet(this, _Camera_viewVector, Vector.unitVector(viewVector), "f");
        __classPrivateFieldSet(this, _Camera_fovAngle, fovAngle, "f");
        __classPrivateFieldSet(this, _Camera_focalDistance, focalDistance, "f");
        __classPrivateFieldSet(this, _Camera_aspectRatio, aspectRatio, "f");
        //this.projectionPlane = ProjectionPlane.generateProjectionPlaneFromCamera(this,fovAngle,focalDistance,aspectRatio);
        __classPrivateFieldSet(this, _Camera_up, new Vector(0, 1, 0), "f");
        __classPrivateFieldSet(this, _Camera_right, Vector.unitVector(Vector.crossProduct(__classPrivateFieldGet(this, _Camera_up, "f"), viewVector)), "f");
    }
    get focalDistance() {
        return __classPrivateFieldGet(this, _Camera_focalDistance, "f");
    }
    setPosition(position) {
        if (!(position instanceof Vector))
            throw Error("position is not an instance of Vector");
        __classPrivateFieldGet(this, _Camera_physicsBody, "f").position = position;
    }
    putCameraAtCenterOfMeshCoordinateSystem(mesh) {
        let newMesh = mesh.copy();
        newMesh = this.shiftMeshIntoCameraSpace(newMesh);
        newMesh = this.projectMeshOntoCameraAxis(newMesh);
        return newMesh;
    }
    shiftMeshIntoCameraSpace(mesh) {
        let newPoints = [];
        let newMesh = mesh.copy();
        for (let i = 0; i < mesh.numPoints(); i++) {
            newPoints.push(Vector.sub(mesh.getVertex(i), __classPrivateFieldGet(this, _Camera_physicsBody, "f").position));
        }
        newMesh.vertices = new Field(newPoints);
        return newMesh;
    }
    projectMeshOntoCameraAxis(mesh) {
        let newPoints = [];
        let newMesh = mesh.copy();
        for (let i = 0; i < mesh.numPoints(); i++) {
            let item = mesh.getVertex(i);
            let x = Vector.dotProduct(item, __classPrivateFieldGet(this, _Camera_right, "f"));
            let y = Vector.dotProduct(item, __classPrivateFieldGet(this, _Camera_up, "f"));
            let z = Vector.dotProduct(item, __classPrivateFieldGet(this, _Camera_viewVector, "f"));
            newPoints.push(new Vector(x, y, z));
        }
        newMesh.vertices = new Field(newPoints);
        return newMesh;
    }
    rejectNegativeZValuesList(field) {
        let list = [];
        for (let i = 0; i < field.numPoints(); i++) {
            list.push(this.isVertexVisible(field.getVertex(i)));
        }
        return list;
    }
    isVertexVisible(vertex) {
        if (vertex.z < 0)
            return false;
        return true;
    }
    copy() {
        return new Camera(__classPrivateFieldGet(this, _Camera_physicsBody, "f").copy(), // or whatever your Vector clone is
        __classPrivateFieldGet(this, _Camera_viewVector, "f").copy(), __classPrivateFieldGet(this, _Camera_fovAngle, "f"), __classPrivateFieldGet(this, _Camera_focalDistance, "f"), __classPrivateFieldGet(this, _Camera_aspectRatio, "f"));
    }
    pointAtPoint(point) {
        if (!(point instanceof Vector))
            throw Error("point is not an instance of Vector");
        __classPrivateFieldSet(this, _Camera_viewVector, Vector.unitVector(Vector.sub(point, __classPrivateFieldGet(this, _Camera_physicsBody, "f").position)), "f");
    }
}
_Camera_physicsBody = new WeakMap(), _Camera_viewVector = new WeakMap(), _Camera_fovAngle = new WeakMap(), _Camera_focalDistance = new WeakMap(), _Camera_aspectRatio = new WeakMap(), _Camera_up = new WeakMap(), _Camera_right = new WeakMap();
