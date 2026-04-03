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
    protected _camera : Camera;
    protected _scene : Scene;
    protected _renParam : RenderParameters;
    constructor (scene : Scene ,camera: Camera,renderParameters: RenderParameters) {
        this._scene = scene;
        this._camera = camera;
        this._renParam = renderParameters;
    }  


    protected entityGraphBeforeChangesHook(entity : Entity) : void{};
    protected entityGraphCameraSpaceHook(entity: Entity) : void{};
    protected entityGraphProjectedSpaceHook(entity: Entity) : void{};
    protected entityGraphBackFaceCulledSpaceHook(entity : Entity) : void{};

    protected mainGraphFunctionalPreWork() : void{};
    protected mainGraphFunctionalPostWork(): void{};
    protected abstract mainGraphRenderingPreWork() : void;
    protected abstract mainGraphRenderingPostWork() : void;


    protected abstract meshToCanvas(mesh : Mesh) : Mesh;
    protected abstract graphNormalVectors(mesh : Mesh, normalVectors : NormalVector[],length : number) : void;
    protected abstract graphVertices(mesh : Mesh) : void;
    protected abstract graphTriangles (mesh : Mesh, triangleColors : ColorHandler[]) : void;
    
    protected abstract pointToCanvas(point : Vector) : Vector;
    protected abstract graphLight(light : LightElement) : void;


    setSceneLightPos(pos : Vector, i : number) : void {
        this._scene.setLightPos(pos, i);
    }
    
    protected getSceneInZOrder() : Element[]{

        let elements : Element[]= [];

        for (let i = 0; i < this._scene.numEntities; i++) {
            elements.push({type: "entity" , ref: i, z: this.getCameraSpaceMesh(this._scene.getEntity(i)).calculateAverageZ()});
        }
        
        for (let i = 0 ; i < this._scene.numLights; i++) {
            const light = this._scene.getLight(i);
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
        this.mainGraphFunctionalPreWork();
        this.mainGraphRenderingPreWork();
        let sceneItems = this.getSceneInZOrder();
        for (const sceneItem of sceneItems) {
            if (sceneItem.type== "entity") {
                this.graphEntity(this._scene.getEntity(sceneItem.ref));
            }
            if (sceneItem.type == "light" && this._renParam.showLights) {
                this.graphLight(sceneItem);
            }
        }
        this.mainGraphRenderingPostWork();
        this.mainGraphFunctionalPostWork();
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
        for (let i =0 ; i < this._scene.numLights; i++) {
            const light = this._scene.getLight(i);
            output = this.getColorOfTrianglesFromLight(mesh,colors,meshCentroids,meshNormalVectors, light,positionOfMesh, output);
        }
        for (let i =0 ; i < output.length; i++) {
            output[i] = output[i].clampColor();
        }

        return output;

    }
    protected finalLightPosition<L extends Light & Positionable>(light : L) : {canvasPosition: Vector, radius: number} {
        
        let pos = this._camera.putCameraAtCenterOfPointCoordinateSystem(light.position);
        const ratio = this._camera.focalDistance / pos.z;
        let canvasRadius = light.radius * ratio;

        pos = this.projectIndividualPoint(pos);
        pos = this.pointToCanvas(pos);
        
        return {canvasPosition: pos, radius: canvasRadius};
    }
    protected getCameraSpaceMesh(entity : Entity) : Mesh {
        entity = entity.copy();
        let mesh = entity.worldSpaceMesh;
        
        return this._camera.putCameraAtCenterOfMeshCoordinateSystem(mesh);

    }
    protected graphEntity (entity : Entity) : void{
        let mesh = entity.worldSpaceMesh
        if (this._renParam.doEntityHooks) {
            this.entityGraphCameraSpaceHook(new Entity(mesh,entity.physicsBody,entity.triangleColors,entity.isIndifferentToLight));
        }
        let triangleColors = entity.triangleColors;
        let meshCentroids = mesh.triangleCentroids;
        let meshNormalVectors = mesh.triangleNormalVectors;
        if (!entity.isIndifferentToLight) {
            triangleColors = this.getColorsOfTrianglesFromAllLights(mesh,triangleColors,meshCentroids,meshNormalVectors,entity.physicsBody.position);
        }
        mesh.calculateTrianglesNormalVectors();
        

        let colorMap = mesh.mapTrianglesToAnyObject(triangleColors);
        mesh = this.getCameraSpaceMesh(entity);
        if (this._renParam.doEntityHooks) {
            this.entityGraphCameraSpaceHook(new Entity(mesh,entity.physicsBody,entity.triangleColors,entity.isIndifferentToLight));
        }
        if (!this._renParam.isWindingOrderBackFaceCulling && this._renParam.doBackFaceCulling) mesh = this.backFaceCulling_Normal(mesh);
        let normalVectors;
        normalVectors = mesh.calculateTrianglesNormalVectors();
        mesh = this.applyProjection(mesh);
        if (this.isAnyMeshPointBehindCamera(mesh)) {
            return;
        }
        if (this._renParam.doEntityHooks) {
            this.entityGraphProjectedSpaceHook(new Entity(mesh,entity.physicsBody,entity.triangleColors,entity.isIndifferentToLight));
        }
        
        if (this._renParam.isWindingOrderBackFaceCulling && this._renParam.doBackFaceCulling) {
            const map = mesh.mapTrianglesToAnyObject(normalVectors!);
            mesh = this.backFaceCulling_WindingOrder(mesh);
            normalVectors = mesh.findAnyObjectFromMap(map);
        }
        let colors = mesh.findAnyObjectFromMap(colorMap);
        let normalVectorsMesh = mesh;
        if (this._renParam.doEntityHooks) {
            this.entityGraphBackFaceCulledSpaceHook(new Entity(mesh,entity.physicsBody,entity.triangleColors,entity.isIndifferentToLight));
        }
        
        mesh = this.meshToCanvas(mesh);
        
        if (this._renParam.doVertices) this.graphVertices(mesh);
        if (this._renParam.doTriangles) this.graphTriangles(mesh,colors);
        if (this._renParam.doNormalVectors) this.graphNormalVectors(normalVectorsMesh, normalVectors!,this._renParam.normalVectorLength);
        
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
    
    protected backFaceCulling_Normal(mesh : Mesh) : Mesh{
        let viewVector = new Vector(0,0,1);
        let backFaceCulledMesh = mesh.copy();
        let cameraFacingTriangles = [];

        let normalVectors = backFaceCulledMesh.calculateTrianglesNormalVectors();
        
        for (let i =0; i < mesh.numTriangles ; i++) {
            let isTriangleVisible;
            if (this._renParam.isPerspective)  {
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
        let z= this._camera.focalDistance;
         if (vector.z < 0 ) {
            z = -Infinity;
        }
        return new Vector(vector.x,vector.y,this._camera.focalDistance);
    }
    private perspectiveProjectIndividualVector(vector : Vector) : Vector{
        const ratio = this._camera.focalDistance/vector.z;
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
            let line = this._renParam.isPerspective ? this.perspectiveProjectNormalVectorIntoLine(v,length) : this.orthographicProjectNormalVectorIntoLine(v,length);
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
    protected projectIndividualPoint(point : Vector) : Vector {
        if (this._renParam.isPerspective) {
            point =this.perspectiveProjectIndividualVector(point);
        } else {
            point = this.orthographicProjectIndividualVector(point);
        }
        return point;
    }
    public get camera(): Camera {
        return this._camera.copy();
    }

    public set camera(v: Camera) {
        this._camera = v.copy();
    }

    public get renderParameters(): RenderParameters {
        return this._renParam;
    }

    public set renderParameters(v: RenderParameters) {
        this._renParam = v;
    }
    public set scene(scene : Scene) {
        this._scene = scene.copy();
    }
    public get scene() {
        return this._scene.copy();
    }
}