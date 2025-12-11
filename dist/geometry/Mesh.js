import { Field } from "./Field.js";
import { NormalVector } from "./NormalVector.js";
export class Mesh {
    constructor(vertices, triangles) {
        this.vertices = vertices;
        this.triangles = triangles;
        if (vertices == undefined) {
            this.vertices = new Field([]);
        }
        if (triangles == undefined) {
            this.triangles = [];
        }
    }
    calculateTriangleNormalVector(triangle) {
        let centerOfTriangle = triangle.computeCentroid(this.vertices);
        let normalVector = triangle.computeNormal(this.vertices);
        return new NormalVector(centerOfTriangle, normalVector);
    }
    calculateTriangleNormalVectors() {
        let field = this.vertices;
        let normalVectors = [];
        for (const triangle of this.triangles) {
            normalVectors.push(this.calculateTriangleNormalVector(triangle));
        }
        return normalVectors;
    }
    copy() {
        let newTriangles = [];
        for (const triangle of this.triangles) {
            newTriangles.push(triangle.copy());
        }
        return new Mesh(this.vertices.copy(), newTriangles);
    }
}
//# sourceMappingURL=Mesh.js.map