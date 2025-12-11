export class RenderParameters {
    constructor(options = {}) {
        const defaults = {
            doBackFaceCulling: true,
            doOutline: true,
            doFill: true,
            doVertices: false,
            doNormalVectors: false,
            doShadingWithLighting: true,
            lineWidth: 1,
            pointRadius: 3,
            isPerspective: true
        };
        Object.assign(this, defaults, options);
    }
}
//# sourceMappingURL=RenderParameters.js.map