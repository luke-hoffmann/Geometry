import { Field } from "./Field.js";
import { Vector } from "./Vector.js";
import { MeshGenerator } from "./MeshGenerator.js";
export class PrimitiveObject {
    static cube(sideLength, centeredAt) {
        if (centeredAt == undefined) {
            centeredAt = Vector.zero();
        }
        let pointsMatrix = [
            [-sideLength / 2, -sideLength / 2, -sideLength / 2],
            [-sideLength / 2, -sideLength / 2, sideLength / 2],
            [sideLength / 2, -sideLength / 2, -sideLength / 2],
            [sideLength / 2, sideLength / 2, -sideLength / 2],
            [sideLength / 2, -sideLength / 2, sideLength / 2],
            [-sideLength / 2, sideLength / 2, sideLength / 2],
            [-sideLength / 2, sideLength / 2, -sideLength / 2],
            [sideLength / 2, sideLength / 2, sideLength / 2]
        ];
        let fieldOfPoints = Field.generateFieldFromMatrixOfPoints(pointsMatrix);
        fieldOfPoints = fieldOfPoints.moveEntireField(centeredAt);
        return MeshGenerator.generateConvexMesh(fieldOfPoints, 8);
    }
}
