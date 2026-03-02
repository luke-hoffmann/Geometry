
import { Vector } from "../../core/math/Vector";
import { Field } from "../../core/field/Field";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "../../core/math/NormalVector.js";

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
        
        
        let newTriangles = this.copyTriangles();

        return new Mesh(this.#vertices.copy(),newTriangles);
    }
    private copyTriangles() {
        let newTriangles = [];
        for (const triangle of this.#triangles) {
            newTriangles.push (triangle.copy());
        }
        return newTriangles;
    }
    get vertices() {
        return this.#vertices.copy();
    }
    get triangles() {
        return this.copyTriangles();
    }
    get numPoints() : number{
        return this.#vertices.numPoints;
    }
    get numTriangles() : number {
        return this.#triangles.length;
    }
    get triangleCentroids() : Vector[] {
        let centroids = [];
        for (let i =0 ; i < this.#triangles.length; i++) {
            const triangle = this.#triangles[i];
            centroids.push(triangle.computeCentroid(this.vertices));
        }
        return centroids;
    }
    get triangleNormalVectors() : Vector[] {
        let normalVectors = [];
        for (let i =0 ; i < this.#triangles.length; i++) {
            const triangle = this.#triangles[i];
            normalVectors.push(triangle.computeNormal(this.vertices));
        }
        return normalVectors;
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

    private static twoPointsMapString(num1 : number, num2 : number) {
        let n1 = num1;
        let n2 = num2;
        if (num1 > num2) {
            n1 = num2;
            n2 = num1;
        }
        return n1 + ":" + n2;
    }
    static subdivideMeshTriangles(mesh : Mesh) : Mesh {
        let lineToMidpointMap = new Map<string,number>;
        let newTriangles = [];
        let newPoints = mesh.vertices;
        for (let i=0; i < mesh.numTriangles; i++) {
            const triangle = mesh.getTriangle(i);
            let references = triangle.verticeReferences;
            let midPointReferences : number[]= Array<number>(3); 
            for (let i =0 ; i< references.length;i++) {
                let next_index = i+1;
                if (next_index ==3) {
                    next_index = 0;
                }
                
                let keyString = Mesh.twoPointsMapString(references[i],references[next_index]);
                let midPointRef : number | undefined = lineToMidpointMap.get(keyString);
                if (midPointRef!= undefined) {
                    midPointReferences.push(midPointRef); 
                    continue;
                }
                let p1 = mesh.getVertex(references[i]);
                let p2 = mesh.getVertex(references[next_index]);
                let midPoint = Vector.lerpVector(p1,p2,0.5);
                newPoints.addVertexInPlace(midPoint);
                midPointReferences[i]= newPoints.numPoints-1;

            }
            const a = references[0];
            const b = references[1];
            const c = references[2];
            const x = midPointReferences[0];
            const y = midPointReferences[1];
            const z = midPointReferences[2];
            // some pattern exists below, could be optimized off of this.
            newTriangles.push(new Triangle([a,x,z]));
            newTriangles.push(new Triangle([x,b,y]));
            newTriangles.push(new Triangle([z,y,c]));
            newTriangles.push(new Triangle([y,z,x]));
            // some pattern exists above, could be optimized off of this.
        }   
        return new Mesh(newPoints,newTriangles);
    }

    
}