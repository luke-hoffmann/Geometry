import { Mesh } from "../geometry/Mesh";
import { PhysicsBody } from "../physics/PhysicsBody";
import { Vector } from "../../core/math/Vector";
import { Field } from "../../core/field/Field";
import { ColorHandler } from "colorhandler";
import { MeshGenerator } from "../geometry/generation/MeshGenerator";
export class Entity {
    #mesh : Mesh;
    #pB : PhysicsBody;
    #triangleColors : ColorHandler[];
    // #colorMap : Map<string,ColorHandler>;
    #isIndifferentToLight : boolean;
    constructor (mesh : Mesh, physicsBody : PhysicsBody,triangleColors : ColorHandler[], isIndifferentToLight : boolean) {
        this.#mesh = mesh;
        this.#pB = physicsBody; 
        this.#triangleColors = triangleColors;
        // this.#colorMap = mesh.mapTrianglesToAnyObject(triangleColors);
        this.#isIndifferentToLight = isIndifferentToLight;
    }
    static randomConvexEntityWithColors(radius : number, n : number, physicsBody : PhysicsBody, c1 : ColorHandler, c2 :ColorHandler, isIndifferentToLight : boolean) : Entity {
        let mesh = MeshGenerator.generateRandomConvexMesh(radius,n);
        let colors = ColorHandler.randomColorsBetween(mesh.numTriangles,c1,c2);
        return new this(mesh,physicsBody,colors,isIndifferentToLight);
    }
    copy () : Entity{
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return new Entity(this.#mesh.copy(),this.#pB.copy(),newColors, this.#isIndifferentToLight);
    }
    get triangleColors () : ColorHandler[]{
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return newColors;
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
    get physicsBody () {
        return this.#pB.copy();
    }
    get mesh() : Mesh {
        return this.#mesh.copy()
    }
    get isIndifferentToLight() {
        return this.#isIndifferentToLight;
    }
}