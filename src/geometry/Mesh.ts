import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
import { Vector } from "./Vector.js";
import { Line } from "./Line.js";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "./NormalVector.js";
export class Mesh {
    private vertices : Field;
    private triangles : Triangle[];
    constructor (vertices : Field,triangles : Triangle[]) {
        
        this.vertices = vertices;
        this.triangles = triangles;
        if (vertices ==undefined) {
            this.vertices = new Field([]);
        }
        if (triangles ==undefined) {
            this.triangles = [];
        }
    }
    
    
    
    calculateTriangleNormalVector(triangle : Triangle) : NormalVector {
        let centerOfTriangle = triangle.computeCentroid(this.vertices);
        let normalVector = triangle.computeNormal(this.vertices)
        return new NormalVector(centerOfTriangle,normalVector);
    }
    calculateTriangleNormalVectors() : NormalVector[]{
        let field = this.vertices; 
        let normalVectors = []; 
        for (const triangle of this.triangles) {
            normalVectors.push(this.calculateTriangleNormalVector(triangle));
        }
        return normalVectors;
    }
    
    copy(){
        let newMesh = new Mesh([],[])
        
        for (const triangles of this.triangles) {
            newMesh.triangles.push (new Triangle(triangle.verticeReferences));
        }
        for (const vertex of this.vertices.array) {
            newMesh.vertices.array.push (new Vector(vertex.x,vertex.y,vertex.z));
        }

        return newMesh;
    }


    
}