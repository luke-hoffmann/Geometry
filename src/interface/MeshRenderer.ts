import type { Mesh } from "../geometry/index.js";
import type { Camera } from "../camera/Camera.js";
import type { Light } from "../geometry/index.js";
import type { RenderParameters } from "./RenderParameters.js";
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
    
}