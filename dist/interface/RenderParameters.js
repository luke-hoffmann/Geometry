var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RenderParameters_doBackFaceCulling, _RenderParameters_doOutline, _RenderParameters_doFill, _RenderParameters_doVertices, _RenderParameters_doNormalVectors, _RenderParameters_doShadingWithLighting, _RenderParameters_lineWidth, _RenderParameters_pointRadius, _RenderParameters_isPerspective;
export class RenderParameters {
    constructor(doBackFaceCulling, doOutline, doFill, doVertices, doNormalVectors, doShadingWithLighting, lineWidth, pointRadius, isPerspective) {
        _RenderParameters_doBackFaceCulling.set(this, void 0);
        _RenderParameters_doOutline.set(this, void 0);
        _RenderParameters_doFill.set(this, void 0);
        _RenderParameters_doVertices.set(this, void 0);
        _RenderParameters_doNormalVectors.set(this, void 0);
        _RenderParameters_doShadingWithLighting.set(this, void 0);
        _RenderParameters_lineWidth.set(this, void 0);
        _RenderParameters_pointRadius.set(this, void 0);
        _RenderParameters_isPerspective.set(this, void 0);
        __classPrivateFieldSet(this, _RenderParameters_doBackFaceCulling, doBackFaceCulling, "f");
        __classPrivateFieldSet(this, _RenderParameters_doOutline, doOutline, "f");
        __classPrivateFieldSet(this, _RenderParameters_doFill, doFill, "f");
        __classPrivateFieldSet(this, _RenderParameters_doVertices, doVertices, "f");
        __classPrivateFieldSet(this, _RenderParameters_doNormalVectors, doNormalVectors, "f");
        __classPrivateFieldSet(this, _RenderParameters_doShadingWithLighting, doShadingWithLighting, "f");
        __classPrivateFieldSet(this, _RenderParameters_lineWidth, lineWidth, "f");
        __classPrivateFieldSet(this, _RenderParameters_pointRadius, pointRadius, "f");
        __classPrivateFieldSet(this, _RenderParameters_isPerspective, isPerspective, "f");
    }
    get doBackFaceCulling() { return __classPrivateFieldGet(this, _RenderParameters_doBackFaceCulling, "f"); }
    get doOutline() { return __classPrivateFieldGet(this, _RenderParameters_doOutline, "f"); }
    get doFill() { return __classPrivateFieldGet(this, _RenderParameters_doFill, "f"); }
    get doVertices() { return __classPrivateFieldGet(this, _RenderParameters_doVertices, "f"); }
    get doNormalVectors() { return __classPrivateFieldGet(this, _RenderParameters_doNormalVectors, "f"); }
    get doShadingWithLighting() { return __classPrivateFieldGet(this, _RenderParameters_doShadingWithLighting, "f"); }
    get lineWidth() { return __classPrivateFieldGet(this, _RenderParameters_lineWidth, "f"); }
    get pointRadius() { return __classPrivateFieldGet(this, _RenderParameters_pointRadius, "f"); }
    get isPerspective() { return __classPrivateFieldGet(this, _RenderParameters_isPerspective, "f"); }
}
_RenderParameters_doBackFaceCulling = new WeakMap(), _RenderParameters_doOutline = new WeakMap(), _RenderParameters_doFill = new WeakMap(), _RenderParameters_doVertices = new WeakMap(), _RenderParameters_doNormalVectors = new WeakMap(), _RenderParameters_doShadingWithLighting = new WeakMap(), _RenderParameters_lineWidth = new WeakMap(), _RenderParameters_pointRadius = new WeakMap(), _RenderParameters_isPerspective = new WeakMap();
