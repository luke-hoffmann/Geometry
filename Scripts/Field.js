class Field {
    constructor(array) {
        
        this.array = array;
        if(array == undefined) {
            this.array = [];
        }
    }
    static generateFieldFromMatrixOfPoints(matrix){
        let newField = new Field([]);
        for (const row of matrix) {
            newField.array.push(new Vector(row));
        }   
        return newField;
    }
    static generateRandomFieldInSphere(radius,n){
        let newField = new Field([]);
        for (let i =0; i < n; i++) {
            newField.array.push(Vector.generateVectorInSphere(radius));
        }
        return newField;
    }
    static getTriangleUpspace(field,triangle,indices){
        let indicesAbovePlane = []
        for (const point of indices) {
            // need to replace to instead see if the point lies on the plane or not.
            if (point == triangle[0] || point == triangle[1] || point ==triangle[2] ) continue;

            if (!Triangle.doesUpspaceContain(field,triangle,point)) continue;
            indicesAbovePlane.push(point)

        }
        return  indicesAbovePlane;
    }

    static getTrianglesWithPointInUpspace(field,triangles,point){
        let trianglesContainingIndices = [];
        let triangle;
        for (let i =0; i < triangles.length;i++) {
            triangle = triangles[i]
            if (!Triangle.doesUpspaceContain(field,triangle,point)) continue;
            trianglesContainingIndices.push(i);
        }
        return trianglesContainingIndices;
    }


    static getTrianglesUpspace(field,triangles,indices) {
        
        let upspace= [];
        for (const triangle of triangles) {
            upspace.push(this.getTriangleUpspace(field,triangle,indices));
        }

        upspace = UsefulFunction.combineArrays(upspace);
        return UsefulFunction.noDuplicates(upspace);
    }
    
    static getPointsAtIndices(field,indices) {
        let points = [];
        for (const index of indices) {
            points.push(field.array[index]);
        }
        return points;
    }    


    static getAverageDistanceBetweenPointsAndTriangles(field,triangles,pointIndices) {
        let distanceAveragesToAllTriangles = [];
        for (point of pointIndices) {
            if (point == false) {
                distanceAveragesToAllTriangles.push(0);
                continue;
            }
            let sum = 0;
            for (triangle of triangles) {
                sum += Triangle.distanceTo(field,triangle,field.array[point]);
            }
            let average = sum/triangles.length;
            distanceAveragesToAllTriangles.push(average);
        }
        return distanceAveragesToAllTriangles;
    }

    static getFarthestPointsFromTriangles(field,triangles,pointIndices){
        
        let farthestPoints = [];
        let farthestPoint;
        for (triangle of triangles) {
            
            farthestPoints.push(Triangle.getFarthestPoint(field,triangle,pointIndices));
        }
        return farthestPoints;
    }

    // bad one
    static getFarthestPointFromTriangles(field, triangles, pointIndices){
        let farthestPoints = this.getFarthestPointsFromTriangles(field,triangles,pointIndices);
        let distanceAveragesToAllTriangles = this.getAverageDistanceBetweenPointsAndTriangles(field,triangles,farthestPoints);
        
        let indexOfPoint = UsefulFunction.getIndexOfArrayMax(distanceAveragesToAllTriangles);
        if (indexOfPoint == undefined) return false;
        return farthestPoints[indexOfPoint];
    }



    static getFarthestVectorFromVector(index,field){
        let greatestDistance = 0;
        let farthestDistancePoint = undefined
        let farthestDistancePointIndex = undefined
        let v = field.array[index];
        for (let i =0; i< field.array.length; i++){

            let dist = Vector.distanceBetweenVectors(field.array[i],v);
            if (dist > greatestDistance){
                greatestDistance = dist;
                farthestDistancePoint = field.array[i]
                farthestDistancePointIndex = i;
            }
        }
        return farthestDistancePointIndex;
    }

    static calculateLargestTriangleFromField(field) {
        
        let point1Index = Field.lowestVectorInField(field)

        let point2Index = Field.getFarthestVectorFromVector(point1Index,field);
        let line = new Line(field.array[point1Index],field.array[point2Index]);
        let point3Index = Line.calculateFarthestPoint(field,line);
        let triangle = new Triangle([point1Index,point2Index,point3Index]);
        return triangle;

    }
    /**
     * Lowest point based upon x value of vector points
     * @param {*} field 
     * @returns {Vector} point
     */
    static lowestVectorInField(field){
        if (field.array.length == 0) return undefined;
        let lowestCoordinate = field.array[0];
        let indexOfLowestCoordinate = 0;
        for (let i =0; i < field.array.length; i++) {
            if(lowestCoordinate.x > field.array[i].x) {
                lowestCoordinate = field.array[i];
                indexOfLowestCoordinate = i;
                i = 0;
            }
        }
        return indexOfLowestCoordinate
    }

    static graph(field,diameter,color) {
        for (const point of field.array) {
            point.graph(diameter,color);
        }
    }


    
}