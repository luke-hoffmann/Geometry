let pos = new geometry.PhysicsBody(new geometry.Vector(0,0,0));
let entity = geometry.Entity.randomConvexEntityWithColors(700,100, pos,new colorhandler.ColorHandler(200,200,0),new colorhandler.ColorHandler(140,190,120));
pos = new geometry.PhysicsBody(new geometry.Vector(2000,0,0));
let entity2 = geometry.Entity.randomConvexEntityWithColors(250,200, pos,new colorhandler.ColorHandler(100,50,140),new colorhandler.ColorHandler(60,100,120));

let lights = [new geometry.Light(new colorhandler.ColorHandler(255,255,255),new geometry.Vector(0,10000,0),.6)];
lights.push(new geometry.Light(new colorhandler.ColorHandler(255,255,255),new geometry.Vector(0,0,100000),.6));
lights.push(new geometry.Light(new colorhandler.ColorHandler(255,255,255),new geometry.Vector(10000,0,0),.6));
let renderer;
let cameraPB = new geometry.PhysicsBody(new geometry.Vector(0,0,-2000))
let camera = new geometry.Camera(cameraPB,new geometry.Vector(0,0,1),90,400,0);

let cameraMover = new geometry.CameraMover(0.1);
let screenSize = new geometry.Vector(1400,800);
let i =0;
let scene = new geometry.Scene([entity,entity2],lights);
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
      normalVectorLength: 40
    }),sketch);

  };


  sketch.draw = () => {
    i+=0.1;
    renderer.graph();
    const radius = 2000;
    

    renderer.camera = cameraMover.rotateCameraAroundPointAtYAbove(renderer.camera,new geometry.Vector(1000,0,0),radius,0,0.01);
  };
};

let myp5 = new p5(s);

