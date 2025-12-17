import { ColorHandler } from 'colorhandler';
import p5 from 'p5';

declare class Vector {
    #private;
    constructor(x: number, y: number, z: number);
    get x(): number;
    get y(): number;
    get z(): number;
    static zero(): Vector;
    static isVectorEqual(v1: Vector, v2: Vector): boolean;
    static unitVector(v: Vector): Vector;
    static upVector(): Vector;
    static generateVectorInSphere(mag: number): Vector;
    static magnitude(v: Vector): number;
    magnitude(): number;
    static distanceBetweenVectors(v1: Vector, v2: Vector): number;
    static lerp(p1: number, p2: number, t: number): number;
    static lerpVector(v1: Vector, v2: Vector, t: number): Vector;
    static normalize(v: Vector): Vector;
    static crossProduct(v1: Vector, v2: Vector): Vector;
    static dotProduct(v1: Vector, v2: Vector): number;
    static sub(v1: Vector, v2: Vector): Vector;
    static add(v1: Vector, v2: Vector): Vector;
    static scalarMult(v: Vector, c: number): Vector;
    static rotateVector(v: Vector, xRotate: number, yRotate: number, zRotate: number): Vector;
    static rotateAroundX(v: Vector, theta: number): Vector;
    static rotateAroundY(v: Vector, theta: number): Vector;
    static rotateAroundZ(v: Vector, theta: number): Vector;
    static rotate2DVector(v: Vector, theta: number): Vector;
    isDotProductLEThanX(vector: Vector, x: number): boolean;
    copy(): Vector;
}

declare class Triangle {
    private verticeReferences;
    constructor(verticeReferences: number[]);
    getVerticeRef(x: number): number;
    doesUpspaceContain(field: Field, point: number): boolean;
    computeCentroid(field: Field): Vector;
    static isDotProductLEThanX(v1: Vector, v2: Vector, x: number): boolean;
    computeNormal(field: Field): Vector;
    distanceTo(field: Field, v: Vector): number;
    getFarthestPoint(field: Field, pointIndices: number[]): number;
    flipNormal(): Triangle;
    static addPointsFromTrianglesToMap(map: Map<number, number[]>, triangles: Triangle[]): void;
    static createPyramidFromBoundaryPoints(boundaryIndices: number[], point: number): Triangle[];
    copy(): Triangle;
}

declare class Line {
    #private;
    constructor(p1: Vector, p2: Vector);
    get p1(): Vector;
    get p2(): Vector;
    isEqual(line: this): boolean;
    distanceToPoint(v: Vector): number;
}

declare class Field {
    private array;
    constructor(array: Vector[]);
    getVertex(index: number): Vector;
    static generateFieldFromMatrixOfPoints(matrix: number[][]): Field;
    generateRandomPointsInSphere(radius: number, n: number): void;
    getTriangleUpspace(triangle: Triangle, indices: number[]): number[];
    getTrianglesWithPointInUpspace(triangles: Triangle[], point: number): Triangle[];
    getTriangleIndicesWithPointInUpspace(triangles: Triangle[], point: number): number[];
    getTrianglesUpspaces(triangles: Triangle[], indices: number[]): number[];
    getPointsAtIndices(field: Field, indices: number[]): Vector[];
    getAverageDistanceBetweenPointsAndTriangles(triangles: Triangle[], pointIndices: number[]): number[];
    getFarthestPointFromTriangles(triangles: Triangle[], pointIndices: number[]): number;
    getFarthestPointsFromTriangles(triangles: Triangle[], pointIndices: number[]): number[];
    getFarthestVectorFromVector(index: number): number;
    calculateLargestTriangleFromField(): Triangle;
    calculateFarthestPoint(line: Line): number;
    lowestVectorInField(): number;
    findVectorWithLowestZ(): number;
    findVectorWithHighestZ(): number;
    moveEntireField(moveQuantity: Vector): Field;
    copy(): Field;
    numPoints(): number;
}

declare class NormalVector {
    #private;
    constructor(position: Vector, direction: Vector);
    worldPositionOfDirection(): Vector;
    copy(): NormalVector;
    get position(): Vector;
    get direction(): Vector;
}

declare class Mesh {
    #private;
    constructor(vertices: Field, triangles: Triangle[]);
    calculateTriangleNormalVector(triangle: Triangle): NormalVector;
    calculateTriangleNormalVectors(): NormalVector[];
    copy(): Mesh;
    numPoints(): number;
    numTriangles(): number;
    getVertex(index: number): Vector;
    getTriangle(index: number): Triangle;
    set vertices(vertices: Field);
    set triangles(triangles: Triangle[]);
}

declare class Light {
    #private;
    constructor(color: ColorHandler, position: Vector, brightness: number);
    calculateObservedColor(color: ColorHandler): ColorHandler;
}

declare class MeshGenerator {
    private static convexHullIterativeProcess;
    static generateConvexMesh(field: Field, iterationNumber: number): Mesh;
}

declare class PhysicsBody {
    #private;
    constructor(position: Vector, velocity: Vector, acceleration: Vector, airFriction: number);
    update(deltaTime: number): void;
    get position(): Vector;
    get velocity(): Vector;
    get acceleration(): Vector;
    set position(position: Vector);
    set velocity(velocity: Vector);
    set acceleration(acceleration: Vector);
    copy(): PhysicsBody;
}

declare class Camera {
    #private;
    constructor(physicsBody: PhysicsBody, viewVector: Vector, fovAngle: number, focalDistance: number, aspectRatio: number);
    get focalDistance(): number;
    setPosition(position: Vector): void;
    putCameraAtCenterOfMeshCoordinateSystem(mesh: Mesh): Mesh;
    shiftMeshIntoCameraSpace(mesh: Mesh): Mesh;
    projectMeshOntoCameraAxis(mesh: Mesh): Mesh;
    rejectNegativeZValuesList(field: Field): boolean[];
    isVertexVisible(vertex: Vector): boolean;
    copy(): Camera;
    pointAtPoint(point: Vector): void;
    log(): void;
}

declare class CameraMover {
    private acceleration;
    constructor(acceleration: Vector);
}

declare class p5CameraMover extends CameraMover {
    private currentTheta;
    constructor(acceleration: Vector);
    rotateCameraAroundPointOnXZPlane(camera: Camera, point: Vector, radius: number, deltaTheta: number): Camera;
}

declare class RenderParameters {
    #private;
    constructor(doBackFaceCulling: boolean, doOutline: boolean, doFill: boolean, doVertices: boolean, doNormalVectors: boolean, doShadingWithLighting: boolean, lineWidth: number, pointRadius: number, isPerspective: boolean);
    get doBackFaceCulling(): boolean;
    get doOutline(): boolean;
    get doFill(): boolean;
    get doVertices(): boolean;
    get doNormalVectors(): boolean;
    get doShadingWithLighting(): boolean;
    get lineWidth(): number;
    get pointRadius(): number;
    get isPerspective(): boolean;
}

declare class MeshRenderer {
    protected mesh: Mesh;
    protected camera: Camera;
    protected lights: Light[];
    protected renderParameters: RenderParameters;
    constructor(mesh: Mesh, camera: Camera, lights: Light[], renderParameters: RenderParameters);
    backFaceCulling(mesh: Mesh): Mesh;
}

declare class p5MeshRenderer extends MeshRenderer {
    #private;
    constructor(mesh: Mesh, screenSize: Vector, camera: Camera, lights: Light[], renderParameters: RenderParameters, p: p5);
    preWork(): void;
    postWork(): void;
    /**
     * Important that this function is placed inside the native p5.js draw() function.
     *
     *
    **/
    graph(): void;
    orthographicProjectIndividualVector(vector: Vector): Vector;
    perspectiveProjectIndividualVector(vector: Vector): Vector;
    perspectiveProjectNormalVectorIntoLine(normalVector: NormalVector, length: number): Line;
    perspectiveProjectNormalVectorsIntoLines(normalVectors: NormalVector[], length: number): Line[];
    applyProjection(mesh: Mesh): Mesh;
    linesToCanvas(lines: Line[]): Line[];
    meshToCanvas(mesh: Mesh): Mesh;
    calculateCanvasPos(meshPos: Vector): Vector;
    graphVertices(mesh: Mesh): void;
    graphVertex(vertex: Vector, size: number): void;
    graphVisibleVertex(vertex: Vector, size: number): void;
    graphVisibleVertices(mesh: Mesh, size: number): void;
    graphTriangle(mesh: Mesh, triangle: Triangle): void;
    graphTriangles(mesh: Mesh, color: p5.Color): void;
    graphLines(lines: Line[], color: p5.Color): void;
    graphLine(line: Line, color: p5.Color): void;
    graphBetweenTwoPoints(p1: Vector, p2: Vector, color: p5.Color): void;
    copy(): void;
}

declare class p5RenderParameters extends RenderParameters {
}

export { Camera, Field, Light, Mesh, MeshGenerator, PhysicsBody, Vector, p5CameraMover, p5MeshRenderer, p5RenderParameters };
