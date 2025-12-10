import { UsefulFunction } from "../../dep/Useful-Function/src/UsefulFunction.js";
import { Vector } from "./Vector.js";
import { Line } from "./Line.js";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { NormalVector } from "./NormalVector.js";
export class Mesh {
    constructor (vertices,triangles,) {
        
        this.vertices = vertices;
        this.triangles = triangles;
        if (vertices ==undefined) {
            this.vertices = [];
        }
        if (triangles ==undefined) {
            this.triangles = [];
        }
    }
    
    
    /*
    static removeTrianglesThatAreCoveredUp(field,triangles,boundaryPoints,farthestPoint,searchForDuplicateTriangles){
        
        let triangleReferenceCountList = Triangle.getTimesTriangleIsReferencedByBoundaryPoints(triangles,boundaryPoints);
        let trianglesToRemove = Triangle.findTrianglesToRemove(triangleReferenceCountList);
        let temporaryTriangleList = [...triangles];
        for (let i =0; i < trianglesToRemove.length;i++) {
            if (!trianglesToRemove[i]) continue;
            
            if (!Triangle.doesUpspaceContain(field,triangles[i],farthestPoint)) continue;

            if (searchForDuplicateTriangles) console.log("Removing triangle:",i);
            temporaryTriangleList.splice(i,1);
        }

        return temporaryTriangleList;
    }
        */
    static calculateTriangleNormalVector(mesh,triangle) {
        let field = mesh.vertices;
        let centerOfTriangle = Triangle.computeCentroid(field,triangle);
        let normalVector = Triangle.computeNormal(field,triangle)
        return new NormalVector(centerOfTriangle,normalVector);
    }
    static calculateTriangleNormalVectors(mesh){
        let triangles = mesh.triangles;
        let field = mesh.vertices; 
        let normalVectors = []; 
        for (const triangle of triangles) {
            normalVectors.push(Mesh.calculateTriangleNormalVector(mesh,triangle));
        
        }
        return normalVectors;

    }
    static removeTrianglesFromArray(array,triangleIndices) {
        let triangles = [...array];
        let index;
        for (let i =triangleIndices.length-1; i >= 0; i--) {
            index = triangleIndices[i];
            triangles.splice(index,1);
        }
        return triangles;
    }
    static convexHullIterativeProcess(field,triangles,graphIndices) {
        triangles = [...triangles]
        let upSpaceIndices = Field.getTrianglesUpspace(field,triangles,graphIndices);
        let farthestPoint = Field.getFarthestPointFromTriangles(field,triangles,upSpaceIndices);
        if (farthestPoint === false) {
            
            return false;
        }
        let triangleIndicesWithPointInUpspace = Field.getTrianglesWithPointInUpspace(field,triangles,farthestPoint);
        let trianglesWithPointInUpspace =  Triangle.getTrianglesFromIndices(triangles,triangleIndicesWithPointInUpspace)

        let newTriangleMap = new Map();
         
        Triangle.addPointsFromTrianglesToMap(newTriangleMap,trianglesWithPointInUpspace);
        let boundaryPoints = UsefulFunction.getNodesOnOutsideOfCounterClockwiseGraph(newTriangleMap);

        let newTriangles = Triangle.createPyramidFromBoundaryPoints(boundaryPoints,farthestPoint);
        
        
        triangles = this.removeTrianglesFromArray(triangles,triangleIndicesWithPointInUpspace);
        UsefulFunction.addElementsToArray(triangles,newTriangles);
        
        return triangles;
    }
    static generateConvexMesh(field,iterationNumber) {
        let unusedField = field;
        let searchToRemoveDuplicateTriangles = true;
        let triangles = undefined;
        if (triangles == undefined) {
            triangles = [Field.calculateLargestTriangleFromField(field)];
            triangles.push(Triangle.flipNormal(triangles[0]));
        }
        
            
        let result;
        let graphIndices = UsefulFunction.arrayOfIndices(field.array.length);
        triangles = this.convexHullIterativeProcess(field,triangles,graphIndices);
        for (let i =0 ; i < iterationNumber;i++) {
            result = this.convexHullIterativeProcess(field,triangles,graphIndices,iterationNumber);
            if (result == false) return new this(field,triangles,false);
            triangles = result;
        }
        

        
        return new this(field,triangles,false);
        
    }
    

    static backFaceCulling(mesh,camera,isPerspective) {
        //let viewVector = camera.viewVector;
        let viewVector = new Vector(0,0,1);
        let visibleTriangles = [];
        let backFaceCulledMesh = this.copy(mesh);
        backFaceCulledMesh.triangles = [];

        let normalVectors = Mesh.calculateTriangleNormalVectors(mesh);
        for (let i =0; i < mesh.triangles.length ; i++) {
            let isTriangleVisible;
            if (isPerspective)  {
                isTriangleVisible = Triangle.isDotProductLEThanX(mesh.vertices.array[mesh.triangles[i].verticeReferences[0]],normalVectors[i].direction,0);
            } else {
                isTriangleVisible = Triangle.isDotProductLEThanX(viewVector,normalVectors[i].direction,0);
            }
            
           
            if (!isTriangleVisible) continue;
            backFaceCulledMesh.triangles.push(mesh.triangles[i]);
            
        }
        return backFaceCulledMesh;
    }
    

    
    static rotate(mesh, angX,angY,angZ){
        let rotatedMesh = this.copy(mesh);
        for (let i = 0; i < rotatedMesh.vertices.length;i++) {
            let vertex = rotatedMesh.vertices[i];
            rotatedMesh.vertices[i] = (Vector.rotateVector(vertex,angX,angY,angZ));
        }
        return rotatedMesh;
    }
    static copy(mesh){
        let newMesh = Object.assign(Object.create(Object.getPrototypeOf(mesh)), mesh);
        
        newMesh.triangles = mesh.triangles.map(triangle => {
            // Create a new Triangle instance for each element in the triangles array
            return new Triangle(triangle.verticeReferences);
        });
        newMesh.vertices.array = mesh.vertices.array.map(vertex => {
            return new Vector(vertex.x,vertex.y,vertex.z);
        });


        return newMesh;
    }


    
}