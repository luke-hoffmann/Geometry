import { Entity } from "../geometry/Entity.js";
import { Light } from "../geometry/Light.js";

export class Scene {
    #entities : Entity[];
    #lights : Light[];
    constructor (entities : Entity[], lights : Light[]){
        this.#entities = entities;
        this.#lights = lights;
    }
    getLight(i : number) : Light {
        return this.#lights[i];
    }
    getEntity(i : number) : Entity {
        return this.#entities[i];
    }
    copy() : Scene{
        return new Scene(
        this.#entities.map(e => e.copy()),
        this.#lights.map(l => l.copy())
        );
    }
    get numEntities() : number{
        return this.#entities.length;
    }
    get numLights() : number {
        return this.#lights.length;
    }

    set meshes (meshes : Entity[]) {
        if (!Array.isArray(meshes)) throw Error ("meshes is not an array");
        this.meshes = meshes;
    }
}