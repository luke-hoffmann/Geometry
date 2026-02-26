let pos = new geometry.PhysicsBody(new geometry.Vector(0,0,0));
let entity = geometry.Entity.randomConvexEntityWithColors(700,100, pos,new colorhandler.ColorHandler(255,255,255),new colorhandler.ColorHandler(255,255,255),false);
pos = new geometry.PhysicsBody(new geometry.Vector(2000,0,0));
let entity2 = geometry.Entity.randomConvexEntityWithColors(300,200, pos,new colorhandler.ColorHandler(200,200,0),new colorhandler.ColorHandler(140,190,120), false);


let lights = [new geometry.Light(new colorhandler.ColorHandler(0,0,255),new geometry.Vector(0,0,-1000),1)];
lights.push(new geometry.Light(new colorhandler.ColorHandler(0,255,0),new geometry.Vector(0,0,1000),1));
lights.push(new geometry.Light(new colorhandler.ColorHandler(255,2,0),new geometry.Vector(0,1000,0),1));
let renderer;
let cameraPB = new geometry.PhysicsBody(new geometry.Vector(0,0,-1200))
let camera = new geometry.Camera(cameraPB,new geometry.Vector(0,0,1),90,400,0);
camera.pointAtPoint(new geometry.Vector(0,0,0));
let cameraMover = new geometry.CameraMover(0.1);

let cameraSpotTracker = new geometry.CameraSpotTracker(new geometry.Vector(0,0,0), 1000,0,0);


let screenSize = new geometry.Vector(1400,800);
let i =0;
let scene = new geometry.Scene([entity, entity2],lights);
const s = ( sketch ) => {
  sketch.setup = () => {
    renderer = new geometry.p5Renderer(scene,screenSize,camera, new geometry.RenderParameters({
      doVertices: false,
      doTriangles: true,
      isPerspective:true,
      doBackFaceCulling:true,
      pointRadius: 3,
      isWindingOrderBackFaceCulling: true,
      doNormalVectors: true,
      normalVectorLength: 40
    }),sketch);

  };


  sketch.draw = () => {
    i+=0.005;
    renderer.graph();
    if (sketch.mouseIsPressed) {

      cameraSpotTracker.mouseInputRotate(sketch.pmouseX,sketch.pmouseY,sketch.mouseX,sketch.mouseY);
    }
    cameraSpotTracker.update(renderer.camera);
  };
  sketch.mouseWheel = (e)=> {
    let dir = 1;
    if (e.delta < 0) {
      dir = -1
    } 
    cameraSpotTracker.changeRadius(30 * dir);
  }
};

let myp5 = new p5(s);

