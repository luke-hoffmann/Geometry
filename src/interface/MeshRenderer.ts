import type { Mesh } from "../geometry/index.js";
import type { Camera } from "../camera/Camera.js";
import type { Light } from "../geometry/index.js";
import type { RenderParameters } from "./RenderParameters.js";
import { Vector } from "../geometry/Vector.js"
export class MeshRenderer {
    protected mesh : Mesh;
    protected camera : Camera;
    protected lights : Light[];
    protected renderParameters : RenderParameters;
    constructor (mesh: Mesh,camera: Camera,lights: Light[],renderParameters: RenderParameters) {
        this.mesh = mesh;
        this.camera = camera;
        this.lights = lights;
        this.renderParameters = renderParameters;
    }   
    backFaceCulling() {
        let viewVector = new Vector(0,0,1);
        let visibleTriangles = [];
        let backFaceCulledMesh = this.mesh.copy();
        let cameraFacingTriangles = [];

        let normalVectors = backFaceCulledMesh.calculateTriangleNormalVectors();
        for (let i = 0; i < normalVectors.length; i++) {
            //if (this.renderParameters.isPerspective)
        }
        for (let i =0; i < this.mesh.numTriangles() ; i++) {
            let isTriangleVisible;
            if (this.renderParameters.isPerspective)  {
                isTriangleVisible = this.mesh.getVertex(this.mesh.getTriangle(i).getVerticeRef(0)).isDotProductLEThanX(normalVectors[i].direction,0);
            } else {
                isTriangleVisible = viewVector.isDotProductLEThanX(normalVectors[i].direction,0);
            }
            
           
            if (!isTriangleVisible) continue;
            cameraFacingTriangles.push(this.mesh.getTriangle(i));
            
        }
        backFaceCulledMesh.triangles = cameraFacingTriangles;
        return backFaceCulledMesh;
    }
}