import { Renderer } from "../interface/Renderer.js";
import {Mesh } from "../geometry/Mesh.js";
import { Camera } from "../camera/Camera.js";
import { Vector } from "../geometry/Vector.js";
import { Field } from "../geometry/Field.js";
import { Triangle } from "../geometry/Triangle.js";
import { Line } from "../geometry/Line.js";
import { RenderParameters } from "../interface/RenderParameters.js";
import type p5 from "p5";
import { Scene } from "../interface/Scene.js";
import { NormalVector } from "../geometry/NormalVector.js";
import { ColorHandler } from "colorhandler";
import { Light, Positionable } from "../geometry/light/Light.js";
export class p5Renderer extends Renderer  {
    #graphicsBuffer : p5.Graphics;
    #p5 : p5;
    constructor(scene : Scene, screenSize : Vector ,camera: Camera,renderParameters : RenderParameters,p : p5) {
        super(scene,camera,renderParameters);
        p.createCanvas(screenSize.x,screenSize.y);
        this.#p5 = p;
        this.#graphicsBuffer = p.createGraphics(screenSize.x,screenSize.y);
    }
    protected preWork() {
        this.#graphicsBuffer.clear();
        this.#graphicsBuffer.background(0);
    }
    protected postWork(){
        this.#p5.image(this.#graphicsBuffer,0,0);
    }
    
    protected meshToCanvas(mesh : Mesh) : Mesh{
        let newMesh = mesh.copy();
        let canvasArray = [];
        for (let i =0; i < newMesh.numPoints; i++) {
            canvasArray.push(this.pointToCanvas(mesh.getVertex(i)));
        }

        mesh.vertices = new Field(canvasArray);
        return mesh;
    }
    protected pointToCanvas(point : Vector) : Vector {
        return (this.calculateCanvasPos(point));
    }
    private calculateCanvasPos(meshPos : Vector) {
        return Vector.add(new Vector(this.#graphicsBuffer.width/2,this.#graphicsBuffer.height/2,0),meshPos);
    }
    

    



    
    private linesToCanvas(lines : Line[]) {
        let canvasLines = [];
        for (const line of lines) {
            canvasLines.push(new Line(this.calculateCanvasPos(line.p1),this.calculateCanvasPos(line.p2)));
        }
        return canvasLines;
    }
   
    protected graphVertices(mesh : Mesh)  : void{
        for (let i =0; i < mesh.numPoints; i++) {
            this.graphVertex(mesh.getVertex(i),new ColorHandler(0,0,0),3);
        }
        
    }
    protected graphLight<L extends Light & Positionable> (light : L) : void{
        let position = this.finalLightPosition(light);
        this.graphVertex_noStroke(position, light.color.multiplyByNumber(light.brightness), 30);
    }
    private graphVertex_noStroke(vertex : Vector, color : ColorHandler, size : number) : void {
        this.#graphicsBuffer.noStroke();
        this.#graphicsBuffer.fill(this.convertColorHandlerToP5(color));
        this.graphVertex(vertex,color,size);
    }
    private graphVertex(vertex : Vector,color : ColorHandler, size : number){
        this.#graphicsBuffer.circle(vertex.x,vertex.y,size);
    }
    
    


    private graphTriangle(mesh : Mesh,triangle : Triangle){

        let p1 = mesh.getVertex(triangle.getVerticeReference(0));
        let p2 = mesh.getVertex(triangle.getVerticeReference(1));
        let p3 = mesh.getVertex(triangle.getVerticeReference(2));
        this.#graphicsBuffer.strokeJoin(this.#p5.ROUND);
        this.#graphicsBuffer.stroke(this.#p5.color(0));
        this.#graphicsBuffer.triangle(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
    }
    protected graphTriangles(mesh : Mesh, triangleColors : ColorHandler[]){
        //this.#graphicsBuffer.stroke(this.#p5.color(0));
        for (let i = 0 ;i < mesh.numTriangles; i++) {
            const triangle = mesh.getTriangle(i);
            
            this.#graphicsBuffer.fill(this.convertColorHandlerToP5(triangleColors[i]));
            
            
            this.graphTriangle(mesh,triangle);

            continue;
            
            
        }

    }

    private graphLines(lines : Line[],color : p5.Color) : void{
        for (const line of lines) {
            this.graphLine(line,color);
        }
    }
    private graphLine(line : Line,color : p5.Color) : void {
        this.graphBetweenTwoPoints(line.p1,line.p2,color)
    }
    private graphBetweenTwoPoints(p1 : Vector,p2 : Vector,color : p5.Color) : void {
        this.#graphicsBuffer.stroke(color);
        this.#graphicsBuffer.line(p1.x,p1.y,p2.x,p2.y);
    }
    private convertColorHandlerToP5(color : ColorHandler) : p5.Color {
        return this.#p5.color(color.red,color.green,color.blue);
    }
    protected graphNormalVectors(mesh : Mesh, normalVectors : NormalVector[],length : number) : void{
        const normalLines = this.projectNormalVectorsIntoLines(normalVectors,length);
        const canvasLines = this.linesToCanvas(normalLines);
        this.graphLines(canvasLines , this.#p5.color(255));
    }
    copy() {
        //return new p5MeshRenderer(this.mesh.copy,this.)
    }
}


