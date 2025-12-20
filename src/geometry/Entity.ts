import { Mesh } from "./Mesh.js";
import { PhysicsBody } from "./PhysicsBody.js";
import { Vector } from "./Vector.js";
import { Field } from "./Field.js";
export class Entity {
    #mesh : Mesh;
    #pB : PhysicsBody;
    constructor (mesh : Mesh, physicsBody : PhysicsBody) {
        this.#mesh = mesh;
        this.#pB = physicsBody; 
    }

    copy () {
        return new Entity(this.#mesh.copy(),this.#pB.copy());
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