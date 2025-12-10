import { Triangle } from "../geometry/Triangle.js";
import { Field } from "../geometry/Field.js";
import { Vector } from "../geometry/Vector.js";
export class ProjectionPlane {
    constructor(topLeft,bottomLeft,topRight,bottomRight) {
        this.tL = topLeft;
        this.bL = bottomLeft;
        this.tR = topRight;
        this.bR = bottomRight;
    }

    static generateProjectionPlaneFromCamera(camera,fovAngle,focalDistance,aspectRatio){
        // aspect ratio is a number that is equivalent to height/width of the Projection Box/Plane
        let pointsOfProjectionPlane = new Field([])
        let centerPointOfPlane = Vector.add(Vector.scalarMult(camera.viewVector,focalDistance),camera.position);
        let verticalUnitVector = Vector.upVector();
        let lateralUnitVector = Vector.unitVector(Vector.crossProduct(camera.viewVector, verticalUnitVector));
        let lateralVector = Vector.scalarMult(lateralUnitVector,focalDistance/Math.tan(90-(fovAngle/2)));
        let verticalVector = Vector.scalarMult(verticalUnitVector, lateralVector.magnitude() * aspectRatio);
        let left = Vector.add(centerPointOfPlane,lateralVector); 
        let right = Vector.sub(centerPointOfPlane,lateralVector);
        return new this(Vector.add(left,verticalVector),Vector.sub(left,verticalVector),Vector.add(right,verticalVector),Vector.sub(right,verticalVector));
        
    }
    projectPointOntoPlane(){}
    projectFieldOntoPlane(field){
        
    }
}