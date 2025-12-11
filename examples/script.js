import { p5MeshRenderer } from "../dist/renderers/p5/p5Renderer/p5Meshrenderer.js";
import { Mesh } from "../dist/geometry/Mesh.js";
import { Field } from "../dist/geometry/Field.js";
import { Camera } from "../dist/camera/Camera.js";
import { Vector } from "../dist/geometry/Vector.js";
import { RenderParameters } from "../dist/interface/RenderParameters.js";
import { p5CameraMover } from "../dist/renderers/p5/p5Renderer/p5CameraMover.js";
import { PhysicsBody } from "../dist/geometry/PhysicsBody.js";

let mesh = Mesh.generateConvexMesh(Field.generateRandomFieldInSphere(200,200),100);

let renderer;
let canvas;
let camera = new Camera(new PhysicsBody(new Vector(0,0,0)),new Vector(0,0,1),90,400,0); 
let graphicsBuffer;
let cameraMover = new p5CameraMover(0.1);
let screenSize = new Vector(800,400);
let newVector = new Vector(0,0,0);
function setup(){
    
    renderer = new p5MeshRenderer(mesh,screenSize,camera,[], new RenderParameters({
        doVertices: true,
        isPerspective:true,
        doBackFaceCulling:true
    }));
}
let i =0;
function draw() {

    renderer.graph();
    renderer.camera = cameraMover.rotateCameraAroundPointOnXZPlane(renderer.camera,new Vector(0,0,0),500,0.01);
    if (i==2 ) noLoop();
    //i++;
}


window.setup = setup;
window.draw = draw;