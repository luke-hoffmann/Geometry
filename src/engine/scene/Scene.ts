import type { Vector } from "../../core/math/Vector.js";
import { Entity } from "./Entity.js";
import { Light } from "../lighting/Light.js";

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
    setLightPos(pos :Vector, i :number) : void {
        if (!Light.hasPosition(this.#lights[i])) return;
        this.#lights[i].position = pos;
    }
    set meshes (meshes : Entity[]) {
        if (!Array.isArray(meshes)) throw Error ("meshes is not an array");
        this.meshes = meshes;
    }
}