import { UsefulFunction } from "usefulfunction";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { Mesh } from "./Mesh.js";


export class MeshGenerator {
    private static convexHullIterativeProcess(field : Field,triangles : Triangle[],graphIndices : number[]) : Triangle[] {
        triangles = [...triangles] // could be a source of large memory usage
        let upSpaceIndices = field.getTrianglesUpspaces_Fast(triangles,graphIndices);
        let farthestPoint = upSpaceIndices[0];
        if (upSpaceIndices.length == 1 ) {
            farthestPoint = upSpaceIndices[0];
        } else if(upSpaceIndices.length==0) {
            return [];
        } else {
            farthestPoint = field.getFarthestPointFromTriangles_Fast(triangles,upSpaceIndices);
        }
        
        
        if (farthestPoint === undefined) {
            throw Error("LOOK AT THIS CODE LINE IDK - 12/10/2025 - when i took on the task of converting it all to TS");
            //return false;
        }

        let triangleIndicesWithPointInUpspace = field.getTriangleIndicesWithPointInUpspace(triangles,farthestPoint);
        let trianglesWithPointInUpspace = field.getTrianglesWithPointInUpspace(triangles,farthestPoint);
       

        let newTriangleMap = new Map();
        Triangle.addPointsFromTrianglesToMap(newTriangleMap,trianglesWithPointInUpspace);
        let boundaryPoints = UsefulFunction.getNodesOnOutsideOfCounterClockwiseGraph(newTriangleMap,100000);
        let newTriangles = Triangle.createPyramidFromBoundaryPoints(boundaryPoints,farthestPoint);
        
        triangles = UsefulFunction.removeIndicesFromArray(triangles,triangleIndicesWithPointInUpspace);
        triangles = MeshGenerator.addTrianglesToTrianglesArray(triangles,newTriangles);
        return triangles;
    }
    static addTrianglesToTrianglesArray(trianglesArray : Triangle[],triangles : Triangle[]) : Triangle[]{
        let newArray  = [];
        trianglesArray.forEach(element => {
            newArray.push(element.copy());
        });

        for (const triangle of triangles) { 
            newArray.push(triangle);
        }
        return newArray;
    }

    static generateConvexMesh(field : Field,iterationNumber : number) {
        let unusedField = field;
        let searchToRemoveDuplicateTriangles = true;
        let triangles = undefined;
        triangles = [field.calculateLargestTriangleFromField()];
        triangles.push(triangles[0].flipNormal());
            
        let graphIndices = UsefulFunction.arrayOfIndices(field.numPoints);
        triangles = this.convexHullIterativeProcess(field,triangles,graphIndices);
        for (let i =0 ; i < iterationNumber;i++) {
            const result = this.convexHullIterativeProcess(field,triangles,graphIndices);
            if (result.length == 0) return new Mesh(field,triangles);
            triangles = result;
        }
        

        
        return new Mesh(field,triangles);
        
    }
}