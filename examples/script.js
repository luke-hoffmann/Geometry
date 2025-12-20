let field = new geometry.Field([]);
field.generateRandomPointsInSphere(200,200)
let mesh = geometry.MeshGenerator.generateConvexMesh(field,310)

let entity = new geometry.Entity(mesh, new geometry.PhysicsBody(new geometry.Vector(0,0,0)));
let entity2 = new geometry.Entity(mesh, new geometry.PhysicsBody(new geometry.Vector(1000,0,0)));

let lights = [new geometry.Light(new colorhandler.ColorHandler(255,0,0))];
console.log(lights)
let renderer;
let cameraPB = new geometry.PhysicsBody(new geometry.Vector(0,0,0))
let camera = new geometry.Camera(cameraPB,new geometry.Vector(0,0,1),90,400,0);

let cameraMover = new geometry.CameraMover(0.1);
let screenSize = new geometry.Vector(800,400);

let scene = new geometry.Scene([entity,entity2],[]);
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
    renderer.graph();
    const radius = 500;
    renderer.camera = cameraMover.rotateCameraAroundPointAtYAbove(renderer.camera,new geometry.Vector(300,0,0),radius,1050,0.01);
  };
};

let myp5 = new p5(s);

