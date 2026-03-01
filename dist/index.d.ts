import { ColorHandler } from 'colorhandler';
import p5 from 'p5';

declare class Vector {
    #private;
    static readonly ZERO: Vector;
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
    static crossProduct(v1: Vector, v2: Vector): Vector;
    static dotProduct(v1: Vector, v2: Vector): number;
    static sub(v1: Vector, v2: Vector): Vector;
    static add(...vectors: Vector[]): Vector;
    static scalarMult(v: Vector, c: number): Vector;
    isDotProductLEThanX(vector: Vector, x: number): boolean;
    copy(): Vector;
    static oppositeVector(vector: Vector): Vector;
}

type TriangleInput = {
    triangleNormalVector: Vector;
    trianglePosition: Vector;
    triangleColor: ColorHandler;
    distance: number;
};
type Positionable = {
    position: Vector;
    radius: number;
};
declare abstract class Light {
    #private;
    constructor(color: ColorHandler, brightness: number);
    calculateObservedColor(color: ColorHandler, distance: number): ColorHandler;
    get color(): ColorHandler;
    get brightness(): number;
    set brightness(brightness: number);
    protected clampBrightness(value: number): number;
    abstract copy(): this;
    abstract calculateTriangleColor(triangleInput: TriangleInput): ColorHandler;
    static hasPosition(light: Light): light is Light & Positionable;
}

declare class PointLight extends Light {
    #private;
    constructor(color: ColorHandler, brightness: number, position: Vector, radius?: number);
    copy(): this;
    calculateTriangleColor(triangleInput: TriangleInput): ColorHandler;
    get radius(): number;
    set radius(radius: number);
    get position(): Vector;
    set position(position: Vector);
}

declare class DirectionalLight extends Light {
    #private;
    constructor(color: ColorHandler, brightness: number, directionOfLight: Vector);
    protected clampBrightness(brightness: number): number;
    set direction(direction: Vector);
    get direction(): Vector;
    copy(): this;
    calculateTriangleColor(triangleInput: TriangleInput): ColorHandler;
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
    private getAverageDistanceBetweenPointsAndTriangles;
    getFarthestPointFromTriangles(triangles: Triangle[], pointIndices: number[]): number;
    getFarthestPointFromTriangles_Fast(triangles: Triangle[], pointIndices: number[]): number;
    private getFarthestPointsFromTriangles;
    private getFarthestVectorFromVector;
    calculateLargestTriangleFromField(): Triangle;
    private calculateFarthestPoint;
    private lowestVectorInField;
    moveEntireField(moveQuantity: Vector): Field;
    copy(): Field;
    addVertex(v: Vector): Field;
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
    private copyTriangles;
    get vertices(): Field;
    get triangles(): Triangle[];
    get numPoints(): number;
    get numTriangles(): number;
    get triangleCentroids(): Vector[];
    get triangleNormalVectors(): Vector[];
    getVertex(index: number): Vector;
    getTriangle(index: number): Triangle;
    set vertices(vertices: Field);
    set triangles(triangles: Triangle[]);
}

declare class MeshGenerator {
    private static convexHullIterativeProcess;
    private static addTrianglesToTrianglesArray;
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
    constructor(mesh: Mesh, physicsBody: PhysicsBody, triangleColors: ColorHandler[], isIndifferentToLight: boolean);
    static randomConvexEntityWithColors(radius: number, n: number, physicsBody: PhysicsBody, c1: ColorHandler, c2: ColorHandler, isIndifferentToLight: boolean): Entity;
    copy(): Entity;
    get triangleColors(): ColorHandler[];
    get worldSpaceMesh(): Mesh;
    set physicsBody(physicsBody: PhysicsBody);
    get physicsBody(): PhysicsBody;
    get mesh(): Mesh;
    get isIndifferentToLight(): boolean;
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
    pointInDirection(direction: Vector): void;
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

declare class KeyboardInput {
    #private;
    constructor();
    get up(): boolean;
    get down(): boolean;
    get left(): boolean;
    get right(): boolean;
    get space(): boolean;
    get control(): boolean;
    set up(value: boolean);
    set down(value: boolean);
    set left(value: boolean);
    set right(value: boolean);
    set space(value: boolean);
    set control(value: boolean);
    updateLeftRightUpDown(left: boolean, right: boolean, up: boolean, down: boolean): void;
    updateControlSpace(control: boolean, space: boolean): void;
    movementInCertainCoordinateSystem(forward: Vector, up: Vector, right: Vector): Vector;
}

declare class CameraMover {
    #private;
    constructor(position: Vector, velocity: Vector, acceleration: Vector, scale?: number);
    set vTheta(theta: number);
    set hTheta(theta: number);
    get vTheta(): number;
    get hTheta(): number;
    set viewVector(v: Vector);
    private updateViewDirectionFromAngles;
    private updateAnglesFromViewDirection;
    private updateKinematics;
    update(camera: Camera): Camera;
    keyboardInputs(keyboardInput: KeyboardInput): void;
    mouseInputRotate(xChange: number, yChange: number): void;
}

declare class CameraSpotTracker {
    #private;
    constructor(trackSpot: Vector, radius: number, horizontalTheta: number, verticalTheta: number);
    update(camera: Camera): Camera;
    changeRadius(deltaRadius: number): void;
    mouseInputRotate(pmouseX: number, pmouseY: number, mouseX: number, mouseY: number): void;
    get radius(): number;
}

declare class Line {
    #private;
    constructor(p1: Vector, p2: Vector);
    get p1(): Vector;
    get p2(): Vector;
    isEqual(line: this): boolean;
    distanceToPoint(v: Vector): number;
}

declare class RenderParameters {
    #private;
    constructor({ doBackFaceCulling, doOutline, doFill, doVertices, doShadingWithLighting, lineWidth, pointRadius, isPerspective, doTriangles, isWindingOrderBackFaceCulling, doNormalVectors, normalVectorLength, showLights, doEntityHooks }?: Partial<{
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
        doNormalVectors: boolean;
        normalVectorLength: number;
        showLights: boolean;
        doEntityHooks: boolean;
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
    get doNormalVectors(): boolean;
    get normalVectorLength(): number;
    get showLights(): boolean;
    get doEntityHooks(): boolean;
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
    set doNormalVectors(v: boolean);
    set normalVectorLength(v: number);
    set showLights(v: boolean);
    set doEntityHooks(v: boolean);
}

type EntityElement = {
    z: number;
    type: "entity";
    ref: number;
};
type LightElement = {
    z: number;
    type: "light";
    ref: number;
    light: Light;
    finalLightPosition: {
        canvasPosition: Vector;
        radius: number;
    };
};
type Element = EntityElement | LightElement;
declare abstract class Renderer {
    protected camera: Camera;
    protected scene: Scene;
    protected renParam: RenderParameters;
    constructor(scene: Scene, camera: Camera, renderParameters: RenderParameters);
    protected entityGraphBeforeChangesHook(entity: Entity): void;
    protected entityGraphCameraSpaceHook(entity: Entity): void;
    protected entityGraphProjectedSpaceHook(entity: Entity): void;
    protected entityGraphBackFaceCulledSpaceHook(entity: Entity): void;
    protected mainGraphFunctionalPreWork(): void;
    protected mainGraphFunctionalPostWork(): void;
    protected abstract mainGraphRenderingPreWork(): void;
    protected abstract mainGraphRenderingPostWork(): void;
    protected abstract meshToCanvas(mesh: Mesh): Mesh;
    protected abstract graphNormalVectors(mesh: Mesh, normalVectors: NormalVector[], length: number): void;
    protected abstract graphVertices(mesh: Mesh): void;
    protected abstract graphTriangles(mesh: Mesh, triangleColors: ColorHandler[]): void;
    protected abstract pointToCanvas(point: Vector): Vector;
    protected abstract graphLight(light: LightElement): void;
    setSceneLightPos(pos: Vector, i: number): void;
    protected getSceneInZOrder(): Element[];
    graph(): void;
    private getColorOfTriangle;
    private getColorOfTrianglesFromLight;
    protected getColorsOfTrianglesFromAllLights(mesh: Mesh, colors: ColorHandler[], meshCentroids: Vector[], meshNormalVectors: Vector[], positionOfMesh: Vector): ColorHandler[];
    protected finalLightPosition<L extends Light & Positionable>(light: L): {
        canvasPosition: Vector;
        radius: number;
    };
    protected getCameraSpaceMesh(entity: Entity): Mesh;
    protected graphEntity(entity: Entity): void;
    private isAnyMeshPointBehindCamera;
    private generateMeshWithAppropriateColorsWithOnlyVisiblePartsOfTriangles;
    private generateNewMeshWithAppropriateColorsWithNewVisibleTriangleFromOneTriangleWithTwoHiddenVertices;
    private generateNewMeshWithAppropriateColorsWithTwoNewVisibleTrianglesFromOneTriangleWithHiddenVertex;
    private findPointBetweenTwoPointsAtZeroZ;
    private whichPointsInMap;
    private getHiddenPoints;
    protected backFaceCulling_Normal(mesh: Mesh): Mesh;
    protected backFaceCulling_WindingOrder(mesh: Mesh): Mesh;
    private orthographicProjectIndividualVector;
    private perspectiveProjectIndividualVector;
    private orthographicProjectNormalVectorIntoLine;
    private perspectiveProjectNormalVectorIntoLine;
    protected projectNormalVectorsIntoLines(normalVectors: NormalVector[], length: number): Line[];
    protected applyProjection(mesh: Mesh): Mesh;
    private projectIndividualPoint;
}

declare class p5Renderer extends Renderer {
    #private;
    protected p5: p5;
    constructor(scene: Scene, screenSize: Vector, camera: Camera, renderParameters: RenderParameters, p: p5);
    protected mainGraphRenderingPreWork(): void;
    protected mainGraphRenderingPostWork(): void;
    protected meshToCanvas(mesh: Mesh): Mesh;
    protected pointToCanvas(point: Vector): Vector;
    private calculateCanvasPos;
    private linesToCanvas;
    protected graphVertices(mesh: Mesh): void;
    protected graphLight(light: LightElement): void;
    private graphVertex_noStroke;
    private graphVertex;
    private graphTriangle;
    protected graphTriangles(mesh: Mesh, triangleColors: ColorHandler[]): void;
    private graphLines;
    private graphLine;
    private graphBetweenTwoPoints;
    private convertColorHandlerToP5;
    protected graphNormalVectors(mesh: Mesh, normalVectors: NormalVector[], length: number): void;
    copy(): void;
}

export { Camera, CameraMover, CameraSpotTracker, DirectionalLight, Entity, Field, KeyboardInput, Line, Mesh, MeshGenerator, NormalVector, PhysicsBody, PointLight, RenderParameters, Scene, Vector, p5Renderer };
