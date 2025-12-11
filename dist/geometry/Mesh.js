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
var _Mesh_vertices, _Mesh_triangles;
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "./NormalVector.js";
export class Mesh {
    constructor(vertices, triangles) {
        _Mesh_vertices.set(this, void 0);
        _Mesh_triangles.set(this, void 0);
        if (!(vertices instanceof Field))
            throw Error("vertices is not an instance of Field");
        if (!(Array.isArray(triangles)))
            throw Error("triangles is not an array");
        // need to check if the elements inside the array are actually triangles too.
        __classPrivateFieldSet(this, _Mesh_vertices, vertices, "f");
        __classPrivateFieldSet(this, _Mesh_triangles, triangles, "f");
        if (vertices == undefined) {
            __classPrivateFieldSet(this, _Mesh_vertices, new Field([]), "f");
        }
        if (triangles == undefined) {
            __classPrivateFieldSet(this, _Mesh_triangles, [], "f");
        }
    }
    calculateTriangleNormalVector(triangle) {
        if (!(triangle instanceof Triangle))
            throw Error("triange is not an instance of Triangle");
        let centerOfTriangle = triangle.computeCentroid(__classPrivateFieldGet(this, _Mesh_vertices, "f"));
        let normalVector = triangle.computeNormal(__classPrivateFieldGet(this, _Mesh_vertices, "f"));
        return new NormalVector(centerOfTriangle, normalVector);
    }
    calculateTriangleNormalVectors() {
        let field = __classPrivateFieldGet(this, _Mesh_vertices, "f");
        let normalVectors = [];
        for (const triangle of __classPrivateFieldGet(this, _Mesh_triangles, "f")) {
            normalVectors.push(this.calculateTriangleNormalVector(triangle));
        }
        return normalVectors;
    }
    copy() {
        let newTriangles = [];
        for (const triangle of __classPrivateFieldGet(this, _Mesh_triangles, "f")) {
            newTriangles.push(triangle.copy());
        }
        return new Mesh(__classPrivateFieldGet(this, _Mesh_vertices, "f").copy(), newTriangles);
    }
    numPoints() {
        return __classPrivateFieldGet(this, _Mesh_vertices, "f").numPoints();
    }
    numTriangles() {
        return __classPrivateFieldGet(this, _Mesh_triangles, "f").length;
    }
    getVertex(index) {
        if (!Number.isSafeInteger(index))
            throw Error("index is not a safe integer");
        return __classPrivateFieldGet(this, _Mesh_vertices, "f").getVertex(index);
    }
    getTriangle(index) {
        if (!Number.isSafeInteger(index))
            throw Error("index is not a safe integer");
        return __classPrivateFieldGet(this, _Mesh_triangles, "f")[index];
    }
    set vertices(vertices) {
        if (!(vertices instanceof Field))
            throw Error("vertices must be an instance of Field");
        __classPrivateFieldSet(this, _Mesh_vertices, vertices, "f");
    }
    set triangles(triangles) {
        if (!(Array.isArray(triangles)))
            throw Error("triangles is not an array");
        // also need to check that each element in triangle is an instance of triangle
        __classPrivateFieldSet(this, _Mesh_triangles, triangles, "f");
    }
}
_Mesh_vertices = new WeakMap(), _Mesh_triangles = new WeakMap();
