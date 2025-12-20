let field = new geometry.Field([]);
field.generateRandomPointsInSphere(200,200)
let mesh = geometry.MeshGenerator.generateConvexMesh(field,310)
let renderer;
let camera = new geometry.Camera(new geometry.PhysicsBody(new geometry.Vector(0,0,0)),new geometry.Vector(0,0,1),90,400,0);
let cameraMover = new geometry.p5CameraMover(0.1);
let screenSize = new geometry.Vector(800,400);
let scene = new geometry.Scene([mesh],[]);
const s = ( sketch ) => {


  sketch.setup = () => {
    renderer = new geometry.p5Renderer(scene,screenSize,camera, new geometry.p5RenderParameters({
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
    renderer.camera = cameraMover.rotateCameraAroundPointOnXZPlane(renderer.camera,new geometry.Vector(0,0,0),radius,0.01);
  };
};

let myp5 = new p5(s);

