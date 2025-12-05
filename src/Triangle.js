import { Vector } from "./Vector.js";
import { ColorHandler } from "../Color-Handler/src/ColorHandler.js";
import { UsefulFunction } from "../Useful-Function/src/UsefulFunction.js";
export class Triangle {
    constructor (verticeReferences,color) {

        this.verticeReferences = verticeReferences;
        this.color = ColorHandler.randomColorAtWithGeneralRadius(210,60,140,40);
        if (color ==undefined) return;
        this.color = color.copy();
    }
    
    static doesUpspaceContain(field,triangle,point){

        let vertices = field.array;
        let PA = Vector.sub(vertices[point],vertices[triangle.verticeReferences[0]]);
        let normal = this.computeNormal(field,triangle);
        let dotProduct = Vector.dotProduct(PA,normal);
        const epsilon = 1e-5;
        if (Math.abs(dotProduct)< epsilon) return false;
        if (dotProduct < 0) return false;
        return true;
    }
    static computeCentroid(field,triangle){
        let vertices = field.array;
        let p1 = vertices[triangle.verticeReferences[0]];
        let p2 = vertices[triangle.verticeReferences[1]];
        let p3 = vertices[triangle.verticeReferences[2]];
        let p4 = Vector.lerpVector(p1,p2,0.5);
        // centroid is 0.33 from the line, .66 from the point
        return Vector.lerpVector(p4,p3,0.33333);
        
    
    }
    static isTriangleFacingCamera(field,triangle,viewVector) {
        let dotProduct = this.getDotProductBetweenNormalAndVector(field,triangle,viewVector);
        return (dotProduct <= 0);
    }

    static getColorOfTriangle(field,triangle,lights){
        let light,lightingVector,observedColor;
        let centerOfTriangle = this.computeCentroid(field,triangle);
        let colorArray = [];
        let angleBrightness;
        for (let i =0; i < lights.length;i++) {
            light = lights[i];
            lightingVector = Vector.sub(centerOfTriangle,light.position);
            lightingVector = Vector.normalize(lightingVector);
            angleBrightness = this.getDotProductBetweenNormalAndVector(field,triangle,lightingVector);
            observedColor = Light.calculateObservedColor(light,triangle.color);
            observedColor.multiplyByNumber(angleBrightness);
            colorArray.push(observedColor);
        }
        return ColorHandler.sumAndClamp(colorArray);
    }

    static getColorOfTriangles(field,triangles,lights) {
        let colors = [];
        for (const triangle of triangles) {
            colors.push(this.getColorOfTriangle(field,triangle,lights));
        }
        return colors;
    }

    static computeNormal(field,triangle){
        let vertices = field.array;
        let s1 = Vector.sub(vertices[triangle.verticeReferences[0]],vertices[triangle.verticeReferences[1]]);
        let s2 = Vector.sub(vertices[triangle.verticeReferences[2]],vertices[triangle.verticeReferences[0]]);
        let cross = Vector.crossProduct(s1,s2);
        return Vector.normalize(cross);
    }
    static distanceTo(field,triangle,v) {
        let normal = this.computeNormal(field,triangle);

        let reference = field.array[triangle.verticeReferences[0]]
        let d = -(normal.x * reference.x + normal.y * reference.y + normal.z * reference.z);
        return Math.abs(normal.x*v.x + normal.y*v.y + normal.z*v.z + d)/ (Math.sqrt((normal.x**2) + (normal.y**2) + (normal.z**2)));
    }

    static getFarthestPoint(field,triangle,pointIndices) {
        let farthestPoint = undefined;
        let farthestDistance = 0;
        for (const point of pointIndices) {
            let pointToFindDistanceTo =(field.array[point])
            let distance = this.distanceTo(field,triangle,pointToFindDistanceTo);
            if (distance > farthestDistance) {
                farthestDistance = distance;
                farthestPoint = point;
            }
        }
        if (farthestPoint == undefined) return false;
        return farthestPoint;
    }
    static getNextReferenceOfTriangle(triangle,currentIndex){
        nextIndex = currentIndex+1;
        if (nextIndex == 3) currentIndex = 0;
        
        return triangle.verticeReferences[nextIndex];
    }
    static getCounterClockwiseBoundaryPoints(field,triangles){
        let pointHash = new Map();
        for (triangle of triangles) {
            for (let i =0; i < triangle.verticeReferences.length; i++) {
                UsefulFunction.addToMap(pointHash,triangle.verticeReferences[i], this.getNextReferenceOfTriangle(triangle,i));
            }

        }
        
    }
    static getDotProductBetweenNormalAndVector(field,triangle,vector) {
        let triangleNormal = this.computeNormal(field,triangle);
        let dotProduct = Vector.dotProduct(triangleNormal,vector);
        return dotProduct;
    }

    


    static getTrianglesPointCount(triangles,pointCountMap,trianglePointsMap) {
        let trianglesPointCount = [];
        let count, referencedPoints;
        for (let i =0; i < triangles.length;i++) {
            referencedPoints = trianglePointsMap.get(i);
            count =0;
            for (const reference of referencedPoints) {
                count+=pointCountMap.get(reference);
            }
            trianglesPointCount.push(count);
        }
        return trianglesPointCount;
    }
    static populatePointCountMapAndTrianglePointsMap(triangles,pointCountMap,trianglePointsMap) {
        for (let i =0; i < triangles.length;i++) {
            trianglePointsMap.set(i,[]);
            for (const point of triangles[i].verticeReferences) {
                UsefulFunction.addToMap(trianglePointsMap,i,point);
                if (!pointCountMap.has(point)) pointCountMap.set(point,1);
                UsefulFunction.incrementMap(pointCountMap,point);
            }
        }
    }
    static doDuplicatesExist(triangles) {
        let pointCountMap = new Map();
        let trianglePointsMap = new Map();
        this.populatePointCountMapAndTrianglePointsMap(triangles,pointCountMap,trianglePointsMap);
        let trianglesPointCount = this.getTrianglesPointCount(triangles,pointCountMap,trianglePointsMap);
        return UsefulFunction.isThereValueGreaterThanN(trianglesPointCount,3);
        
    }
    static logTriangles(triangles){
        for (const triangle of triangles) {
            console.log(triangle.verticeReferences[0],triangle.verticeReferences[1],triangle.verticeReferences[2]);
        }
    }
    static getTimesTriangleIsReferencedByBoundaryPoints(triangles,boundaryPoints){
        let trianglePointerMap = new Map();
        let triangleCountMap = new Map();
        let triangleReferenceCountList = [];
        let triangle;
        for (let i =0; i < triangles.length;i++) {
            triangle = triangles[i];
            triangleCountMap.set(i,0);
            for (const vertice of triangle.verticeReferences) {
                UsefulFunction.addToMap(trianglePointerMap,vertice,i)
            }
        }
        for (const point of boundaryPoints) {
            if (!trianglePointerMap.has(point)) throw new Error ("A boundary point is not on a triangle");
            let incrementLocations = trianglePointerMap.get(point);
            for (const location of incrementLocations) {
                UsefulFunction.incrementMap(triangleCountMap,location);
            }
            
        }
        for (let i =0; i < triangles.length;i++) {
            triangleReferenceCountList.push(triangleCountMap.get(i));
        }
        return triangleReferenceCountList;

    }

    static findTrianglesToRemove(triangleReferenceCountList) {
        let removeList = [];
        // if a triangle is referenced 3 or more times then return true
        for (const referenceCount of triangleReferenceCountList) {
            if (referenceCount < 3) {removeList.push(false); continue;}
            removeList.push(true);

        }
        return removeList;
    }
    static flipNormal(triangle) {
        let references = [...triangle.verticeReferences];
        for (let i =0; i < references.length;i++) {
            references[i]= triangle.verticeReferences[triangle.verticeReferences.length-1-i];
        }
        return new this(references);
    }
    flipNormal(){
        let verticeReferences = [...this.verticeReferences];
        for (let i =0; i < this.verticeReferences.length;i++) {
            this.verticeReferences[i]= verticeReferences[verticeReferences.length-1-i];
        }
        return this;
    }
    static getIndicesOfTriangles(triangles) {
        let indices = [];
        for (const triangle of triangles) {
            for (const reference of triangle.verticeReferences) {
                indices.push(reference);
            }
        }
        return indices;
    }

    
    static addPointsFromTrianglesToMap(map,triangles){
        triangles= [...triangles]
        for (let i =0; i < triangles.length;i++) {
            let vertices = triangles[i].verticeReferences

            for (let j =0 ; j< vertices.length-1 ;j++) {
                UsefulFunction.addToMap(map,triangles[i].verticeReferences[j],triangles[i].verticeReferences[j+1]);
            }
            UsefulFunction.addToMap(map,triangles[i].verticeReferences[2],triangles[i].verticeReferences[0])
        }
    }
    
    static createPyramidFromBoundaryPoints(boundaryIndices,point){

        let newFaces = [];
        for(let i =0; i < boundaryIndices.length-1; i ++) {
            this.newFace = new this([point,boundaryIndices[i],boundaryIndices[i+1]]);
            newFaces.push(this.newFace);
        }
        
        this.newFace = new this([point,boundaryIndices[boundaryIndices.length-1],boundaryIndices[0]]);
        
        newFaces.push(this.newFace);
        return newFaces;
    }

    static getTrianglesFromIndices(triangles,indices){
        let outputTriangles = [];
        for (const index of indices) {
            outputTriangles.push(triangles[index]);
        }
        return outputTriangles;
    }



    static graphTriangleOutline(vertices,triangle,color,lineWeight) {
        let verticesThatMakeUpTriangle = triangle.verticeReferences;
        color.p5NoFill();
        color.p5Stroke();
        
        renderGraphic.strokeWeight(lineWeight);
        renderGraphic.strokeJoin(ROUND);
        renderGraphic.triangle(vertices[verticesThatMakeUpTriangle[0]].x,vertices[verticesThatMakeUpTriangle[0]].y,vertices[verticesThatMakeUpTriangle[1]].x,vertices[verticesThatMakeUpTriangle[1]].y,vertices[verticesThatMakeUpTriangle[2]].x,vertices[verticesThatMakeUpTriangle[2]].y);
    }
    static graphTriangleFill(vertices,triangle,color) {
        
        let verticesThatMakeUpTriangle = triangle.verticeReferences;
        color.p5Fill();
        color.p5NoStroke();
        renderGraphic.triangle(vertices[verticesThatMakeUpTriangle[0]].x,vertices[verticesThatMakeUpTriangle[0]].y,vertices[verticesThatMakeUpTriangle[1]].x,vertices[verticesThatMakeUpTriangle[1]].y,vertices[verticesThatMakeUpTriangle[2]].x,vertices[verticesThatMakeUpTriangle[2]].y);
        
        
    }
}