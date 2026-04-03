import {Vector} from "../../core/math/Vector"
import { Field } from "../../core/field/Field";
import { Mesh } from "../geometry/Mesh";
import { PhysicsBody } from "../physics/PhysicsBody";
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
        
        this.#fovAngle = fovAngle;
        this.#focalDistance = focalDistance;
        this.#aspectRatio = aspectRatio;
        this.#viewVector = Vector.ZERO;
        this.#right = Vector.ZERO;
        this.#up=Vector.ZERO;
        this.rebuildBasis(viewVector);
    }
    private rebuildBasis(viewVector : Vector){
        this.#viewVector = Vector.unitVector(viewVector);

        let up = new Vector(0,1,0);

        // handle singularity
        if (this.#viewVector.equals(Vector.upVector()) ||
            this.#viewVector.equals(Vector.downVector())) {
            up = new Vector(1,0,0);
        }

        this.#right = Vector.unitVector(Vector.crossProduct(this.#viewVector, up));
        this.#up = Vector.unitVector(Vector.crossProduct(this.#viewVector, this.#right));
    }
    get focalDistance() {
        return this.#focalDistance;
    }
    get position() {
        return this.#physicsBody.position;
    }
    set position(position : Vector){
        if (!(position instanceof Vector)) throw Error("position is not an instance of Vector");
        this.#physicsBody.position = position;
    }
    set viewVector (v : Vector) {
        this.rebuildBasis(v);
        
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
        if (!(point instanceof Vector)) throw Error("point is not an instance of Vector");
        this.viewVector = Vector.unitVector(Vector.sub(point,this.#physicsBody.position));
        
    }
    pointInDirection(direction : Vector) : void{
        if (!(direction instanceof Vector)) throw Error("direction is not an instance of Vector");
        this.viewVector = Vector.unitVector(direction);
        
    }
    
}