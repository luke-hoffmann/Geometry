export class RenderParameters {
    #doBackFaceCulling : boolean;
    #doOutline : boolean;
    #doFill : boolean;
    #doVertices : boolean;
    #doNormalVectors : boolean;
    #doShadingWithLighting : boolean;
    #lineWidth : number;
    #pointRadius : number;
    #isPerspective : boolean;
    constructor(doBackFaceCulling : boolean, doOutline : boolean, doFill : boolean, doVertices : boolean, doNormalVectors : boolean, doShadingWithLighting : boolean, lineWidth : number, pointRadius : number, isPerspective : boolean) {
            this.#doBackFaceCulling = doBackFaceCulling;
            this.#doOutline = doOutline;
            this.#doFill = doFill;
            this.#doVertices = doVertices;
            this.#doNormalVectors = doNormalVectors;
            this.#doShadingWithLighting = doShadingWithLighting;
            this.#lineWidth = lineWidth;
            this.#pointRadius = pointRadius;
            this.#isPerspective = isPerspective;


    }
    get doBackFaceCulling () {return this.#doBackFaceCulling;}
    get doOutline () {return this.#doOutline;}
    get doFill () {return this.#doFill;}
    get doVertices () {return this.#doVertices;}
    get doNormalVectors () {return this.#doNormalVectors;}
    get doShadingWithLighting () {return this.#doShadingWithLighting;}
    get lineWidth () {return this.#lineWidth;}
    get pointRadius () {return this.#pointRadius;}
    get isPerspective () {return this.#isPerspective;}
}