import { MeshRenderer } from "../../../interface/MeshRenderer.js";
import { Mesh } from "../../../geometry/Mesh.js";
import { Vector } from "../../../geometry/Vector.js";
import { Field } from "../../../geometry/Field.js";
import { Line } from "../../../geometry/Line.js";
export class p5MeshRenderer extends MeshRenderer {
    constructor(mesh, screenSize, camera, lights, renderParameters, p) {
        super(mesh, camera, lights, renderParameters);
        p.createCanvas(screenSize.x, screenSize.y);
        this.graphicsBuffer = p.createGraphics(screenSize.x, screenSize.y);
    }
    /*

    doBackFaceCulling: true,
            doOutline: true,
            doFill: true,
            doVertices: false,
            doNormalVectors: false,
            doShadingWithLighting: true,
            lineWidth: 1,
            pointRadius: 3

            */
    preWork() {
        this.graphicsBuffer.clear();
        this.graphicsBuffer.background(200);
    }
    postWork() {
        image(this.graphicsBuffer, 0, 0);
    }
    /**
     * Important that this function is placed inside the native p5.js draw() function.
     *
     *
    **/
    graph() {
        this.preWork();
        let mesh = Mesh.copy(this.mesh);
        mesh = this.camera.putCameraAtCenterOfMeshCoordinateSystem(mesh);
        if (this.renderParameters.doBackFaceCulling) {
            mesh = Mesh.backFaceCulling(mesh, this.camera, this.renderParameters.isPerspective);
        }
        mesh = this.applyProjection(mesh, this.renderParameters.isPerspective);
        mesh = this.meshToCanvas(mesh);
        this.graphVertices(mesh);
        this.graphTriangles(mesh, 0);
        this.postWork();
    }
    static orthographicProjectIndividualVector(vector, camera) {
        return new Vector(vector.x, vector.y, camera.focalDistance);
    }
    static perspectiveProjectIndividualVector(vector, camera) {
        const ratio = camera.focalDistance / vector.z;
        let x = vector.x * ratio;
        let y = vector.y * ratio;
        let z = camera.focalDistance;
        return new Vector(x, y, z);
    }
    static perspectiveProjectNormalVectorIntoLine(normalVector, camera, length) {
        let p1 = p5MeshRenderer.perspectiveProjectIndividualVector(normalVector.position, camera);
        let p2 = p5MeshRenderer.perspectiveProjectIndividualVector(Vector.add(Vector.scalarMult(normalVector.direction, length), normalVector.position), camera);
        return new Line(p1, p2);
    }
    static perspectiveProjectNormalVectorsIntoLines(normalVectors, camera, length) {
        let lines = [];
        for (const v of normalVectors) {
            lines.push(p5MeshRenderer.perspectiveProjectNormalVectorIntoLine(v, camera, length));
        }
        return lines;
    }
    applyProjection(mesh, isPerspective) {
        let newMesh = Mesh.copy(mesh);
        let projectedField = new Field([]);
        for (const v of mesh.vertices.array) {
            let pV;
            if (isPerspective) {
                pV = p5MeshRenderer.perspectiveProjectIndividualVector(v, this.camera);
            }
            else {
                pV = p5MeshRenderer.orthographicProjectIndividualVector(v, this.camera);
            }
            projectedField.array.push(pV);
        }
        newMesh.vertices = projectedField;
        return newMesh;
    }
    linesToCanvas(lines) {
        let canvasLines = [];
        for (const line of lines) {
            canvasLines.push(new Line(this.calculateCanvasPos(line.p1), this.calculateCanvasPos(line.p2)));
        }
        return canvasLines;
    }
    meshToCanvas(mesh) {
        let canvasField = new Field([]);
        mesh.vertices.array.forEach(element => {
            canvasField.array.push(this.calculateCanvasPos(element));
        });
        mesh.vertices = canvasField;
        return mesh;
    }
    calculateCanvasPos(meshPos) {
        return Vector.add(new Vector(this.graphicsBuffer.width / 2, this.graphicsBuffer.height / 2, 0), meshPos);
    }
    graphVertices(mesh) {
        for (let vertex of mesh.vertices.array) {
            this.graphVertex(vertex, this.renderParameters.pointRadius);
        }
    }
    graphVerticesWithZDeterminingSize(mesh, lowestRadius, highestRadius) {
        let highestZ = mesh.vertices.array[Field.findVectorWithHighestZ(mesh.vertices)].z;
        let lowestZ = mesh.vertices.array[Field.findVectorWithLowestZ(mesh.vertices)].z;
        let zRange = highestZ - lowestZ;
        let radiusRange = highestRadius - lowestRadius;
        for (let vertex of mesh.vertices.array) {
            let radius = ((vertex.z - lowestZ) * (radiusRange / zRange)) + lowestRadius;
            this.graphVisibleVertex(vertex, radius);
        }
    }
    graphVertex(vertex, size) {
        this.graphicsBuffer.stroke(0);
        this.graphicsBuffer.fill(0);
        this.graphicsBuffer.circle(vertex.x, vertex.y, size);
    }
    graphVisibleVertex(vertex, size) {
        if (this.camera.isVertexVisible(vertex))
            this.graphVertex(vertex, size);
    }
    graphVisibleVertices(mesh, size) {
        for (const vertex of mesh.vertices.array) {
            this.graphVisibleVertex(vertex, size);
        }
    }
    graphTriangle(field, triangle) {
        let graphReferences = triangle.verticeReferences;
        let p1 = field.array[graphReferences[0]];
        let p2 = field.array[graphReferences[1]];
        let p3 = field.array[graphReferences[2]];
        this.graphicsBuffer.strokeJoin(ROUND);
        this.graphicsBuffer.noFill(255);
        this.graphicsBuffer.triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    }
    graphTriangles(mesh, color) {
        this.graphicsBuffer.stroke(color);
        let triangles = mesh.triangles;
        let field = mesh.vertices;
        for (const triangle of triangles) {
            this.graphTriangle(field, triangle);
            continue;
        }
    }
    graphLines(lines, color) {
        for (const line of lines) {
            this.graphLine(line, color);
        }
    }
    graphLine(line, color) {
        this.graphBetweenTwoPoints(line.p1, line.p2, color);
    }
    graphBetweenTwoPoints(p1, p2, color) {
        this.graphicsBuffer.stroke(color);
        this.graphicsBuffer.line(p1.x, p1.y, p2.x, p2.y);
    }
}
if (typeof window !== "undefined") {
    window.p5MeshRenderer = p5MeshRenderer;
}
//# sourceMappingURL=p5MeshRenderer.js.map