import { Vector } from "./Vector.js";
import { UsefulFunction } from "usefulfunction";
import { Field } from "./Field.js";
import { NormalVector } from "./NormalVector.js";
export class Triangle {
    #verticeReferences : number[];
    constructor (verticeReferences : number[]) {

        this.#verticeReferences = verticeReferences;
        
    }
    logReferences() : void{
        console.log(this.#verticeReferences[0], this.#verticeReferences[1],this.#verticeReferences[2]);
    }
    doesUpspaceContain(field : Field,point: number) : boolean{

        let PA = Vector.sub(field.getVertex(point),field.getVertex(this.#verticeReferences[0]));
        let normal = this.computeNormal(field);
        let dotProduct = Vector.dotProduct(PA,normal);
        const epsilon = 1e-5;
        if (Math.abs(dotProduct)< epsilon) return false;
        if (dotProduct < 0) return false;
        return true;
    }
    computeCentroid(field : Field) : Vector{

        let p1 = field.getVertex(this.#verticeReferences[0]);
        let p2 = field.getVertex(this.#verticeReferences[1]);
        let p3 = field.getVertex(this.#verticeReferences[2]);
        let p4 = Vector.lerpVector(p1,p2,0.5);
        // centroid is 0.33 from the line, .66 from the point
        return Vector.lerpVector(p4,p3,0.33333);
        
    }
    static isDotProductLEThanX(v1 : Vector,v2 : Vector,x : number) : boolean{
        throw Error ("function has been moved to the vector class.")
        let dotProduct = Vector.dotProduct(v1,v2);
        return (dotProduct <= x);
    }

    

    computeNormal(field : Field) : Vector{
        let s1 = Vector.sub(field.getVertex(this.#verticeReferences[0]),field.getVertex(this.#verticeReferences[1]));
        
        let s2 = Vector.sub(field.getVertex(this.#verticeReferences[2]),field.getVertex(this.#verticeReferences[0]));
        let cross = Vector.crossProduct(s1,s2);
        return Vector.unitVector(cross);
    }
    distanceTo(field : Field,v: Vector) : number{
        let normal = this.computeNormal(field);

        let reference = field.getVertex(this.#verticeReferences[0]);
        let d = -(normal.x * reference.x + normal.y * reference.y + normal.z * reference.z);
        return Math.abs(normal.x*v.x + normal.y*v.y + normal.z*v.z + d)/ (Math.sqrt((normal.x**2) + (normal.y**2) + (normal.z**2)));
    }

    getFarthestPoint(field : Field,pointIndices : number[]): number {
        if (!(pointIndices.length > 0)) throw Error("pointIndices must contain at least one entry");
        let farthestPoint = pointIndices[0];
        let farthestDistance = 0;
        for (const point of pointIndices) {
            let pointToFindDistanceTo = (field.getVertex(point));
            let distance = this.distanceTo(field,pointToFindDistanceTo);
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthestPoint = point;
            }
        }
        return farthestPoint;
    }
    
    
    
    
    flipNormal() : Triangle{
        let outputTriangle = new Triangle([this.#verticeReferences[2],this.#verticeReferences[1],this.#verticeReferences[0]]);
        return outputTriangle;
    }
    
    getVerticeReference(i : number) : number {
        return this.#verticeReferences[i];
    }
    
    static addPointsFromTrianglesToMap(map : Map<number,number[]>,triangles : Triangle[]){
        for (let i =0; i < triangles.length;i++) {
            
            for (let j =0 ; j< 3-1 ;j++) {
                UsefulFunction.addToMap(map,triangles[i].getVerticeReference(j),triangles[i].getVerticeReference(j+1));
            }
            UsefulFunction.addToMap(map,triangles[i].getVerticeReference(2),triangles[i].getVerticeReference(0));

        }
    }
    
    static createPyramidFromBoundaryPoints(boundaryIndices : number[],point : number) : Triangle[]{

        let newTriangles = [];
        for(let i =0; i < boundaryIndices.length-1; i ++) {
            const newTriangle = new this([point,boundaryIndices[i],boundaryIndices[i+1]]);
            newTriangles.push(newTriangle);
        }
        
        newTriangles.push(new this([point,boundaryIndices[boundaryIndices.length-1],boundaryIndices[0]]));

        return newTriangles;
    }


    copy() : Triangle{
        let newTriangleReferences = [];
        for (const reference of this.#verticeReferences) {
            newTriangleReferences.push(reference);
        }
        return new Triangle(newTriangleReferences);
    }

    getDistinctIdentifier() : string{
        return (this.#verticeReferences[0].toString() + this.#verticeReferences[1].toString() + this.#verticeReferences[2].toString())
    }
    calculateTriangleNormalVector(field : Field) : NormalVector {
        let centerOfTriangle = this.computeCentroid(field);
        let normalVector = this.computeNormal(field)
        return new NormalVector(centerOfTriangle,normalVector);
    }

    
}