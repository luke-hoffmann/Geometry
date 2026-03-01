let entities = [];
let pos = new geometry.PhysicsBody(new geometry.Vector(0,0,0));
let entity = geometry.Entity.randomConvexEntityWithColors(700,100, pos,new colorhandler.ColorHandler(255,255,255),new colorhandler.ColorHandler(255,255,255),false);
entities.push(entity);
pos = new geometry.PhysicsBody(new geometry.Vector(2000,0,0));
entity = geometry.Entity.randomConvexEntityWithColors(300,200, pos,new colorhandler.ColorHandler(255,255,255),new colorhandler.ColorHandler(255,255,255), false);
entities.push(entity);

let lights = [];
lights.push(new geometry.PointLight(new colorhandler.ColorHandler(0,255,0),1000000, new geometry.Vector(0,0,1000),100));
//lights.push(new geometry.PointLight(new colorhandler.ColorHandler(255,0,0),1000, new geometry.Vector(0,1000,0)));
//lights.push(new geometry.PointLight(new colorhandler.ColorHandler(0,0,255),1000, new geometry.Vector(1000,0,0)));
let renderer;
let cameraPB = new geometry.PhysicsBody(new geometry.Vector(0,0,-1200))
let camera = new geometry.Camera(cameraPB,new geometry.Vector(0,0,1),90,400,0);

let cameraMover = new geometry.CameraMover(new geometry.Vector(0,0,0),new geometry.Vector(0,0,0),new geometry.Vector(0,0,0));
let cameraSpotTracker = new geometry.CameraSpotTracker(new geometry.Vector(1000,0,0), 1000,0,0);
let isPointerLocked = false;

let screenSize = new geometry.Vector(1400,800);
let i =0;
let scene = new geometry.Scene(entities,lights);
const s = ( sketch ) => {
  sketch.setup = () => {
    renderer = new geometry.p5Renderer(scene,screenSize,camera, new geometry.RenderParameters({
      doVertices: false,
      doTriangles: true,
      isPerspective:true,
      doBackFaceCulling:true,
      pointRadius: 3,
      isWindingOrderBackFaceCulling: true,
      doNormalVectors: false,
      normalVectorLength: 40,
      doOutline : false
    }),sketch);

  };


  sketch.draw = () => {
    i+=0.005;
    renderer.graph();


    let input = new geometry.KeyboardInput();
    input.updateLeftRightUpDown(
      sketch.keyIsDown(sketch.LEFT_ARROW)  || sketch.keyIsDown(65), // A
      sketch.keyIsDown(sketch.RIGHT_ARROW) || sketch.keyIsDown(68), // D
      sketch.keyIsDown(sketch.UP_ARROW)    || sketch.keyIsDown(87), // W
      sketch.keyIsDown(sketch.DOWN_ARROW)  || sketch.keyIsDown(83)  // S
  );
  input.updateControlSpace(sketch.keyIsDown(32),sketch.keyIsDown(17));
    cameraMover.keyboardInputs(input);


    if (isPointerLocked) {
      cameraMover.mouseInputRotate(sketch.movedX,sketch.movedY);
    } else if (sketch.mouseIsPressed) {
      cameraMover.mouseInputRotate(sketch.mouseX-sketch.pmouseX,sketch.mouseY-sketch.pmouseY);
    }


    renderer.camera = cameraMover.update(renderer.camera);


    const light_pos = new geometry.Vector(1000, Math.sin(i)*2000,0);
    renderer.setSceneLightPos(light_pos,0);

  };
  sketch.mouseWheel = (e)=> {
    let dir = 1;
    if (e.delta < 0) {
      dir = -1
    } 
    cameraSpotTracker.changeRadius(30 * dir);
  }
  sketch.doubleClicked = ()=> {
    if (isPointerLocked) {
      sketch.exitPointerLock();
      isPointerLocked = !isPointerLocked;
      return
    }
    sketch.requestPointerLock();
    isPointerLocked = !isPointerLocked;
  }
  
};

let myp5 = new p5(s);

