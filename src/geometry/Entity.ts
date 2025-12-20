import { Mesh } from "./Mesh";
import { PhysicsBody } from "./PhysicsBody";

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
}