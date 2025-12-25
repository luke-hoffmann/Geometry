import { Mesh } from "./Mesh.js";
import { PhysicsBody } from "./PhysicsBody.js";
import { Vector } from "./Vector.js";
import { Field } from "./Field.js";
import { ColorHandler } from "colorhandler";
import { MeshGenerator } from "./MeshGenerator.js";
export class Entity {
    #mesh : Mesh;
    #pB : PhysicsBody;
    #triangleColors : ColorHandler[];
    #colorMap : Map<string,ColorHandler>;
    constructor (mesh : Mesh, physicsBody : PhysicsBody,triangleColors : ColorHandler[]) {
        this.#mesh = mesh;
        this.#pB = physicsBody; 
        this.#triangleColors = triangleColors;
        this.#colorMap = mesh.mapTrianglesToAnyObject(triangleColors);
    }
    static randomConvexEntityWithColors(radius : number, n : number, physicsBody : PhysicsBody, c1 : ColorHandler, c2 :ColorHandler) : Entity {
        let mesh = MeshGenerator.generateRandomConvexMesh(radius,n);
        let colors = ColorHandler.randomColorsBetween(mesh.numTriangles,c1,c2);
        return new Entity(mesh,physicsBody,colors);
    }
    copy () {
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return new Entity(this.#mesh.copy(),this.#pB.copy(),newColors);
    }
    getTriangleColor(i : number) : ColorHandler{
        return this.#triangleColors[i];
    }
    
    // findColorHandlerFromMap (distinctIdentifier : string) : ColorHandler {
    //     if (!this.#colorMap.has(distinctIdentifier)) throw Error("distinct identifier does not exist as a key in map")
    //     const value = this.#colorMap.get(distinctIdentifier);
    //     if (value == undefined) throw Error("Value is not defined");
    //     return value;
    // }
    get triangleColors () : ColorHandler[]{
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return newColors;
    }
    get mesh() : Mesh{
        return this.#mesh;
    }
    get physicsBody() : PhysicsBody{
        return this.#pB;
    }
    get worldSpaceMesh() : Mesh{
        let newMesh = this.#mesh.copy();
        let array = [];
        for (let i=0; i < newMesh.numPoints; i++) {
            array.push(Vector.add(newMesh.getVertex(i),this.#pB.position));
        }
        let field = new Field(array);
        newMesh.vertices = field;
        return newMesh;
    }
}