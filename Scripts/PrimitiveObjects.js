class PrimitiveObject {
    
    static cube(sideLength,centeredAt) {
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
        let fieldOfPoints = Field.generateFieldFromMatrixOfPoints(pointsMatrix)

        for (let i =0 ; i< fieldOfPoints.array.length;i++) {
            fieldOfPoints.array[i] = Vector.add(fieldOfPoints.array[i],centeredAt);
        }

        return Mesh.generateConvexMesh(fieldOfPoints,8);
    }
}