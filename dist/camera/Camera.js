import { Vector } from "../geometry/Vector.js";
import { ProjectionPlane } from "./ProjectionPlane.js";
import { Field } from "../geometry/Field.js";
import { Mesh } from "../geometry/Mesh.js";
export class Camera {
    constructor(physicsBody, viewVector, fovAngle, focalDistance, aspectRatio) {
        this.physicsBody = physicsBody;
        this.viewVector = Vector.unitVector(viewVector);
        this.fovAngle = fovAngle;
        this.focalDistance = focalDistance;
        this.aspectRatio = aspectRatio;
        //this.projectionPlane = ProjectionPlane.generateProjectionPlaneFromCamera(this,fovAngle,focalDistance,aspectRatio);
        this.up = new Vector(0, 1, 0);
        this.right = Vector.unitVector(Vector.crossProduct(this.up, viewVector));
    }
    putCameraAtCenterOfMeshCoordinateSystem(mesh) {
        let newMesh = Mesh.copy(mesh);
        newMesh.vertices = this.shiftFieldIntoCameraSpace(newMesh.vertices);
        newMesh.vertices = this.projectFieldOntoCameraAxis(newMesh.vertices);
        return newMesh;
    }
    shiftFieldIntoCameraSpace(field) {
        let newField = new Field([]);
        for (let item of field.array) {
            newField.array.push(Vector.sub(item, this.physicsBody.position));
        }
        return newField;
    }
    projectFieldOntoCameraAxis(field) {
        let newField = new Field([]);
        for (let item of field.array) {
            let x = Vector.dotProduct(item, this.right);
            let y = Vector.dotProduct(item, this.up);
            let z = Vector.dotProduct(item, this.viewVector);
            newField.array.push(new Vector(x, y, z));
        }
        return newField;
    }
    rejectNegativeZValuesList(field) {
        let list = [];
        for (let item of field.array) {
            list.push(this.isVertexVisible(item));
        }
        return list;
    }
    isVertexVisible(vertex) {
        if (vertex.z < 0)
            return false;
        return true;
    }
    copy() {
        return new Camera(this.physicsBody.copy(), // or whatever your Vector clone is
        this.viewVector.copy(), this.fovAngle, this.focalDistance, this.aspectRatio);
    }
    pointAtPoint(point) {
        this.viewVector = Vector.unitVector(Vector.sub(point, this.physicsBody.position));
    }
}
//# sourceMappingURL=Camera.js.map