export class RenderParameters {
  #doBackFaceCulling: boolean;
  #doOutline: boolean;
  #doFill: boolean;
  #doVertices: boolean;
  #doShadingWithLighting: boolean;
  #lineWidth: number;
  #pointRadius: number;
  #isPerspective: boolean;
  #doTriangles: boolean;
  #isWindingOrderBackFaceCulling: boolean;
  #doNormalVectors : boolean;
  #normalVectorLength : number;
  constructor({
    doBackFaceCulling = true,
    doOutline = true,
    doFill = true,
    doVertices = false,
    doShadingWithLighting = true,
    lineWidth = 1,
    pointRadius = 3,
    isPerspective = true,
    doTriangles = true,
    isWindingOrderBackFaceCulling = true,
    doNormalVectors = false,
    normalVectorLength = 30
  }: Partial<{
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
    doNormalVectors : boolean;
    normalVectorLength : number;
  }> = {}) {
    this.#doBackFaceCulling = doBackFaceCulling;
    this.#doOutline = doOutline;
    this.#doFill = doFill;
    this.#doVertices = doVertices;
    this.#doShadingWithLighting = doShadingWithLighting;
    this.#lineWidth = lineWidth;
    this.#pointRadius = pointRadius;
    this.#isPerspective = isPerspective;
    this.#doTriangles = doTriangles;
    this.#isWindingOrderBackFaceCulling = isWindingOrderBackFaceCulling;
    this.#doNormalVectors = doNormalVectors;
    this.#normalVectorLength = normalVectorLength;
  }

  // getters
  get doBackFaceCulling() { return this.#doBackFaceCulling; }
  get doOutline() { return this.#doOutline; }
  get doFill() { return this.#doFill; }
  get doVertices() { return this.#doVertices; }
  get doShadingWithLighting() { return this.#doShadingWithLighting; }
  get lineWidth() { return this.#lineWidth; }
  get pointRadius() { return this.#pointRadius; }
  get isPerspective() { return this.#isPerspective; }
  get doTriangles() { return this.#doTriangles; }
  get isWindingOrderBackFaceCulling() { return this.#isWindingOrderBackFaceCulling; }
  get doNormalVectors() { return this.#doNormalVectors;}
  get normalVectorLength() {return this.#normalVectorLength};
  // setters (safe)
  set doBackFaceCulling(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doBackFaceCulling must be boolean");
    this.#doBackFaceCulling = v;
  }

  set doOutline(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doOutline must be boolean");
    this.#doOutline = v;
  }

  set doFill(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doFill must be boolean");
    this.#doFill = v;
  }

  set doVertices(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doVertices must be boolean");
    this.#doVertices = v;
  }


  set doShadingWithLighting(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doShadingWithLighting must be boolean");
    this.#doShadingWithLighting = v;
  }

  set lineWidth(v: number) {
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      throw new TypeError("lineWidth must be a positive finite number");
    }
    this.#lineWidth = v;
  }

  set pointRadius(v: number) {
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      throw new TypeError("pointRadius must be a positive finite number");
    }
    this.#pointRadius = v;
  }

  set isPerspective(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("isPerspective must be boolean");
    this.#isPerspective = v;
  }

  set doTriangles(v: boolean) {
    if (typeof v !== "boolean") throw new TypeError("doTriangles must be boolean");
    this.#doTriangles = v;
  }

  set isWindingOrderBackFaceCulling(v: boolean) {
    if (typeof v !== "boolean") {
      throw new TypeError("isWindingOrderBackFaceCulling must be boolean");
    }
    this.#isWindingOrderBackFaceCulling = v;
  }
  set doNormalVectors(v: boolean) {
    if (typeof v !== "boolean") {
      throw new TypeError("doNormalVectors must be boolean");
    }
    this.#doNormalVectors = v;
  }
  set normalVectorLength(v: number) {
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      throw new TypeError("normalVectorLength must be a positive finite number");
    }
    this.#normalVectorLength = v;
  }
}
