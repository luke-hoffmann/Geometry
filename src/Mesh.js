import { UsefulFunction } from "../Useful-Function/src/UsefulFunction.js";
import { Vector } from "./Vector.js";
import { Line } from "./Line.js";
import { Field } from "./Field.js";
import { Triangle } from "./Triangle.js";
import { ColorHandler } from "../Color-Handler/src/ColorHandler.js";
export class Mesh {
    constructor (vertices,triangles,triangleColor,standalonePointDiameter,standalonePointColor,trianglePointDiameter,trianglePointColor,doGraphNormalVectors,normalVectorColor) {
        
        if (standalonePointDiameter == undefined) {
            this.standalonePointDiameter = 3;
        } else {
            this.standalonePointDiameter = standalonePointDiameter;
        }
        if (standalonePointColor == undefined) {
            this.standalonePointColor = new ColorHandler(0,0,0);
        } else {
            this.standalonePointColor = standalonePointColor
        }
        if (trianglePointDiameter == undefined) {
            this.trianglePointDiameter = 3;
        } else {
            this.trianglePointDiameter = trianglePointDiameter
        }
        if (trianglePointColor == undefined) {
            this.trianglePointColor =new ColorHandler(0,0,0);
        } else {
            this.trianglePointColor = trianglePointColor;
        }
        if (triangleColor == undefined) {
            this.triangleColor = new ColorHandler(0,0,0);
        } else {
            this.triangleColor = triangleColor;
        }
        if (triangleColor == true) {
            this.triangleColor = true;
        }
        if (normalVectorColor == undefined) {
            this.normalVectorColor = new ColorHandler(0,0,0);
        } else {
            this.normalVectorColor = normalVectorColor;
        }
        if (doGraphNormalVectors == true) {
            this.doGraphNormalVectors = true;
        } else {
            this.doGraphNormalVectors = false;
        }

        this.vertices = vertices;
        this.triangles = triangles;
        if (vertices ==undefined) {
            this.vertices = [];
        }
        if (triangles ==undefined) {
            this.triangles = [];
        }
    }
    
    static setColorOfTriangles(mesh,colors){
        if (colors.length != mesh.triangles.length) throw new Error("Array size mismatch");
        let newMesh = this.copy(mesh);
        let triangles = [...newMesh.triangles];
        for (let i = 0 ; i < colors.length;i++) {
            let color = colors[i];
            
            triangles[i].color = color;
            
        }
        newMesh.triangles = triangles;
        return newMesh;
    }

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
            if (result == false) return new this(field.array,triangles,false);
            triangles = result;
        }
        

        

        
        return new this(field.array,triangles,false);
        
    }
    graphNormalVectors(color,length){
        for (triangle of this.triangles) {
            let field = new Field(this.vertices);
           
            let centerOfTriangle = Triangle.computeCentroid(field,triangle);
            let normalVector = Vector.scalarMult(Triangle.computeNormal(field,triangle),length);
            normalVector = Vector.add(normalVector,centerOfTriangle)

            Line.graphBetweenTwoPoints(normalVector,centerOfTriangle,color);
        }
    }
    graphSpecificVertices(indices,diameter,color) {
        for (const index of indices) {
            this.vertices[index].graph(diameter,color);
        }
    }
    graphVertices(diameter,color){
        for (const vertex of this.vertices) {
            vertex.graph(diameter,color);
        }
    }
    getVerticesFromTriangle(triangle){
        let vertices =[];
        for (const reference of triangle.verticeReferences) {
            vertices.push(reference);
        }
        return vertices;
    }
    
    graphTriangles(triangleColor,pointDiameter,pointColor,lineWeight){
        for (triangle of this.triangles) {
            if (triangleColor == true) {
                Triangle.graphTriangleFill(this.vertices, triangle, triangle.color);
                Triangle.graphTriangleOutline(this.vertices, triangle, new ColorHandler(0,0,0), lineWeight);
                continue;
            }
            Triangle.graphTriangleOutline(this.vertices,triangle,triangleColor,1);
        }
    
    }

    static backFaceCulling(mesh,viewVector) {
        let visibleTriangles = [];
        let backFaceCulledMesh = this.copy(mesh);
        backFaceCulledMesh.triangles = [];
        for (const triangle of mesh.triangles) {
            let isTriangleVisible = Triangle.isTriangleFacingCamera(new Field(mesh.vertices),triangle,viewVector);
            if (!isTriangleVisible) continue;
            backFaceCulledMesh.triangles.push(triangle);
            
        }
        return backFaceCulledMesh;
    }
    static graph(mesh, graphTriangles,graphVertices,graphNormalVectors){
        if (graphVertices) {
            mesh.graphVertices(mesh.standalonePointDiameter,mesh.standalonePointColor);
        }
        if (graphTriangles) {
            mesh.graphTriangles(mesh.triangleColor,mesh.trianglePointDiameter,mesh.trianglePointColor,1);
        } 
        
        if (!graphNormalVectors) {
            return
        }
        mesh.graphNormalVectors(mesh.normalVectorColor,40);
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
            return new Triangle(triangle.verticeReferences, triangle.color);
        });
        newMesh.vertices = mesh.vertices.map(vertex => {
            // Create a new Triangle instance for each element in the triangles array
            return new Vector(vertex.x,vertex.y,vertex.z);
        });


        return newMesh;
    }


    static graphConvexHullOnCanvas(mesh,t,graphConvexHull,doBackFaceCulling,doNormalVectors,triangleColor) {
        let currentMesh = Mesh.copy(mesh);
        let rotatedMesh = Mesh.rotate(currentMesh,t,t,0)
        rotatedMesh.triangleColor = triangleColor;
        
        
        if (!graphConvexHull) {
            Mesh.graph(rotatedMesh,graphConvexHull,true,false);
            return
        } 
    
        if (doBackFaceCulling) {
            rotatedMesh = Mesh.backFaceCulling(rotatedMesh,viewVector);
            let colors = Triangle.getColorOfTriangles(new Field(rotatedMesh.vertices),rotatedMesh.triangles,lights)
            rotatedMesh = Mesh.setColorOfTriangles(rotatedMesh,colors);
            Mesh.graph(rotatedMesh,graphConvexHull,false,doNormalVectors);
        }   else {
            rotatedMesh.triangleColor = new ColorHandler(0,0,0);
            Mesh.graph(rotatedMesh,graphConvexHull,true,doNormalVectors);
        }
    }
}