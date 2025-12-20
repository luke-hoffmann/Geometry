import {Vector} from "../geometry/Vector.js"
import { Field } from "../geometry/Field.js";
import { Mesh } from "../geometry/Mesh.js";
import { PhysicsBody } from "../geometry/PhysicsBody.js";
export class Camera {
    #physicsBody : PhysicsBody;
    #viewVector : Vector;
    #fovAngle : number;
    #focalDistance :number;
    #aspectRatio : number;
    #up : Vector;
    #right : Vector;
    constructor(physicsBody : PhysicsBody,viewVector : Vector,fovAngle : number ,focalDistance : number,aspectRatio : number) {
        this.#physicsBody = physicsBody;
        this.#viewVector = Vector.unitVector(viewVector);
        this.#fovAngle = fovAngle;
        this.#focalDistance = focalDistance;
        this.#aspectRatio = aspectRatio;
        //this.projectionPlane = ProjectionPlane.generateProjectionPlaneFromCamera(this,fovAngle,focalDistance,aspectRatio);
        this.#up = new Vector(0,1,0);
        this.#right = Vector.unitVector(Vector.crossProduct(this.#up,viewVector));
    }
    get focalDistance() {
        return this.#focalDistance;
    }
    setPosition(position : Vector){
        if (!(position instanceof Vector)) throw Error("position is not an instance of Vector");
        this.#physicsBody.position = position;
    }
    putCameraAtCenterOfMeshCoordinateSystem(mesh : Mesh) : Mesh{
        let newMesh = mesh.copy();
        newMesh = this.shiftMeshIntoCameraSpace(newMesh);
        newMesh = this.projectMeshOntoCameraAxis(newMesh);
        return newMesh;
    }
    shiftMeshIntoCameraSpace(mesh : Mesh) : Mesh {
        let newPoints = [];
        let newMesh = mesh.copy();
        for (let i =0; i < mesh.numPoints; i++) {
            newPoints.push(Vector.sub(mesh.getVertex(i),this.#physicsBody.position));
        }
        newMesh.vertices = new Field(newPoints);
        return newMesh;
    }
    projectMeshOntoCameraAxis(mesh : Mesh) : Mesh{
        let newPoints = [];
        let newMesh = mesh.copy();
        for (let i =0; i < mesh.numPoints; i++) {
            let item = mesh.getVertex(i);
            let x = Vector.dotProduct(item,this.#right);
            let y = Vector.dotProduct(item,this.#up);
            let z = Vector.dotProduct(item,this.#viewVector);
            newPoints.push(new Vector(x,y,z));
        }
        newMesh.vertices = new Field(newPoints);
        return newMesh;
    }
    rejectNegativeZValuesList(field : Field) : boolean[]{
        let list = [];
        for (let i =0 ; i < field.numPoints; i++) {
            list.push(this.isVertexVisible(field.getVertex(i)));
        }
        return list;
    }
    isVertexVisible(vertex: Vector) :boolean{
        if (vertex.z <0) return false;
        return true;
    }
    copy() : Camera{
        return new Camera(
            this.#physicsBody.copy(),        // or whatever your Vector clone is
            this.#viewVector.copy(),
            this.#fovAngle,
            this.#focalDistance,
            this.#aspectRatio
        );
    }
    pointAtPoint(point : Vector) : void{
        if (!(point instanceof Vector)) throw Error("point is not an instance of Vector")
        this.#viewVector = Vector.unitVector(Vector.sub(point,this.#physicsBody.position));
    }
    log(){
        console.log("start camer log")
        console.log(this.#physicsBody.position);
        console.log(this.#viewVector);
        console.log("end camera log");
    }
}