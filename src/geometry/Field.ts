import { Vector } from "./Vector.js";
import { Triangle } from "./Triangle.js";
import {Line} from "./Line.js";
import { UsefulFunction } from "usefulfunction";
export class Field {
    private array : Vector[];
    constructor(array : Vector[]) {
        
        this.array = array;
        if(array == undefined) {
            this.array = [];
        }
    }
    getVertex(index : number) : Vector {
        return this.array[index];
    }
    
    generateRandomPointsInSphere(radius : number,n : number){
        this.array = [];
        for (let i =0; i < n; i++) {
            this.array.push(Vector.generateVectorInSphere(radius));
        }
    }
    getTrianglesUpspace(triangle : Triangle,indices : number[]) : number[] {
        let indicesAbovePlane = []
        for (const point of indices) {
            // need to replace to instead see if the point lies on the plane or not.
            if (point == triangle.getVerticeReference(0) || point == triangle.getVerticeReference(1) || point ==triangle.getVerticeReference(2) ) continue;

            if (!triangle.doesUpspaceContain(this,point)) continue;
            indicesAbovePlane.push(point)

        }
        return  indicesAbovePlane;
    }

    getTrianglesWithPointInUpspace(triangles : Triangle[],point : number) : Triangle[]{
        let trianglesContainingIndices = [];
        let triangle;
        for (let i =0; i < triangles.length;i++) {
            triangle = triangles[i]
            if (!triangle.doesUpspaceContain(this,point)) continue;
            trianglesContainingIndices.push(triangle);
        }
        return trianglesContainingIndices;
    }
    getTriangleIndicesWithPointInUpspace(triangles : Triangle[],point : number) : number[]{
        let trianglesContainingIndices = [];
        let triangle;
        for (let i =0; i < triangles.length;i++) {
            triangle = triangles[i]
            if (!triangle.doesUpspaceContain(this,point)) continue;
            trianglesContainingIndices.push(i);
        }
        return trianglesContainingIndices;
    }
    
    getTrianglesUpspaces(triangles : Triangle[], indices : number[]) : number[] {
        
        let upspace= [];
        for (const triangle of triangles) {
            upspace.push(this.getTrianglesUpspace(triangle,indices));
        }

        upspace = UsefulFunction.combineArrays(upspace);
        return UsefulFunction.noDuplicates(upspace);
    }

    getTrianglesUpspaces_Fast(triangles : Triangle[], indices : number[]) : number[] {
        
        let upspace= [];
        for (const triangle of triangles) {
            let indicesAbovePlane = []
            for (const point of indices) {
                // need to replace to instead see if the point lies on the plane or not.
                if (point == triangle.getVerticeReference(0) || point == triangle.getVerticeReference(1) || point ==triangle.getVerticeReference(2) ) continue;
                let p1 = this.getVertex(point);
                let p2 = this.getVertex(triangle.getVerticeReference(0));
                let PA_x = p1.x - p2.x;
                let PA_y = p1.y - p2.y;
                let PA_z = p1.z - p2.z;
                let normal = triangle.computeNormal(this);
                let dotProduct = (PA_x * normal.x) + (PA_y * normal.y) + (PA_z * normal.z);
                const epsilon = 1e-5;
                let doesUpspaceContain = false;
                if (Math.abs(dotProduct)< epsilon) doesUpspaceContain =  false;
                if (dotProduct < 0) doesUpspaceContain = false;
                doesUpspaceContain = true;

                if (!triangle.doesUpspaceContain(this,point)) continue;
                indicesAbovePlane.push(point)

            }
            upspace.push(indicesAbovePlane);
        }

        upspace = UsefulFunction.combineArrays(upspace);
        return UsefulFunction.noDuplicates(upspace);
    }
    
    getPointsAtIndices(field : Field,indices : number[]) : Vector[] {
        let points = [];
        for (const index of indices) {
            points.push(field.array[index]);
        }
        return points;
    }    
    getAverageDistanceBetweenPointsAndTriangles(triangles : Triangle[],pointIndices : number[]) {
        let distanceAveragesToAllTriangles = [];
        for (const point of pointIndices) {
            
            let sum = 0;
            for (const triangle of triangles) {
                sum += triangle.distanceTo(this,this.getVertex(point));
            }
            let average = sum/triangles.length;
            distanceAveragesToAllTriangles.push(average);
        }
        return distanceAveragesToAllTriangles;
    }

    getFarthestPointFromTriangles( triangles : Triangle[], pointIndices : number[]) : number{
        let farthestPoints = this.getFarthestPointsFromTriangles(triangles,pointIndices);
        let distanceAveragesToAllTriangles = this.getAverageDistanceBetweenPointsAndTriangles(triangles,farthestPoints);
        
        let indexOfPoint = UsefulFunction.getIndexOfArrayMax(distanceAveragesToAllTriangles);
        if (indexOfPoint == undefined) throw Error("Bad error");
        return farthestPoints[indexOfPoint];
    }
    getFarthestPointFromTriangles_Fast(triangles : Triangle[], pointIndices : number[]) : number{
        let farthestPoint = pointIndices[0];
        let farthestDistance = -Infinity;
        for (const point of pointIndices) {
            let sumOfSquaredDistances = 0;
            const v = this.getVertex(point);
            for (const triangle of triangles) {
                const normal = triangle.computeNormal(this);

                const reference = this.getVertex(triangle.getVerticeReference(0));
                const d = -(normal.x * reference.x + normal.y * reference.y + normal.z * reference.z);
                
                sumOfSquaredDistances += (normal.x*v.x + normal.y*v.y + normal.z*v.z + d)/ (((normal.x**2) + (normal.y**2) + (normal.z**2)));
            }
            if (sumOfSquaredDistances >farthestDistance) {
                farthestDistance = sumOfSquaredDistances;
                farthestPoint = point;
            }
        }
        return farthestPoint;
    }
    getFarthestPointsFromTriangles(triangles : Triangle[],pointIndices : number[]){
        
        let farthestPoints = [];
        let farthestPoint;
        for (const triangle of triangles) {
            farthestPoints.push(triangle.getFarthestPoint(this,pointIndices));
        }
        return farthestPoints;
    }

    



    getFarthestVectorFromVector(index : number) : number{
        let greatestDistance = 0;
        let farthestDistancePoint = undefined
        let farthestDistancePointIndex = -1
        let v = this.array[index];
        for (let i =0; i< this.array.length; i++){

            let dist = Vector.distanceBetweenVectors(this.array[i],v);
            if (dist > greatestDistance){
                greatestDistance = dist;
                farthestDistancePoint = this.array[i]
                farthestDistancePointIndex = i;
            }
        }
        if (farthestDistancePointIndex == -1 ) throw Error("no farthest distance point found at all");
        return farthestDistancePointIndex;
    }

    calculateLargestTriangleFromField() : Triangle{
        
        let point1Index = this.lowestVectorInField()
        let point2Index = this.getFarthestVectorFromVector(point1Index);

        let line = new Line(this.array[point1Index],this.array[point2Index]);
        let point3Index = this.calculateFarthestPoint(line);

        let triangle = new Triangle([point1Index,point2Index,point3Index]);
        
        return triangle;

    }

    calculateFarthestPoint(line : Line) : number{
        let farthestDistance = 0;
        let farthestPoint = undefined
        let farthestPointIndex = -1;
        for (let i =0 ; i <this.array.length ; i++) {
            let pointIsFromLine = Vector.isVectorEqual(this.array[i],line.p1) || Vector.isVectorEqual(this.array[i],line.p2);
            if (pointIsFromLine) continue;
            let distance= line.distanceToPoint(this.array[i]);
            
            if (farthestDistance < distance) {
                farthestPoint = this.array[i];
                farthestDistance = distance;
                farthestPointIndex = i;
            }
        }
        if (farthestPointIndex == -1) throw Error("no farthest point found");
        return farthestPointIndex;
    }
    
    lowestVectorInField() : number{
        if (this.array.length == 0) throw Error ("array length is 0");
        let lowestCoordinate = this.array[0];
        let indexOfLowestCoordinate = 0;
        for (let i =0; i < this.array.length; i++) {
            if(lowestCoordinate.x > this.array[i].x) {
                lowestCoordinate = this.array[i];
                indexOfLowestCoordinate = i;
                i = 0;
            }
        }
        return indexOfLowestCoordinate
    }

    
    
    moveEntireField(moveQuantity : Vector) : Field{
        let newField = []
        for (let i =0 ; i< this.array.length;i++) {
            newField.push(Vector.add(this.array[i],moveQuantity));
        }
        return new Field(newField);
    }   
    copy() : Field {
        let copiedPoints = [];
        for (const vertex of this.array) {
            copiedPoints.push(new Vector(vertex.x,vertex.y,vertex.z));
        }

        return new Field(copiedPoints);
    }
    get numPoints() : number{
        return this.array.length;
    }
    
}