export class MeshRenderer {

    constructor (mesh,graphicsBuffer, camera,lights,renderParameters) {
        this.mesh = mesh;
        this.camera = camera;
        this.lights = lights;
        this.renderParameters = renderParameters;
    }   
    graphTriangles(triangles){
        throw Error("Implemention of graphTriangles() is required");
    }
    graphMesh(mesh) {
        throw Error("Implementation of graphMesh() is required");
    }
    graphField(field){
        throw Error("Implementation of graphField() is required");
    }
    
}