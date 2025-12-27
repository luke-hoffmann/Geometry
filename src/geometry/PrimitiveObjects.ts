import { Field } from "./Field.js";
import { Vector } from "./Vector.js";
import { MeshGenerator } from "./MeshGenerator.js";
import type { Mesh } from "./Mesh.js";
export class PrimitiveObject {
    
    static cube(sideLength : number,centeredAt : Vector)  : Mesh{
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
        let fieldOfPoints = this.generateFieldFromMatrixOfPoints(pointsMatrix);

        fieldOfPoints = fieldOfPoints.moveEntireField(centeredAt);

        return MeshGenerator.generateConvexMesh(fieldOfPoints,8);
    }


    private static generateFieldFromMatrixOfPoints(matrix : number[][]) : Field{
        let newField = []
        for (const row of matrix) {
            newField.push(new Vector(row[0],row[1],row[2]));
        }   
        return new Field(newField);
    }
}