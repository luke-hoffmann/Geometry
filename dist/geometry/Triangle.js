import { Vector } from "./Vector.js";
import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
export class Triangle {
    constructor(verticeReferences) {
        this.verticeReferences = verticeReferences;
    }
    getVerticeRef(x) {
        return this.verticeReferences[x];
    }
    doesUpspaceContain(field, point) {
        let PA = Vector.sub(field.getVertex(point), field.getVertex(this.verticeReferences[0]));
        let normal = this.computeNormal(field);
        let dotProduct = Vector.dotProduct(PA, normal);
        const epsilon = 1e-5;
        if (Math.abs(dotProduct) < epsilon)
            return false;
        if (dotProduct < 0)
            return false;
        return true;
    }
    computeCentroid(field) {
        let p1 = field.getVertex(this.verticeReferences[0]);
        let p2 = field.getVertex(this.verticeReferences[1]);
        let p3 = field.getVertex(this.verticeReferences[2]);
        let p4 = Vector.lerpVector(p1, p2, 0.5);
        // centroid is 0.33 from the line, .66 from the point
        return Vector.lerpVector(p4, p3, 0.33333);
    }
    static isDotProductLEThanX(v1, v2, x) {
        throw Error("function has been moved to the vector class.");
        let dotProduct = Vector.dotProduct(v1, v2);
        return (dotProduct <= x);
    }
    computeNormal(field) {
        let s1 = Vector.sub(field.getVertex(this.verticeReferences[0]), field.getVertex(this.verticeReferences[1]));
        let s2 = Vector.sub(field.getVertex(this.verticeReferences[2]), field.getVertex(this.verticeReferences[0]));
        let cross = Vector.crossProduct(s1, s2);
        return Vector.unitVector(cross);
    }
    distanceTo(field, v) {
        let normal = this.computeNormal(field);
        let reference = field.getVertex(this.verticeReferences[0]);
        let d = -(normal.x * reference.x + normal.y * reference.y + normal.z * reference.z);
        return Math.abs(normal.x * v.x + normal.y * v.y + normal.z * v.z + d) / (Math.sqrt((normal.x ** 2) + (normal.y ** 2) + (normal.z ** 2)));
    }
    getFarthestPoint(field, pointIndices) {
        if (!(pointIndices.length > 0))
            throw Error("pointIndices must contain at least one entry");
        let farthestPoint = pointIndices[0];
        let farthestDistance = 0;
        for (const point of pointIndices) {
            let pointToFindDistanceTo = (field.getVertex(point));
            let distance = this.distanceTo(field, pointToFindDistanceTo);
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthestPoint = point;
            }
        }
        return farthestPoint;
    }
    flipNormal() {
        let outputTriangle = this.constructor(this.verticeReferences.reverse());
        return outputTriangle;
    }
    static addPointsFromTrianglesToMap(map, triangles) {
        triangles = [...triangles];
        for (let i = 0; i < triangles.length; i++) {
            let vertices = triangles[i].verticeReferences;
            for (let j = 0; j < vertices.length - 1; j++) {
                UsefulFunction.addToMap(map, triangles[i].verticeReferences[j], triangles[i].verticeReferences[j + 1]);
            }
            UsefulFunction.addToMap(map, triangles[i].verticeReferences[2], triangles[i].verticeReferences[0]);
        }
    }
    static createPyramidFromBoundaryPoints(boundaryIndices, point) {
        let newTriangles = [];
        for (let i = 0; i < boundaryIndices.length - 1; i++) {
            const newTriangle = new this([point, boundaryIndices[i], boundaryIndices[i + 1]]);
            newTriangles.push(newTriangle);
        }
        newTriangles.push(new this([point, boundaryIndices[boundaryIndices.length - 1], boundaryIndices[0]]));
        return newTriangles;
    }
    copy() {
        let newTriangleReferences = [];
        for (const reference of this.verticeReferences) {
            newTriangleReferences.push(reference);
        }
        return new Triangle(newTriangleReferences);
    }
}
//# sourceMappingURL=Triangle.js.map