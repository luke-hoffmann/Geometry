import { Vector } from "./Vector.js";
import { Triangle } from "./Triangle.js";
import { Line } from "./Line.js";
import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
export class Field {
    constructor(array) {
        this.array = array;
        if (array == undefined) {
            this.array = [];
        }
    }
    getVertex(index) {
        return this.array[index];
    }
    static generateFieldFromMatrixOfPoints(matrix) {
        let newField = new Field([]);
        for (const row of matrix) {
            newField.array.push(new Vector(row[0], row[1], row[2]));
        }
        return newField;
    }
    generateRandomPointsInSphere(radius, n) {
        this.array = [];
        for (let i = 0; i < n; i++) {
            this.array.push(Vector.generateVectorInSphere(radius));
        }
    }
    getTriangleUpspace(triangle, indices) {
        let indicesAbovePlane = [];
        for (const point of indices) {
            // need to replace to instead see if the point lies on the plane or not.
            if (point == triangle.getVerticeRef(0) || point == triangle.getVerticeRef(1) || point == triangle.getVerticeRef(2))
                continue;
            if (!triangle.doesUpspaceContain(this, point))
                continue;
            indicesAbovePlane.push(point);
        }
        return indicesAbovePlane;
    }
    getTrianglesWithPointInUpspace(triangles, point) {
        let trianglesContainingIndices = [];
        let triangle;
        for (let i = 0; i < triangles.length; i++) {
            triangle = triangles[i];
            if (!triangle.doesUpspaceContain(this, point))
                continue;
            trianglesContainingIndices.push(triangle);
        }
        return trianglesContainingIndices;
    }
    getTrianglesUpspace(triangles, indices) {
        let upspace = [];
        for (const triangle of triangles) {
            upspace.push(this.getTriangleUpspace(triangle, indices));
        }
        upspace = UsefulFunction.combineArrays(upspace);
        return UsefulFunction.noDuplicates(upspace);
    }
    getPointsAtIndices(field, indices) {
        let points = [];
        for (const index of indices) {
            points.push(field.array[index]);
        }
        return points;
    }
    getAverageDistanceBetweenPointsAndTriangles(triangles, pointIndices) {
        let distanceAveragesToAllTriangles = [];
        for (const point of pointIndices) {
            let sum = 0;
            for (const triangle of triangles) {
                sum += triangle.distanceTo(this, this.getVertex(point));
            }
            let average = sum / triangles.length;
            distanceAveragesToAllTriangles.push(average);
        }
        return distanceAveragesToAllTriangles;
    }
    // bad one
    getFarthestPointFromTriangles(triangles, pointIndices) {
        let farthestPoints = this.getFarthestPointsFromTriangles(triangles, pointIndices);
        let distanceAveragesToAllTriangles = this.getAverageDistanceBetweenPointsAndTriangles(triangles, farthestPoints);
        let indexOfPoint = UsefulFunction.getIndexOfArrayMax(distanceAveragesToAllTriangles);
        if (indexOfPoint == undefined)
            return false;
        return farthestPoints[indexOfPoint];
    }
    getFarthestPointsFromTriangles(triangles, pointIndices) {
        let farthestPoints = [];
        let farthestPoint;
        for (const triangle of triangles) {
            farthestPoints.push(triangle.getFarthestPoint(this, pointIndices));
        }
        return farthestPoints;
    }
    getFarthestVectorFromVector(index) {
        let greatestDistance = 0;
        let farthestDistancePoint = undefined;
        let farthestDistancePointIndex = -1;
        let v = this.array[index];
        for (let i = 0; i < this.array.length; i++) {
            let dist = Vector.distanceBetweenVectors(this.array[i], v);
            if (dist > greatestDistance) {
                greatestDistance = dist;
                farthestDistancePoint = this.array[i];
                farthestDistancePointIndex = i;
            }
        }
        if (farthestDistancePointIndex == -1)
            throw Error("no farthest distance point found at all");
        return farthestDistancePointIndex;
    }
    calculateLargestTriangleFromField() {
        let point1Index = this.lowestVectorInField();
        let point2Index = this.getFarthestVectorFromVector(point1Index);
        let line = new Line(this.array[point1Index], this.array[point2Index]);
        let point3Index = this.calculateFarthestPoint(line);
        let triangle = new Triangle([point1Index, point2Index, point3Index]);
        return triangle;
    }
    calculateFarthestPoint(line) {
        let farthestDistance = 0;
        let farthestPoint = undefined;
        let farthestPointIndex = -1;
        for (let i = 0; i < this.array.length; i++) {
            let pointIsFromLine = Vector.isVectorEqual(this.array[i], line.p1) || Vector.isVectorEqual(this.array[i], line.p2);
            if (pointIsFromLine)
                continue;
            let distance = line.distanceToPoint(this.array[i]);
            if (farthestDistance < distance) {
                farthestPoint = this.array[i];
                farthestDistance = distance;
                farthestPointIndex = i;
            }
        }
        if (farthestPointIndex == -1)
            throw Error("no farthest point found");
        return farthestPointIndex;
    }
    lowestVectorInField() {
        if (this.array.length == 0)
            throw Error("array length is 0");
        let lowestCoordinate = this.array[0];
        let indexOfLowestCoordinate = 0;
        for (let i = 0; i < this.array.length; i++) {
            if (lowestCoordinate.x > this.array[i].x) {
                lowestCoordinate = this.array[i];
                indexOfLowestCoordinate = i;
                i = 0;
            }
        }
        return indexOfLowestCoordinate;
    }
    findVectorWithLowestZ() {
        let val = Infinity;
        let index = -1;
        for (let i = 0; i < this.array.length; i++) {
            let v = this.array[i];
            if (v.z < val) {
                val = v.z;
                index = i;
            }
        }
        if (index == -1)
            throw Error("no vector found!");
        return index;
    }
    findVectorWithHighestZ() {
        let val = -Infinity;
        let index = -1;
        for (let i = 0; i < this.array.length; i++) {
            let v = this.array[i];
            if (v.z > val) {
                val = v.z;
                index = i;
            }
        }
        if (index == -1)
            throw Error("no vector found!");
        return index;
    }
    moveEntireField(moveQuantity) {
        let newField = [];
        for (let i = 0; i < this.array.length; i++) {
            newField.push(Vector.add(this.array[i], moveQuantity));
        }
        return new Field(newField);
    }
    copy() {
        let copiedPoints = [];
        for (const vertex of this.array) {
            copiedPoints.push(new Vector(vertex.x, vertex.y, vertex.z));
        }
        return new Field(copiedPoints);
    }
    numPoints() {
        return this.array.length;
    }
}
//# sourceMappingURL=Field.js.map