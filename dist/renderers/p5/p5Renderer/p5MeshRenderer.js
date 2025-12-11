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
var _p5MeshRenderer_graphicsBuffer, _p5MeshRenderer_p5;
import { MeshRenderer } from "../../../interface/MeshRenderer.js";
import { Vector } from "../../../geometry/Vector.js";
import { Field } from "../../../geometry/Field.js";
import { Line } from "../../../geometry/Line.js";
export class p5MeshRenderer extends MeshRenderer {
    constructor(mesh, screenSize, camera, lights, renderParameters, p) {
        super(mesh, camera, lights, renderParameters);
        _p5MeshRenderer_graphicsBuffer.set(this, void 0);
        _p5MeshRenderer_p5.set(this, void 0);
        p.createCanvas(screenSize.x, screenSize.y);
        __classPrivateFieldSet(this, _p5MeshRenderer_p5, p, "f");
        __classPrivateFieldSet(this, _p5MeshRenderer_graphicsBuffer, p.createGraphics(screenSize.x, screenSize.y), "f");
    }
    /*

    doBackFaceCulling: true,
            doOutline: true,
            doFill: true,
            doVertices: false,
            doNormalVectors: false,
            doShadingWithLighting: true,
            lineWidth: 1,
            pointRadius: 3

            */
    preWork() {
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").clear();
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").background(200);
    }
    postWork() {
        __classPrivateFieldGet(this, _p5MeshRenderer_p5, "f").image(__classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f"), 0, 0);
    }
    /**
     * Important that this function is placed inside the native p5.js draw() function.
     *
     *
    **/
    graph() {
        this.preWork();
        let mesh = this.mesh.copy();
        mesh = this.camera.putCameraAtCenterOfMeshCoordinateSystem(mesh);
        if (this.renderParameters.doBackFaceCulling) {
            mesh = this.backFaceCulling();
        }
        mesh = this.applyProjection();
        mesh = this.meshToCanvas();
        this.graphVertices();
        this.graphTriangles(__classPrivateFieldGet(this, _p5MeshRenderer_p5, "f").color(0));
        this.postWork();
    }
    orthographicProjectIndividualVector(vector) {
        return new Vector(vector.x, vector.y, this.camera.focalDistance);
    }
    perspectiveProjectIndividualVector(vector) {
        const ratio = this.camera.focalDistance / vector.z;
        let x = vector.x * ratio;
        let y = vector.y * ratio;
        let z = this.camera.focalDistance;
        return new Vector(x, y, z);
    }
    perspectiveProjectNormalVectorIntoLine(normalVector, length) {
        let p1 = this.perspectiveProjectIndividualVector(normalVector.position);
        let p2 = this.perspectiveProjectIndividualVector(Vector.add(Vector.scalarMult(normalVector.direction, length), normalVector.position));
        return new Line(p1, p2);
    }
    perspectiveProjectNormalVectorsIntoLines(normalVectors, length) {
        let lines = [];
        for (const v of normalVectors) {
            lines.push(this.perspectiveProjectNormalVectorIntoLine(v, length));
        }
        return lines;
    }
    applyProjection() {
        let newMesh = this.mesh.copy();
        let projectedArray = [];
        for (let i = 0; i < newMesh.numPoints(); i++) {
            let pV;
            const v = newMesh.getVertex(i);
            if (this.renderParameters.isPerspective) {
                pV = this.perspectiveProjectIndividualVector(v);
            }
            else {
                pV = this.orthographicProjectIndividualVector(v);
            }
            projectedArray.push(pV);
        }
        let projectedField = new Field(projectedArray);
        newMesh.vertices = projectedField;
        return newMesh;
    }
    linesToCanvas(lines) {
        let canvasLines = [];
        for (const line of lines) {
            canvasLines.push(new Line(this.calculateCanvasPos(line.p1), this.calculateCanvasPos(line.p2)));
        }
        return canvasLines;
    }
    meshToCanvas() {
        let canvasArray = [];
        for (let i = 0; i < this.mesh.numPoints(); i++) {
            canvasArray.push(this.calculateCanvasPos(this.mesh.getVertex(i)));
        }
        let mesh = this.mesh.copy();
        mesh.vertices = new Field(canvasArray);
        return mesh;
    }
    calculateCanvasPos(meshPos) {
        return Vector.add(new Vector(__classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").width / 2, __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").height / 2, 0), meshPos);
    }
    graphVertices() {
        for (let i = 0; i < this.mesh.numPoints(); i++) {
            this.graphVertex(this.mesh.getVertex(i), this.renderParameters.pointRadius);
        }
    }
    graphVertex(vertex, size) {
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").stroke(0);
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").fill(0);
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").circle(vertex.x, vertex.y, size);
    }
    graphVisibleVertex(vertex, size) {
        if (this.camera.isVertexVisible(vertex))
            this.graphVertex(vertex, size);
    }
    graphVisibleVertices(size) {
        for (let i = 0; i < this.mesh.numPoints(); i++) {
            this.graphVisibleVertex(this.mesh.getVertex(i), size);
        }
    }
    graphTriangle(triangle) {
        let p1 = this.mesh.getVertex(triangle.getVerticeRef(0));
        let p2 = this.mesh.getVertex(triangle.getVerticeRef(1));
        let p3 = this.mesh.getVertex(triangle.getVerticeRef(2));
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").strokeJoin(__classPrivateFieldGet(this, _p5MeshRenderer_p5, "f").ROUND);
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").noFill();
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    }
    graphTriangles(color) {
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").stroke(color);
        for (let i = 0; i < this.mesh.numTriangles(); i++) {
            this.graphTriangle(this.mesh.getTriangle(i));
            continue;
        }
    }
    graphLines(lines, color) {
        for (const line of lines) {
            this.graphLine(line, color);
        }
    }
    graphLine(line, color) {
        this.graphBetweenTwoPoints(line.p1, line.p2, color);
    }
    graphBetweenTwoPoints(p1, p2, color) {
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").stroke(color);
        __classPrivateFieldGet(this, _p5MeshRenderer_graphicsBuffer, "f").line(p1.x, p1.y, p2.x, p2.y);
    }
}
_p5MeshRenderer_graphicsBuffer = new WeakMap(), _p5MeshRenderer_p5 = new WeakMap();
/*
if (typeof window !== "undefined") {
    window.p5MeshRenderer  = p5MeshRenderer;
}

*/ 
