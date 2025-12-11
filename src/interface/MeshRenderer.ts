import type { Mesh } from "../geometry/index.js";
import type { Camera } from "../camera/Camera.js";
import type { Light } from "../geometry/index.js";
import type { RenderParameters } from "./RenderParameters.js";
import { Vector } from "../geometry/Vector.js"
export class MeshRenderer {
    private mesh : Mesh;
    private camera : Camera;
    private lights : Light[];
    private renderParameters : RenderParameters;
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
        backFaceCulledMesh.triangles = [];

        let normalVectors = Mesh.calculateTriangleNormalVectors(mesh);
        for (let i =0; i < mesh.triangles.length ; i++) {
            let isTriangleVisible;
            if (isPerspective)  {
                isTriangleVisible = Triangle.isDotProductLEThanX(mesh.vertices.array[mesh.triangles[i].verticeReferences[0]],normalVectors[i].direction,0);
            } else {
                isTriangleVisible = Triangle.isDotProductLEThanX(viewVector,normalVectors[i].direction,0);
            }
            
           
            if (!isTriangleVisible) continue;
            backFaceCulledMesh.triangles.push(mesh.triangles[i]);
            
        }
        return backFaceCulledMesh;
    }
}