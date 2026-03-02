import { Mesh } from "../geometry/Mesh";
import { PhysicsBody } from "../physics/PhysicsBody";
import { Vector } from "../../core/math/Vector";
import { Field } from "../../core/field/Field";
import { ColorHandler } from "colorhandler";
import { MeshGenerator } from "../geometry/generation/MeshGenerator";
import { Triangle } from "../geometry/Triangle";
export class Entity {
    #mesh : Mesh;
    #pB : PhysicsBody;
    #triangleColors : ColorHandler[];
    #isIndifferentToLight : boolean;
    constructor (mesh : Mesh, physicsBody : PhysicsBody,triangleColors : ColorHandler[], isIndifferentToLight : boolean) {
        this.#mesh = mesh;
        this.#pB = physicsBody; 
        this.#triangleColors = triangleColors;
        this.#isIndifferentToLight = isIndifferentToLight;
    }
    static randomConvexEntityWithColors(radius : number, n : number, physicsBody : PhysicsBody, c1 : ColorHandler, c2 :ColorHandler, isIndifferentToLight : boolean) : Entity {
        let mesh = MeshGenerator.generateRandomConvexMesh(radius,n);
        let colors = ColorHandler.randomColorsBetween(mesh.numTriangles,c1,c2);
        return new this(mesh,physicsBody,colors,isIndifferentToLight);
    }
    copy () : Entity{
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return new Entity(this.#mesh.copy(),this.#pB.copy(),newColors, this.#isIndifferentToLight);
    }
    get triangleColors () : ColorHandler[]{
        let newColors = [];
        for (const color of this.#triangleColors) {
            newColors.push(color.copy());
        }
        return newColors;
    }
    get worldSpaceMesh() : Mesh{
        let newMesh = this.#mesh.copy();
        let array = [];
        for (let i=0; i < newMesh.numPoints; i++) {
            array.push(Vector.add(newMesh.getVertex(i),this.#pB.position));
        }
        let field = new Field(array);
        newMesh.vertices = field;
        return newMesh;
    }
    set physicsBody(physicsBody : PhysicsBody)  {
        this.#pB = physicsBody;
    }
    get physicsBody () : PhysicsBody{
        return this.#pB.copy();
    }
    get mesh() : Mesh {
        return this.#mesh.copy()
    }
    get isIndifferentToLight() {
        return this.#isIndifferentToLight;
    }
    private generateMeshWithAppropriateColorsWithOnlyVisiblePartsOfTriangles(mesh : Mesh, colorMap : Map<string,ColorHandler>) : Mesh {
        let visibleTriangles = [];
        let newMesh = mesh.copy();
        let hiddenPointsMap = new Map<Vector,Boolean>() ;
        let hiddenPoints = this.getHiddenPoints(newMesh);
        for (let i =0; i < hiddenPoints.length; i++) {
            hiddenPointsMap.set(hiddenPoints[i], true);
        }

        let twoPointsHiddenTriangles = [];
        let onePointHiddenTriangles = [];
        for (let i =0; i < newMesh.numTriangles; i++) {
            const triangle = mesh.getTriangle(i);
            let whichPointsInMap = this.whichPointsInMap(newMesh,triangle,hiddenPointsMap);
            let numHiddenPoints = whichPointsInMap.length;
            if (numHiddenPoints === 3 ) continue;
            else if( numHiddenPoints === 1) {
                onePointHiddenTriangles.push({triangle : triangle, vector : whichPointsInMap[0]});
            }
            else if (numHiddenPoints === 2) {
                twoPointsHiddenTriangles.push({ triangle: triangle, vectors: whichPointsInMap});
            } else if (numHiddenPoints === 0) {
                visibleTriangles.push(triangle);
            }
            visibleTriangles.push(triangle);
        }
        newMesh.triangles = visibleTriangles;
        for (let i =0; i < twoPointsHiddenTriangles.length;i++) {
            const data = this.generateNewMeshWithAppropriateColorsWithNewVisibleTriangleFromOneTriangleWithTwoHiddenVertices(twoPointsHiddenTriangles[i].triangle,twoPointsHiddenTriangles[i].vectors,newMesh,colorMap);
            newMesh = data.mesh;
            colorMap = data.colorMap;
        }
        for (let i =0; i < onePointHiddenTriangles.length;i++) {
            const data = this.generateNewMeshWithAppropriateColorsWithTwoNewVisibleTrianglesFromOneTriangleWithHiddenVertex(onePointHiddenTriangles[i].triangle,onePointHiddenTriangles[i].vector,newMesh,colorMap);
            newMesh = data.mesh;
            colorMap = data.colorMap;
        }
        return newMesh;
    }
    private generateNewMeshWithAppropriateColorsWithNewVisibleTriangleFromOneTriangleWithTwoHiddenVertices(triangle : Triangle,hiddenVertices : Vector[], mesh: Mesh,colorMap : Map<string,ColorHandler>) : {mesh : Mesh, colorMap : Map<string, ColorHandler>} {
        if (hiddenVertices.length !== 2) {
            throw Error("hiddenVertices.length !== 2");
        }
        let visibleVerticeRef = -Infinity; // could be fatal flaw.
        for (let i =0; i < 3; i++) {
            let vertRef = triangle.getVerticeReference(i)
            let v = mesh.getVertex(vertRef);
            for (let i =0; i < hiddenVertices.length; i++) {
                if (hiddenVertices[i].equals(v)) continue;
                visibleVerticeRef = vertRef;
            }
        }
        if (visibleVerticeRef === -Infinity) {
            throw Error("Fatal error, malformed inputs likely the case");
        }
        
        let p1 = this.findPointBetweenTwoPointsAtZeroZ(hiddenVertices[0],mesh.getVertex(visibleVerticeRef));
        let p2 = this.findPointBetweenTwoPointsAtZeroZ(hiddenVertices[1],mesh.getVertex(visibleVerticeRef));

        let newVertices = mesh.vertices;

        newVertices.addVertex(p1);
        let p1Ref = newVertices.numPoints-1;

        newVertices.addVertex(p2);
        let p2Ref = newVertices.numPoints-1;
        
        let newTriangle = new Triangle([p1Ref,p2Ref,visibleVerticeRef]);
        let triangles = mesh.triangles;
        triangles.push(newTriangle);
        let newTriangleDistinct = newTriangle.getDistinctIdentifier();
        let color = colorMap.get(triangle.getDistinctIdentifier());
        if (color != undefined) {
            colorMap.set(newTriangleDistinct,color);
        } else {
            colorMap.set(newTriangleDistinct,new ColorHandler(255,255,255)); // hacky solution
        }
        
        return {mesh: new Mesh(mesh.vertices,triangles), colorMap : colorMap};
        // remember to flip the normal to match the original triangle
    }
    private generateNewMeshWithAppropriateColorsWithTwoNewVisibleTrianglesFromOneTriangleWithHiddenVertex(triangle : Triangle, hiddenVertex : Vector, mesh : Mesh, colorMap : Map<string,ColorHandler>) : {mesh:Mesh, colorMap : Map<string,ColorHandler>} {
        let visibleVerticesReferences = [];
        for (let i =0; i < 3; i++) {
            let vertRef = triangle.getVerticeReference(i)
            let v = mesh.getVertex(vertRef);
            if (hiddenVertex.equals(v)) continue;
            visibleVerticesReferences.push(vertRef);
        } 
        if (visibleVerticesReferences.length !== 2) {
            throw Error(" fatal error, visible vertice references.length !== 2");
        }
        let p1 = this.findPointBetweenTwoPointsAtZeroZ(hiddenVertex,mesh.getVertex(visibleVerticesReferences[0]));
        let p2 = this.findPointBetweenTwoPointsAtZeroZ(hiddenVertex,mesh.getVertex(visibleVerticesReferences[1]));

        let newVertices = mesh.vertices;

        newVertices.addVertex(p1);
        let p1Ref = newVertices.numPoints-1;

        newVertices.addVertex(p2);
        let p2Ref = newVertices.numPoints-1;
        
        let newTriangle = new Triangle([p1Ref,p2Ref,visibleVerticesReferences[0]]);
        let triangles = mesh.triangles;
        triangles.push(newTriangle)
        let newTriangleDistinct = newTriangle.getDistinctIdentifier();
        let color = colorMap.get(triangle.getDistinctIdentifier());
        if (color != undefined) {
            colorMap.set(newTriangleDistinct,color);
        } else {
            colorMap.set(newTriangleDistinct,new ColorHandler(255,255,255)); // hacky solution
        }
        newTriangle = new Triangle([p2Ref,visibleVerticesReferences[1],visibleVerticesReferences[0]]);
        triangles.push(newTriangle);
        newTriangleDistinct = newTriangle.getDistinctIdentifier();
        color = colorMap.get(triangle.getDistinctIdentifier());
        if (color != undefined) {
            colorMap.set(newTriangleDistinct,color);
        } else {
            colorMap.set(newTriangleDistinct,new ColorHandler(255,255,255)); // hacky solution
        }
        return {mesh: new Mesh(mesh.vertices,triangles), colorMap: colorMap};
        // remember to flip the normal to match the original triangle
    }
    private findPointBetweenTwoPointsAtZeroZ(v1 : Vector, v2: Vector) : Vector {
        let x = v1.x + (v2.x- v1.x) * ((-v1.z)/(v2.z-v1.z));
        let y = v1.y + (v2.y- v1.y) * ((-v1.z)/(v2.z-v1.z));
        let z = 0;
        return new Vector(x,y,z);
    }
    
    private whichPointsInMap(mesh : Mesh, triangle : Triangle, map : Map<Vector,Boolean>) : Vector[]{
        let points = [];
        for (let i =0; i < 3; i++) {
            const triangleVerticeReference = triangle.getVerticeReference(i);
            let v =mesh.getVertex(triangleVerticeReference)
            if(map.has(v)) points.push(v);
        }
        return points;
    }
    
    private getHiddenPoints(mesh: Mesh) : Vector[] {
        let hiddenPoints = [];
        for (let i =0; i < mesh.numPoints; i++) {
            let v = mesh.getVertex(i);
            if (v.z === -Infinity) {
                hiddenPoints.push(v);
            }
        }
        return hiddenPoints;
    }
}