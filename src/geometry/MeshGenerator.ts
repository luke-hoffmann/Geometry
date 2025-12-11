import { UsefulFunction } from "../libs/UsefulFunction/src/UsefulFunction";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { Mesh } from "./Mesh.js";
export class MeshGenerator {
    static convexHullIterativeProcess(field : Field,triangles : Triangle[],graphIndices : number[]) : Mesh {
        triangles = [...triangles]
        let upSpaceIndices = Field.getTrianglesUpspace(field,triangles,graphIndices);
        let farthestPoint = Field.getFarthestPointFromTriangles(field,triangles,upSpaceIndices);
        if (farthestPoint === false) {
            return false;
        }
        let trianglesWithPointInUpspace = Field.getTrianglesWithPointInUpspace(field,triangles,farthestPoint);
       

        let newTriangleMap = new Map();
         
        Triangle.addPointsFromTrianglesToMap(newTriangleMap,trianglesWithPointInUpspace);
        let boundaryPoints = UsefulFunction.getNodesOnOutsideOfCounterClockwiseGraph(newTriangleMap);

        let newTriangles = Triangle.createPyramidFromBoundaryPoints(boundaryPoints,farthestPoint);
        
        
        triangles = UsefulFunction.removeIndicesFromArray(triangles,triangleIndicesWithPointInUpspace);
        UsefulFunction.addElementsToArray(triangles,newTriangles);
        
        return triangles;
    }


    static generateConvexMesh(field : Mesh,iterationNumber : number) {
        let unusedField = field;
        let searchToRemoveDuplicateTriangles = true;
        let triangles = undefined;
        if (triangles == undefined) {
            triangles = [Field.calculateLargestTriangleFromField(field)];
            triangles.push(triangles[0].flipNormal());
        }
        
            
        let result;
        let graphIndices = UsefulFunction.arrayOfIndices(field.array.length);
        triangles = this.convexHullIterativeProcess(field,triangles,graphIndices);
        for (let i =0 ; i < iterationNumber;i++) {
            result = this.convexHullIterativeProcess(field,triangles,graphIndices,iterationNumber);
            if (result == false) return new this(field,triangles,false);
            triangles = result;
        }
        

        
        return new Mesh(field,triangles);
        
    }
}