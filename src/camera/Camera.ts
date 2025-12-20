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
        this.#right = Vector.unitVector(Vector.crossProduct(viewVector,this.#up));
    }
    get focalDistance() {
        return this.#focalDistance;
    }
    setPosition(position : Vector){
        if (!(position instanceof Vector)) throw Error("position is not an instance of Vector");
        this.#physicsBody.position = position;
    }

    get position() {
        return this.#physicsBody.position;
    }
    putCameraAtCenterOfMeshCoordinateSystem(mesh : Mesh) : Mesh{
        let newMesh = mesh.copy();
        let fieldArray = [];
        for (let i =0 ; i< mesh.numPoints; i++) {
            let p = mesh.getVertex(i);
            p = this.putCameraAtCenterOfPointCoordinateSystem(p);
            fieldArray.push(p);
        }
        newMesh.vertices = new Field(fieldArray);
        return newMesh;
    }
    putCameraAtCenterOfPointCoordinateSystem(point : Vector) : Vector {
        point = this.shiftWorldPointIntoCameraSpace(point);
        point = this.projectWorldPointOntoCameraAxis(point);
        return point;
    }
    private shiftWorldPointIntoCameraSpace(point : Vector) : Vector {
        return Vector.sub(point,this.#physicsBody.position);
    }
    private projectWorldPointOntoCameraAxis(point : Vector) : Vector{
        
        
        let x = Vector.dotProduct(point,this.#right);
        let y = Vector.dotProduct(point,this.#up);
        let z = Vector.dotProduct(point,this.#viewVector);
        
        return new Vector(x,y,z);
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
    set viewVector (v : Vector) {
        this.#viewVector = v;
        this.#up = new Vector(0,1,0);
        this.#right = Vector.unitVector(Vector.crossProduct(v,this.#up));
        this.#up = Vector.unitVector(Vector.crossProduct(v, this.#right));
    }
    pointAtPoint(point : Vector) : void{
        if (!(point instanceof Vector)) throw Error("point is not an instance of Vector");
        this.viewVector = Vector.unitVector(Vector.sub(point,this.#physicsBody.position));
    }
    log(){
        console.log("start camera log")
        console.log(this.#physicsBody.position);
        console.log(this.#viewVector);
        console.log("end camera log");
    }
}