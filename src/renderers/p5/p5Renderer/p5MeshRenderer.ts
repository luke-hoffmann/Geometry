import { MeshRenderer } from "../../../interface/MeshRenderer.js";
import {Mesh } from "../../../geometry/Mesh.js";
import { Camera } from "../../../camera/Camera.js";
import { Vector } from "../../../geometry/Vector.js";
import { Field } from "../../../geometry/Field.js";
import { Triangle } from "../../../geometry/Triangle.js";
import { Line } from "../../../geometry/Line.js";
import type { Light } from "../../../geometry/Light.js";
import { RenderParameters } from "../../../interface/RenderParameters.js";
import type p5 from "p5";
import { NormalVector } from "../../../geometry/NormalVector.js";
export class p5MeshRenderer extends MeshRenderer  {
    #graphicsBuffer : p5.Graphics;
    #p5 : p5;
    constructor(mesh : Mesh,screenSize : Vector ,camera: Camera,lights : Light[],renderParameters : RenderParameters,p : p5) {
        super(mesh,camera,lights,renderParameters);
        p.createCanvas(screenSize.x,screenSize.y);
        this.#p5 = p;
        this.#graphicsBuffer = p.createGraphics(screenSize.x,screenSize.y);
    }
    preWork() {
        this.#graphicsBuffer.clear();
        this.#graphicsBuffer.background(140);
    }
    postWork(){
        this.#p5.image(this.#graphicsBuffer,0,0);
    }
    /**
     * Important that this function is placed inside the native p5.js draw() function.
     * 
     * 
    **/
    
    graph (){
        this.preWork()

        let mesh = this.mesh.copy();

        mesh = this.camera.putCameraAtCenterOfMeshCoordinateSystem(mesh)
        if (this.renderParameters.doBackFaceCulling) mesh = this.backFaceCulling(mesh);
        
        mesh= this.applyProjection(mesh);
        mesh = this.meshToCanvas(mesh);

        if (this.renderParameters.doVertices) this.graphVertices(mesh);
        if (this.renderParameters.doTriangles) this.graphTriangles(mesh,this.#p5.color(0));

        
        this.postWork();
    }

    
    orthographicProjectIndividualVector(vector : Vector): Vector {
        return new Vector(vector.x,vector.y,this.camera.focalDistance);
    }
    perspectiveProjectIndividualVector(vector : Vector) : Vector{
        const ratio = this.camera.focalDistance/vector.z;
        let x = vector.x * ratio;
        let y= vector.y * ratio;
            
        let z = this.camera.focalDistance;
        return new Vector(x,y,z);
    }

    perspectiveProjectNormalVectorIntoLine(normalVector : NormalVector,length : number) : Line{
        let p1 = this.perspectiveProjectIndividualVector(normalVector.position);
        let p2 = this.perspectiveProjectIndividualVector(Vector.add(Vector.scalarMult(normalVector.direction,length),normalVector.position));
        return new Line(p1,p2);
    } 
    perspectiveProjectNormalVectorsIntoLines(normalVectors : NormalVector[],length : number) : Line[]{
        let lines = [];
        for (const v of normalVectors) {
            lines.push(this.perspectiveProjectNormalVectorIntoLine(v,length));
        }
        return lines;
    }
    
    applyProjection(mesh : Mesh) : Mesh{
    
        let newMesh = mesh.copy();
        let projectedArray = [];
        for (let i =0 ; i < newMesh.numPoints(); i++) {
            let pV;
            const v = newMesh.getVertex(i);
            if (this.renderParameters.isPerspective) {
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
    linesToCanvas(lines : Line[]) {
        let canvasLines = [];
        for (const line of lines) {
            canvasLines.push(new Line(this.calculateCanvasPos(line.p1),this.calculateCanvasPos(line.p2)));
        }
        return canvasLines;
    }
    meshToCanvas(mesh : Mesh) : Mesh{
        let newMesh = mesh.copy();
        let canvasArray = [];
        for (let i =0; i < newMesh.numPoints(); i++) {
            canvasArray.push(this.calculateCanvasPos(mesh.getVertex(i)));
        }

        mesh.vertices = new Field(canvasArray);
        return mesh;
    }
    calculateCanvasPos(meshPos : Vector) {
        return Vector.add(new Vector(this.#graphicsBuffer.width/2,this.#graphicsBuffer.height/2,0),meshPos);
    }
    graphVertices(mesh : Mesh)  : void{
        
        for (let i =0; i < mesh.numPoints(); i++) {
            this.graphVertex(mesh.getVertex(i),3);
        }
        
    }
    
    graphVertex(vertex : Vector,size : number){
        this.#graphicsBuffer.stroke(0);
        this.#graphicsBuffer.fill(0);
        this.#graphicsBuffer.circle(vertex.x,vertex.y,size);
    }
    graphVisibleVertex(vertex : Vector,size : number){
        if (this.camera.isVertexVisible(vertex)) this.graphVertex(vertex,size);
    }
    graphVisibleVertices(mesh : Mesh,size : number) {
        for (let i =0; i < this.mesh.numPoints(); i++) {
            this.graphVisibleVertex(mesh.getVertex(i),size);
        }
    }


    graphTriangle(mesh : Mesh,triangle : Triangle){

        let p1 = mesh.getVertex(triangle.getVerticeReference(0));
        let p2 = mesh.getVertex(triangle.getVerticeReference(1));
        let p3 = mesh.getVertex(triangle.getVerticeReference(2));
        
        this.#graphicsBuffer.strokeJoin(this.#p5.ROUND);
        this.#graphicsBuffer.noFill();
        this.#graphicsBuffer.triangle(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
    }
    graphTriangles(mesh : Mesh,color : p5.Color){
        this.#graphicsBuffer.stroke(color);
        for (let i = 0 ;i < mesh.numTriangles(); i++) {
            
            this.graphTriangle(mesh,mesh.getTriangle(i));

            continue;
            
            
        }

    }

    graphLines(lines : Line[],color : p5.Color) : void{
        for (const line of lines) {
            this.graphLine(line,color);
        }
    }
    graphLine(line : Line,color : p5.Color) : void {
        this.graphBetweenTwoPoints(line.p1,line.p2,color)
    }
    graphBetweenTwoPoints(p1 : Vector,p2 : Vector,color : p5.Color) : void {
        this.#graphicsBuffer.stroke(color);
        this.#graphicsBuffer.line(p1.x,p1.y,p2.x,p2.y);
    }

    copy() {
        //return new p5MeshRenderer(this.mesh.copy,this.)
    }
}

/*
if (typeof window !== "undefined") {
    window.p5MeshRenderer  = p5MeshRenderer;
}

*/