let entities = [];
let pos = new geometry.PhysicsBody(new geometry.Vector(0,0,0));
let entity = geometry.Entity.entityWithColorsFromMesh(geometry.MeshGenerator.generateEvenSphereMesh(300,100), pos,new colorhandler.ColorHandler(100,140,180),new colorhandler.ColorHandler(130,170,200),true);
entities.push(entity);
// pos = new geometry.PhysicsBody(new geometry.Vector(2000,0,0));
// entity = geometry.Entity.randomConvexEntityWithColors(300,200, pos,new colorhandler.ColorHandler(255,255,255),new colorhandler.ColorHandler(255,255,255), false);
//entities.push(entity);

let lights = [];
lights.push(new geometry.PointLight(new colorhandler.ColorHandler(0,0,255),1000000, new geometry.Vector(0,0,1000),100));
lights.push(new geometry.PointLight(new colorhandler.ColorHandler(255,0,0),1000000, new geometry.Vector(0,0,1000),100));
//lights.push(new geometry.DirectionalLight(new colorhandler.ColorHandler(255,0,0),1000, new geometry.Vector(0,-1,0)));
//lights.push(new geometry.DirectionalLight(new colorhandler.ColorHandler(255,0,0),1000, new geometry.Vector(0,1,0)));
//lights.push(new geometry.GlobalLight(new colorhandler.ColorHandler(255,255,0),0.3, new geometry.Vector(1000,0,0)));
let renderer;
let cameraPB = new geometry.PhysicsBody(new geometry.Vector(0,0,-1200))
let camera = new geometry.Camera(cameraPB,new geometry.Vector(0,0,1),90,400,0);

let cameraMover = new geometry.CameraMover(new geometry.Vector(1000,0,-2000),new geometry.Vector(0,0,1),new geometry.Vector(0,0,0),new geometry.Vector(0,0,0));
let cameraSpotTracker = new geometry.CameraSpotTracker(new geometry.Vector(1000,0,0), 1000,0,0);
let isPointerLocked = false;

let screenSize = new geometry.Vector(900,700);
let i =0;
let scene = new geometry.Scene(entities,lights);
function setup () {
  createCanvas(window.innerWidth,window.innerHeight)
  renderer = new geometry.p5Renderer(scene,screenSize,camera, new geometry.RenderParameters({
    doVertices: false,
    doTriangles: true,
    isPerspective:true,
    doBackFaceCulling:true,
    pointRadius: 3,
    isWindingOrderBackFaceCulling: true,
    doNormalVectors: false,
    normalVectorLength: 40,
    doOutline : true,
    doFill: true
  }),window);
};


function draw () {
  i+=0.005;
  clear()
  background(0);
  
  renderer.graph();
  let input = new geometry.KeyboardInput();
  input.updateLeftRightUpDown(
    keyIsDown(LEFT_ARROW)  || keyIsDown(65), // A
    keyIsDown(RIGHT_ARROW) || keyIsDown(68), // D
    keyIsDown(UP_ARROW)    || keyIsDown(87), // W
    keyIsDown(DOWN_ARROW)  || keyIsDown(83)  // S
  );
input.updateControlSpace(keyIsDown(32),keyIsDown(17));
  cameraMover.keyboardInputs(input);
  if (isPointerLocked) {
    cameraMover.mouseInputRotate(movedX,movedY);
  } else if (mouseIsPressed) {
    cameraMover.mouseInputRotate(mouseX-pmouseX,mouseY-pmouseY);
  }
  renderer.camera = cameraMover.update(renderer.camera);
  let light_pos = new geometry.Vector(1000, Math.sin(i)*1000,0);
  renderer.setSceneLightPos(light_pos,0);
  light_pos = new geometry.Vector(Math.cos(i)*1000, 0,Math.sin(i)*1000);
  renderer.setSceneLightPos(light_pos,1);
};
function mouseWheel (e) {
  let dir = 1;
  if (e.delta < 0) {
    dir = -1
  } 
  cameraSpotTracker.changeRadius(30 * dir);
}
function doubleClicked () {
  if (isPointerLocked) {
    exitPointerLock();
    isPointerLocked = !isPointerLocked;
    return
  }
  requestPointerLock();
  isPointerLocked = !isPointerLocked;
}
  

