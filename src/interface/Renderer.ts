import type { Mesh } from "../geometry/Mesh.js";
import type { Camera } from "../camera/Camera.js";

import { Light } from "../geometry/Light.js";
import { Field } from "../geometry/Field.js";
import { Line } from "../geometry/Line.js";
import type { RenderParameters } from "./RenderParameters.js";
import { Vector } from "../geometry/Vector.js"
import { Scene } from "./Scene.js";
import { Entity } from "../geometry/Entity.js";
import { Triangle } from "../geometry/Triangle.js";
import { ColorHandler } from "colorhandler";
export abstract class Renderer {
    protected camera : Camera;
    protected scene : Scene;
    protected renParam : RenderParameters;
    constructor (scene : Scene ,camera: Camera,renderParameters: RenderParameters) {
        this.scene = scene;
        this.camera = camera;
        this.renParam = renderParameters;
    }  
    protected abstract preWork() : void;
    protected abstract meshToCanvas(mesh : Mesh) : Mesh;
    
    protected abstract graphVertices(mesh : Mesh) : void;
    protected abstract graphTriangles (mesh : Mesh, triangleColors : ColorHandler[]) : void;
    protected abstract postWork() : void;
    protected abstract pointToCanvas(point : Vector) : Vector;
    protected abstract graphLight(light : Light) : void;


    setSceneLightPos(pos : Vector, i : number) : void {
        this.scene.setLightPos(pos, i);
    }
    
    private getSceneInZOrder(){
        let elements : {z : number, type : "entity" | "light", ref : number}[]= [];
        for (let i = 0; i < this.scene.numEntities; i++) {
            elements.push({type: "entity" , ref: i, z: this.getCameraSpaceMesh(this.scene.getEntity(i)).calculateAverageZ()});
        }
        for (let i = 0 ; i < this.scene.numLights; i++) {
            elements.push ({type: "light", ref : i, z : this.finalLightPosition(this.scene.getLight(i)).position.z})
        }
        elements.sort((a,b) => b.z-a.z);
        return elements.filter(e => e.z >=0);
    }
    
    
    graph () : void {
        this.preWork()
        for (let i =0 ; i < this.scene.numEntities; i++) {
            this.graphEntity(this.scene.getEntity(i));
        }
        
        for (let i =0 ; i < this.scene.numLights; i++) {
            this.graphLight(this.scene.getLight(i));
        }
        // let sceneItems = this.getSceneInZOrder();
        // for (const sceneItem of sceneItems) {
        //     if (sceneItem.type== "entity") {
        //         this.graphEntity(this.scene.getEntity(sceneItem.ref));
        //     }
        //     if (sceneItem.type == "light") {
        //         this.graphLight(this.scene.getLight(sceneItem.ref));
        //     }
        // }
        this.postWork();
    }


    private getColorOfTriangle(mesh : Mesh, triangle : Triangle, color : ColorHandler) : ColorHandler {
       
        let centerOfTriangle = triangle.computeCentroid(mesh.vertices);
        let colorArray = [];
        let triangleNormalVector = triangle.computeNormal(mesh.vertices);
        for (let i =0; i < this.scene.numLights; i++) {
            const light = this.scene.getLight(i);
            const lightingVector = Vector.unitVector(Vector.sub(light.position,centerOfTriangle));
            const angleBrightness = Vector.dotProduct(lightingVector,triangleNormalVector);
            let observedColor = light.calculateObservedColor(color);
            observedColor = observedColor.multiplyByNumber(angleBrightness);
            colorArray.push(observedColor);
        }

        return ColorHandler.sumAndClamp(colorArray);
    }

    protected getColorsOfTriangles(mesh : Mesh, colors : ColorHandler[]) : ColorHandler[] {
        let outColors = [];
        for (let i = 0 ;i < mesh.numTriangles; i++) {
            const triangle = mesh.getTriangle(i);
            // need to calculate color of triangle before projection.
            const col = (this.getColorOfTriangle(mesh,triangle, colors[i]));
            outColors.push(col);
        }

        return outColors;

    }
    protected finalLightPosition(light : Light) : Light {
        let pos = this.camera.putCameraAtCenterOfPointCoordinateSystem(light.position);
        pos = this.projectIndividualPoint(pos);
        pos = this.pointToCanvas(pos);
        let l = light.copy();
        l.position = pos;
        
        return l;
    }
    private getCameraSpaceMesh(entity : Entity) : Mesh {
        entity = entity.copy();
        let mesh = entity.worldSpaceMesh;
        
        return this.camera.putCameraAtCenterOfMeshCoordinateSystem(mesh);

    }
    private graphEntity (entity : Entity) : void{
        
        let mesh = this.getCameraSpaceMesh(entity);
        let triangleColors = this.getColorsOfTriangles(mesh,entity.triangleColors);

        let colorMap = mesh.mapTrianglesToAnyObject(triangleColors);
        
        if (!this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) mesh = this.backFaceCulling_Normal(mesh);
        
        mesh= this.applyProjection(mesh);
        if (this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) {
            mesh = this.backFaceCulling_WindingOrder(mesh);
        }
        let colors = mesh.findAnyObjectFromMap(colorMap);
        
        mesh = this.meshToCanvas(mesh);
        
        if (this.renParam.doVertices) this.graphVertices(mesh);
        if (this.renParam.doTriangles) this.graphTriangles(mesh,colors);
        
        
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
        return new Vector(vector.x,vector.y,this.camera.focalDistance);
    }
    private perspectiveProjectIndividualVector(vector : Vector) : Vector{
        const ratio = this.camera.focalDistance/vector.z;
        let x = vector.x * ratio;
        let y= vector.y * ratio;
            
        let z = vector.z;
        return new Vector(x,y,z);
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