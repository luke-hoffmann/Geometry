import { Mesh } from "../engine/geometry/Mesh.js";
import type { Camera } from "../engine/scene/Camera.js";
import { NormalVector } from "../core/math/NormalVector.js";
import { Light } from "../engine/lighting/Light.js";
import { Field } from "../core/field/Field.js";
import { TriangleInput } from "../engine/lighting/Light.js";
import { Line } from "../engine/geometry/Line.js";
import type { RenderParameters } from "./RenderParameters.js";
import { Vector } from "../core/math/Vector.js"
import { Scene } from "../engine/scene/Scene.js";
import { Entity } from "../engine/scene/Entity.js";
import { Triangle } from "../engine/geometry/Triangle.js";
import { ColorHandler } from "colorhandler";
import type { Positionable } from "../engine/lighting/Light.js";
type EntityElement = {
    z: number,
    type: "entity",
    ref: number
}
export type LightElement = {
    z: number,
    type: "light",
    ref: number,
    light: Light,
    finalLightPosition: {canvasPosition: Vector, radius: number}
}
type Element = EntityElement | LightElement;
export abstract class Renderer {
    protected camera : Camera;
    protected scene : Scene;
    protected renParam : RenderParameters;
    constructor (scene : Scene ,camera: Camera,renderParameters: RenderParameters) {
        this.scene = scene;
        this.camera = camera;
        this.renParam = renderParameters;
    }  
    protected functionalPreWork() : void{};
    protected functionalPostWork(): void{};
    protected abstract renderingPreWork() : void;
    protected abstract meshToCanvas(mesh : Mesh) : Mesh;
    protected abstract graphNormalVectors(mesh : Mesh, normalVectors : NormalVector[],length : number) : void;
    protected abstract graphVertices(mesh : Mesh) : void;
    protected abstract graphTriangles (mesh : Mesh, triangleColors : ColorHandler[]) : void;
    protected abstract renderingPostWork() : void;
    protected abstract pointToCanvas(point : Vector) : Vector;
    protected abstract graphLight(light : LightElement) : void;


    setSceneLightPos(pos : Vector, i : number) : void {
        this.scene.setLightPos(pos, i);
    }
    
    protected getSceneInZOrder() : Element[]{

        let elements : Element[]= [];

        for (let i = 0; i < this.scene.numEntities; i++) {
            elements.push({type: "entity" , ref: i, z: this.getCameraSpaceMesh(this.scene.getEntity(i)).calculateAverageZ()});
        }
        
        for (let i = 0 ; i < this.scene.numLights; i++) {
            const light = this.scene.getLight(i);
            if (!Light.hasPosition(light)) {
                continue;
                
            };
            const finalLightPosition= this.finalLightPosition(light)
            elements.push ({type: "light", ref : i, light: light,finalLightPosition: finalLightPosition, z : finalLightPosition.canvasPosition.z})
        }
        elements.sort((a,b) => b.z-a.z);
        return elements.filter(e => e.z >=0);
    }
    
    
    graph () : void {
        this.functionalPreWork();
        this.renderingPreWork();
        let sceneItems = this.getSceneInZOrder();
        for (const sceneItem of sceneItems) {
            if (sceneItem.type== "entity") {
                this.graphEntity(this.scene.getEntity(sceneItem.ref));
            }
            if (sceneItem.type == "light") {
                this.graphLight(sceneItem);
            }
        }
        this.renderingPostWork();
        this.functionalPostWork();
    }


    private getColorOfTriangle(mesh : Mesh,color : ColorHandler, triangleCentroid : Vector, triangleNormalVector : Vector, light: Light, distance: number) : ColorHandler {
        let triangleColor = light.calculateTriangleColor({trianglePosition: triangleCentroid, triangleNormalVector: triangleNormalVector, triangleColor:color, distance:distance});

        return triangleColor
    }
    private getColorOfTrianglesFromLight(mesh : Mesh, colors : ColorHandler[], meshCentroids : Vector[], meshNormalVectors : Vector[], light: Light, positionOfMesh: Vector, outColors : ColorHandler[]) : ColorHandler[] {
        let distance = -Infinity;
        if (Light.hasPosition(light)) {
            distance = Vector.distanceBetweenVectors(positionOfMesh,light.position);
            if (distance ==0) distance=1;
        }
        for (let i = 0; i < mesh.numTriangles; i++) {
            
            const col = (this.getColorOfTriangle(mesh,colors[i], meshCentroids[i], meshNormalVectors[i], light, distance));
            outColors[i].addInto(col);
        }
        return outColors;
    }
    protected getColorsOfTrianglesFromAllLights(mesh : Mesh, colors : ColorHandler[], meshCentroids : Vector[], meshNormalVectors : Vector[], positionOfMesh: Vector) : ColorHandler[] {

        let output : ColorHandler[] = new Array(mesh.numTriangles);
        for (let i =0 ; i < output.length;i ++) {
            output[i] = new ColorHandler(0,0,0);
        }
        for (let i =0 ; i < this.scene.numLights; i++) {
            const light = this.scene.getLight(i);
            output = this.getColorOfTrianglesFromLight(mesh,colors,meshCentroids,meshNormalVectors, light,positionOfMesh, output);
        }
        for (let i =0 ; i < output.length; i++) {
            output[i] = output[i].clampColor();
        }

        return output;

    }
    protected finalLightPosition<L extends Light & Positionable>(light : L) : {canvasPosition: Vector, radius: number} {
        
        let pos = this.camera.putCameraAtCenterOfPointCoordinateSystem(light.position);
        const ratio = this.camera.focalDistance / pos.z;
        let canvasRadius = light.radius * ratio;

        pos = this.projectIndividualPoint(pos);
        pos = this.pointToCanvas(pos);
        
        return {canvasPosition: pos, radius: canvasRadius};
    }
    protected getCameraSpaceMesh(entity : Entity) : Mesh {
        entity = entity.copy();
        let mesh = entity.worldSpaceMesh;
        
        return this.camera.putCameraAtCenterOfMeshCoordinateSystem(mesh);

    }
    protected graphEntity (entity : Entity) : void{
        
        let mesh = entity.worldSpaceMesh
        let triangleColors = entity.triangleColors;
        let meshCentroids = mesh.triangleCentroids;
        let meshNormalVectors = mesh.triangleNormalVectors;
        if (!entity.isIndifferentToLight) {
            triangleColors = this.getColorsOfTrianglesFromAllLights(mesh,triangleColors,meshCentroids,meshNormalVectors,entity.physicsBody.position);
        }
        mesh.calculateTrianglesNormalVectors();
        

        let colorMap = mesh.mapTrianglesToAnyObject(triangleColors);
        mesh = this.getCameraSpaceMesh(entity);
        
        if (!this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) mesh = this.backFaceCulling_Normal(mesh);
        let normalVectors;
        normalVectors = mesh.calculateTrianglesNormalVectors();
        mesh= this.applyProjection(mesh);
        if (this.isAnyMeshPointBehindCamera(mesh)) {
            return;
        }
        
        
        //mesh = this.generateMeshWithAppropriateColorsWithOnlyVisiblePartsOfTriangles(mesh,colorMap);
        if (this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) {
            const map = mesh.mapTrianglesToAnyObject(normalVectors!);
            mesh = this.backFaceCulling_WindingOrder(mesh);
            normalVectors = mesh.findAnyObjectFromMap(map);
        }
        let colors = mesh.findAnyObjectFromMap(colorMap);
        let normalVectorsMesh = mesh;
        
        
        mesh = this.meshToCanvas(mesh);
        
        if (this.renParam.doVertices) this.graphVertices(mesh);
        if (this.renParam.doTriangles) this.graphTriangles(mesh,colors);
        if (this.renParam.doNormalVectors) this.graphNormalVectors(normalVectorsMesh, normalVectors!,this.renParam.normalVectorLength);
        
    }
    private isAnyMeshPointBehindCamera(mesh : Mesh) {
        for (let i =0; i < mesh.numPoints; i++) {
            let v = mesh.getVertex(i);
            if (v.z === -Infinity) {
                return true;
            }
        }
        return false;
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
    protected backFaceCulling_Normal(mesh : Mesh) : Mesh{
        let viewVector = new Vector(0,0,1);
        let visibleTriangles = [];
        let backFaceCulledMesh = mesh.copy();
        let cameraFacingTriangles = [];

        let normalVectors = backFaceCulledMesh.calculateTrianglesNormalVectors();
        
        for (let i =0; i < mesh.numTriangles ; i++) {
            let isTriangleVisible;
            if (this.renParam.isPerspective)  {
                isTriangleVisible = Vector.sub( normalVectors[i].position, new Vector(0,0,0)).isDotProductLEThanX(normalVectors[i].direction,0);
            } else {
                isTriangleVisible = viewVector.isDotProductLEThanX(normalVectors[i].direction,0);
            }
            
           
            if (!isTriangleVisible) continue;
            cameraFacingTriangles.push(mesh.getTriangle(i));
            
        }
        backFaceCulledMesh.triangles = cameraFacingTriangles;
        return backFaceCulledMesh;
    }

    protected backFaceCulling_WindingOrder(mesh:Mesh) : Mesh {
        // https://gamedev.stackexchange.com/questions/203694/how-to-make-backface-culling-work-correctly-in-both-orthographic-and-perspective/203696#203696?newreg=8d2ba9830dff49858dc50a9fd742c3d9 -- the below formula is found from this website
        // sign = ab.x*ac.y - ac.x*ab.y;
        let backFaceCulledMesh = mesh.copy();
        let cameraFacingTriangles = [];
        
        for (let i = 0; i < backFaceCulledMesh.numTriangles; i++) {
            const triangle = backFaceCulledMesh.getTriangle(i);
            const a = backFaceCulledMesh.getVertex(triangle.getVerticeReference(0));
            const b = backFaceCulledMesh.getVertex(triangle.getVerticeReference(1));
            const c = backFaceCulledMesh.getVertex(triangle.getVerticeReference(2));
            const ab = Vector.sub(b,a);
            const ac = Vector.sub(c,a);
            const windingDirection = ab.x * ac.y - ac.x * ab.y;
            if (windingDirection > 0) cameraFacingTriangles.push(triangle);
        }
        backFaceCulledMesh.triangles = cameraFacingTriangles;
        return backFaceCulledMesh;
    }


    private orthographicProjectIndividualVector(vector : Vector): Vector {
        let z= this.camera.focalDistance;
         if (vector.z < 0 ) {
            z = -Infinity;
        }
        return new Vector(vector.x,vector.y,this.camera.focalDistance);
    }
    private perspectiveProjectIndividualVector(vector : Vector) : Vector{
        
        const ratio = this.camera.focalDistance/vector.z;
        let x = vector.x * ratio;
        let y= vector.y * ratio;
            
        let z = vector.z;
        if (vector.z < 0 ) {
            z = -Infinity;
        }
        return new Vector(x,y,z);
    }
    
    private orthographicProjectNormalVectorIntoLine(normalVector : NormalVector,length : number) : Line{
        let p1 = this.orthographicProjectIndividualVector(normalVector.position);
        let p2 = this.orthographicProjectIndividualVector(Vector.add(Vector.scalarMult(normalVector.direction,length),normalVector.position));
        return new Line(p1,p2);
    } 
    private perspectiveProjectNormalVectorIntoLine(normalVector : NormalVector,length : number) : Line{
        let p1 = this.perspectiveProjectIndividualVector(normalVector.position);
        let p2 = this.perspectiveProjectIndividualVector(Vector.add(Vector.scalarMult(normalVector.direction,length),normalVector.position));
        return new Line(p1,p2);
    } 
    protected projectNormalVectorsIntoLines(normalVectors : NormalVector[],length : number) : Line[]{
        let lines = [];
        for (const v of normalVectors) {
            let line = this.renParam.isPerspective ? this.perspectiveProjectNormalVectorIntoLine(v,length) : this.orthographicProjectNormalVectorIntoLine(v,length);
            if (line.p1.z == -Infinity) continue;
            if (line.p2.z == -Infinity) continue;
            lines.push(line);
        }
        return lines;
    }
    
    
    protected applyProjection(mesh : Mesh) : Mesh{
    
        let newMesh = mesh.copy();
        let projectedArray = [];
        for (let i =0 ; i < newMesh.numPoints; i++) {
            let pV;
            const v = newMesh.getVertex(i);
            pV = this.projectIndividualPoint(v);
            
            projectedArray.push(pV);
        }
        let projectedField = new Field(projectedArray);
        newMesh.vertices = projectedField;
        return newMesh;
    }
    private projectIndividualPoint(point : Vector) : Vector {
        if (this.renParam.isPerspective) {
            point =this.perspectiveProjectIndividualVector(point);
        } else {
            point = this.orthographicProjectIndividualVector(point);
        }
        return point;
    }
    
}