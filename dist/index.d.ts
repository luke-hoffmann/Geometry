import { ColorHandler } from 'colorhandler';
import p5 from 'p5';

declare class Vector {
    #private;
    constructor(x: number, y: number, z: number);
    get x(): number;
    get y(): number;
    get z(): number;
    static zero(): Vector;
    set z(n: number);
    static isVectorEqual(v1: Vector, v2: Vector): boolean;
    static unitVector(v: Vector): Vector;
    static upVector(): Vector;
    static downVector(): Vector;
    static generateVectorInSphere(mag: number): Vector;
    equals(v: this): boolean;
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

declare class NormalVector {
    #private;
    constructor(position: Vector, direction: Vector);
    worldPositionOfDirection(): Vector;
    copy(): NormalVector;
    get position(): Vector;
    get direction(): Vector;
}

declare class Triangle {
    #private;
    constructor(verticeReferences: number[]);
    logReferences(): void;
    doesUpspaceContain(field: Field, point: number): boolean;
    computeCentroid(field: Field): Vector;
    static isDotProductLEThanX(v1: Vector, v2: Vector, x: number): boolean;
    computeNormal(field: Field): Vector;
    distanceTo(field: Field, v: Vector): number;
    getFarthestPoint(field: Field, pointIndices: number[]): number;
    flipNormal(): Triangle;
    getVerticeReference(i: number): number;
    static addPointsFromTrianglesToMap(map: Map<number, number[]>, triangles: Triangle[]): void;
    static createPyramidFromBoundaryPoints(boundaryIndices: number[], point: number): Triangle[];
    copy(): Triangle;
    getDistinctIdentifier(): string;
    calculateTriangleNormalVector(field: Field): NormalVector;
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
    generateRandomPointsInSphere(radius: number, n: number): void;
    getTrianglesUpspace(triangle: Triangle, indices: number[]): number[];
    getTrianglesWithPointInUpspace(triangles: Triangle[], point: number): Triangle[];
    getTriangleIndicesWithPointInUpspace(triangles: Triangle[], point: number): number[];
    getTrianglesUpspaces(triangles: Triangle[], indices: number[]): number[];
    getTrianglesUpspaces_Fast(triangles: Triangle[], indices: number[]): number[];
    getPointsAtIndices(field: Field, indices: number[]): Vector[];
    getAverageDistanceBetweenPointsAndTriangles(triangles: Triangle[], pointIndices: number[]): number[];
    getFarthestPointFromTriangles(triangles: Triangle[], pointIndices: number[]): number;
    getFarthestPointFromTriangles_Fast(triangles: Triangle[], pointIndices: number[]): number;
    getFarthestPointsFromTriangles(triangles: Triangle[], pointIndices: number[]): number[];
    getFarthestVectorFromVector(index: number): number;
    calculateLargestTriangleFromField(): Triangle;
    calculateFarthestPoint(line: Line): number;
    lowestVectorInField(): number;
    moveEntireField(moveQuantity: Vector): Field;
    copy(): Field;
    get numPoints(): number;
}

declare class Mesh {
    #private;
    constructor(vertices: Field, triangles: Triangle[]);
    calculateAverageZ(): number;
    calculateTrianglesNormalVectors(): NormalVector[];
    mapTrianglesToAnyObject<T>(objects: T[]): Map<string, T>;
    findAnyObjectFromMap<T>(map: Map<string, T>): T[];
    copy(): Mesh;
    get vertices(): Field;
    get numPoints(): number;
    get numTriangles(): number;
    getVertex(index: number): Vector;
    getTriangle(index: number): Triangle;
    set vertices(vertices: Field);
    set triangles(triangles: Triangle[]);
}

declare class Light {
    #private;
    constructor(color: ColorHandler, position: Vector, brightness: number);
    calculateObservedColor(color: ColorHandler): ColorHandler;
    get position(): Vector;
    get color(): ColorHandler;
    get brightness(): number;
    copy(): Light;
    set position(pos: Vector);
}

declare class MeshGenerator {
    private static convexHullIterativeProcess;
    static addTrianglesToTrianglesArray(trianglesArray: Triangle[], triangles: Triangle[]): Triangle[];
    static generateConvexMesh(field: Field, iterationNumber: number): Mesh;
    static generateRandomConvexMesh(radius: number, numberOfPoints: number): Mesh;
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

declare class Entity {
    #private;
    constructor(mesh: Mesh, physicsBody: PhysicsBody, triangleColors: ColorHandler[]);
    static randomConvexEntityWithColors(radius: number, n: number, physicsBody: PhysicsBody, c1: ColorHandler, c2: ColorHandler): Entity;
    copy(): Entity;
    getTriangleColor(i: number): ColorHandler;
    get triangleColors(): ColorHandler[];
    get mesh(): Mesh;
    get physicsBody(): PhysicsBody;
    get worldSpaceMesh(): Mesh;
}

declare class Camera {
    #private;
    constructor(physicsBody: PhysicsBody, viewVector: Vector, fovAngle: number, focalDistance: number, aspectRatio: number);
    get focalDistance(): number;
    get position(): Vector;
    set position(position: Vector);
    set viewVector(v: Vector);
    putCameraAtCenterOfMeshCoordinateSystem(mesh: Mesh): Mesh;
    putCameraAtCenterOfPointCoordinateSystem(point: Vector): Vector;
    private shiftWorldPointIntoCameraSpace;
    private projectWorldPointOntoCameraAxis;
    copy(): Camera;
    pointAtPoint(point: Vector): void;
}

declare class Scene {
    #private;
    constructor(entities: Entity[], lights: Light[]);
    getLight(i: number): Light;
    getEntity(i: number): Entity;
    copy(): Scene;
    get numEntities(): number;
    get numLights(): number;
    setLightPos(pos: Vector, i: number): void;
    set meshes(meshes: Entity[]);
}

declare class CameraMover {
    private acceleration;
    private currentTheta;
    constructor(acceleration: Vector);
    rotateCameraAroundPointOnXZPlane(camera: Camera, point: Vector, radius: number, deltaTheta: number): Camera;
    rotateCameraAroundPointAtYAbove(camera: Camera, point: Vector, radius: number, yAbove: number, deltaTheta: number): Camera;
}

declare class RenderParameters {
    #private;
    constructor({ doBackFaceCulling, doOutline, doFill, doVertices, doShadingWithLighting, lineWidth, pointRadius, isPerspective, doTriangles, isWindingOrderBackFaceCulling, }?: Partial<{
        doBackFaceCulling: boolean;
        doOutline: boolean;
        doFill: boolean;
        doVertices: boolean;
        doShadingWithLighting: boolean;
        lineWidth: number;
        pointRadius: number;
        isPerspective: boolean;
        doTriangles: boolean;
        isWindingOrderBackFaceCulling: boolean;
    }>);
    get doBackFaceCulling(): boolean;
    get doOutline(): boolean;
    get doFill(): boolean;
    get doVertices(): boolean;
    get doShadingWithLighting(): boolean;
    get lineWidth(): number;
    get pointRadius(): number;
    get isPerspective(): boolean;
    get doTriangles(): boolean;
    get isWindingOrderBackFaceCulling(): boolean;
    set doBackFaceCulling(v: boolean);
    set doOutline(v: boolean);
    set doFill(v: boolean);
    set doVertices(v: boolean);
    set doShadingWithLighting(v: boolean);
    set lineWidth(v: number);
    set pointRadius(v: number);
    set isPerspective(v: boolean);
    set doTriangles(v: boolean);
    set isWindingOrderBackFaceCulling(v: boolean);
}

declare abstract class Renderer {
    protected camera: Camera;
    protected scene: Scene;
    protected renParam: RenderParameters;
    constructor(scene: Scene, camera: Camera, renderParameters: RenderParameters);
    protected abstract preWork(): void;
    protected abstract meshToCanvas(mesh: Mesh): Mesh;
    protected abstract graphVertices(mesh: Mesh): void;
    protected abstract graphTriangles(mesh: Mesh, triangleColors: ColorHandler[]): void;
    protected abstract postWork(): void;
    protected abstract pointToCanvas(point: Vector): Vector;
    protected abstract graphLight(light: Light): void;
    setSceneLightPos(pos: Vector, i: number): void;
    private getSceneInZOrder;
    graph(): void;
    private getColorOfTriangle;
    protected getColorsOfTriangles(mesh: Mesh, colors: ColorHandler[]): ColorHandler[];
    protected finalLightPosition(light: Light): Light;
    private getCameraSpaceMesh;
    private graphEntity;
    protected backFaceCulling_Normal(mesh: Mesh): Mesh;
    protected backFaceCulling_WindingOrder(mesh: Mesh): Mesh;
    private orthographicProjectIndividualVector;
    private perspectiveProjectIndividualVector;
    protected applyProjection(mesh: Mesh): Mesh;
    private projectIndividualPoint;
}

declare class p5Renderer extends Renderer {
    #private;
    constructor(scene: Scene, screenSize: Vector, camera: Camera, renderParameters: RenderParameters, p: p5);
    protected preWork(): void;
    protected postWork(): void;
    protected meshToCanvas(mesh: Mesh): Mesh;
    protected pointToCanvas(point: Vector): Vector;
    private calculateCanvasPos;
    private linesToCanvas;
    protected graphVertices(mesh: Mesh): void;
    protected graphLight(light: Light): void;
    private graphVertex_noStroke;
    private graphVertex;
    private graphTriangle;
    protected graphTriangles(mesh: Mesh, triangleColors: ColorHandler[]): void;
    private graphLines;
    private graphLine;
    private graphBetweenTwoPoints;
    private convertColorHandlerToP5;
    copy(): void;
}

export { Camera, CameraMover, Entity, Field, Light, Mesh, MeshGenerator, PhysicsBody, RenderParameters, Scene, Vector, p5Renderer };
