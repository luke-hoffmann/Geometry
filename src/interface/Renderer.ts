import type { Mesh } from "../geometry/Mesh.js";
import type { Camera } from "../camera/Camera.js";
import type { NormalVector } from "../geometry/NormalVector.js";
import { Field } from "../geometry/Field.js";
import { Line } from "../geometry/Line.js";
import type { RenderParameters } from "./RenderParameters.js";
import { Vector } from "../geometry/Vector.js"
import { Scene } from "./Scene.js";
import { Entity } from "../geometry/Entity.js";
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
    protected abstract graphNormalVectors(mesh : Mesh,normalVectors : NormalVector[],length: number) : void;
    protected abstract graphVertices(mesh : Mesh) : void;
    protected abstract graphTriangles (mesh : Mesh) : void;
    protected abstract postWork() : void;
    graph () : void {
        this.preWork()
        for (let i =0; i < this.scene.numEntities; i++) {
            this.graphEntity(this.scene.getEntity(i));
        }
        this.postWork();
    }
    private graphEntity(entity : Entity) : void{
        

        entity = entity.copy();

        mesh = this.camera.putCameraAtCenterOfEntityCoordinateSystem(mesh);

        if (!this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) mesh = this.backFaceCulling_Normal(mesh);
        let normalVectors;

        if (!this.renParam.isPerspective) normalVectors = mesh.calculateTriangleNormalVectors();
        mesh= this.applyProjection(mesh);
        if (this.renParam.isPerspective) normalVectors = mesh.calculateTriangleNormalVectors();
        
        
        if (this.renParam.isWindingOrderBackFaceCulling && this.renParam.doBackFaceCulling) {
            const map = mesh.mapTrianglesToNormalVectors(normalVectors!);
            mesh = this.backFaceCulling_WindingOrder(mesh);
            normalVectors = mesh.findTrianglesNormalVectorsFromMap(map);
        }


        if (this.renParam.doNormalVectors) this.graphNormalVectors(mesh, normalVectors!,this.renParam.normalVectorLength);
        

        mesh = this.meshToCanvas(mesh);
        

        if (this.renParam.doVertices) this.graphVertices(mesh);
        if (this.renParam.doTriangles) this.graphTriangles(mesh);
        
        
        
    }

    protected backFaceCulling_Normal(mesh : Mesh) : Mesh{
        let viewVector = new Vector(0,0,1);
        let visibleTriangles = [];
        let backFaceCulledMesh = mesh.copy();
        let cameraFacingTriangles = [];

        let normalVectors = backFaceCulledMesh.calculateTriangleNormalVectors();
        
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
            
        let z = this.camera.focalDistance;
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
            if (this.renParam.isPerspective) lines.push(this.perspectiveProjectNormalVectorIntoLine(v,length));
            if (!this.renParam.isPerspective) lines.push(this.orthographicProjectNormalVectorIntoLine(v,length));
        }
        return lines;
    }
    
    protected applyProjection(mesh : Mesh) : Mesh{
    
        let newMesh = mesh.copy();
        let projectedArray = [];
        for (let i =0 ; i < newMesh.numPoints; i++) {
            let pV;
            const v = newMesh.getVertex(i);
            if (this.renParam.isPerspective) {
                pV =this.perspectiveProjectIndividualVector(v);
            } else {
                pV = this.orthographicProjectIndividualVector(v);
            }

            projectedArray.push(pV);
        }
        let projectedField = new Field(projectedArray);
        newMesh.vertices = projectedField;
        return newMesh;
    }
    
}