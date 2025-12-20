import { ColorHandler } from "colorhandler";

export class MeshMaterial {
    #materials : ColorHandler[];
    constructor (materials : ColorHandler[]) {
        this.#materials = materials;
    }
}