import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction.js";
import { Vector } from "./Vector.js";
import { Line } from "./Line.js";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "./NormalVector.js";
export class Mesh {
    #vertices : Field;
    #triangles : Triangle[];
    constructor (vertices : Field,triangles : Triangle[]) {
        if (!(vertices instanceof Field)) throw Error("vertices is not an instance of Field");
        if (!(Array.isArray(triangles))) throw Error("triangles is not an array");
        // need to check if the elements inside the array are actually triangles too.
        this.#vertices = vertices;
        this.#triangles = triangles;
        if (vertices ==undefined) {
            this.#vertices = new Field([]);
        }
        if (triangles ==undefined) {
            this.#triangles = [];
        }
    }
    
    
    
    calculateTriangleNormalVector(triangle : Triangle) : NormalVector {
        if (!(triangle instanceof Triangle)) throw Error ("triange is not an instance of Triangle")
        let centerOfTriangle = triangle.computeCentroid(this.#vertices);
        let normalVector = triangle.computeNormal(this.#vertices)
        return new NormalVector(centerOfTriangle,normalVector);
    }
    calculateTriangleNormalVectors() : NormalVector[]{
        let field = this.#vertices; 
        let normalVectors = []; 
        for (const triangle of this.#triangles) {
            normalVectors.push(this.calculateTriangleNormalVector(triangle));
        }
        return normalVectors;
    }
    
    copy(){
        
        let newTriangles = [];
        for (const triangle of this.#triangles) {
            newTriangles.push (triangle.copy());
        }
        

        return new Mesh(this.#vertices.copy(),newTriangles);
    }

    numPoints() : number{
        return this.#vertices.numPoints();
    }
    numTriangles() : number {
        return this.#triangles.length;
    }
    getVertex(index : number) : Vector{
        if (!Number.isSafeInteger(index)) throw Error ("index is not a safe integer")
        return this.#vertices.getVertex(index);
    }
    getTriangle(index : number) : Triangle {
        if (!Number.isSafeInteger(index)) throw Error ("index is not a safe integer")
        return this.#triangles[index];
    }
    set vertices(vertices : Field) {
        if (!(vertices instanceof Field)) throw Error("vertices must be an instance of Field");
        this.#vertices = vertices;
    }
    set triangles (triangles : Triangle[]) {
        if (!(Array.isArray(triangles))) throw Error("triangles is not an array");
        // also need to check that each element in triangle is an instance of triangle
        this.#triangles = triangles;
    }
}