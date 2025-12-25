
import { Vector } from "./Vector.js";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "./NormalVector.js";
import { ColorHandler } from "colorhandler";
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
    
    
    calculateAverageZ(){
        let averageZ = 0;
        for (let i =0; i < this.#vertices.numPoints;i++) {
            averageZ += this.#vertices.getVertex(i).z;
        }
        return averageZ/this.#vertices.numPoints;
    }
    
    calculateTrianglesNormalVectors() : NormalVector[]{
        let normalVectors = []; 
        for (const triangle of this.#triangles) {
            normalVectors.push(triangle.calculateTriangleNormalVector(this.#vertices));
        }
        return normalVectors;
    }
    
    mapTrianglesToAnyObject<T>(objects: T[]): Map<string, T> {
        if (this.numTriangles !== objects.length) {
            throw new Error("number of triangles does not equal number of objects");
        }

        const map = new Map<string, T>();
        for (let i = 0; i < this.numTriangles; i++) {
            map.set(this.getTriangle(i).getDistinctIdentifier(), objects[i]);
        }
        return map;
    }
    
    
    findAnyObjectFromMap<T>(map: Map<string, T>): T[] {
        const result: T[] = [];
        for (let i = 0; i < this.numTriangles; i++) {
            const id = this.getTriangle(i).getDistinctIdentifier();
            const value = map.get(id);
            if (value !== undefined) {
                result.push(value);
            }
        }
    
        return result;
    }

    

    copy(){
        
        let newTriangles = [];
        for (const triangle of this.#triangles) {
            newTriangles.push (triangle.copy());
        }
        

        return new Mesh(this.#vertices.copy(),newTriangles);
    }
    get vertices() {
        return this.#vertices.copy();
    }
    get numPoints() : number{
        return this.#vertices.numPoints;
    }
    get numTriangles() : number {
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