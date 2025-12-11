"use strict";
// Field Graph ------------------
// Field Graph ------------------
// Field Graph ------------------
graph(field, diameter, color);
{
    for (const point of field.array) {
        point.graph(diameter, color);
    }
}
graphLine(line, color);
{
    color.p5Stroke();
    color.p5Fill();
    this.graphBetweenTwoPoints(line.p1, line.p2, color);
}
graphBetweenTwoPoints(p1, p2, color);
{
    color.p5Stroke(color);
    color.p5Fill(color);
    renderGraphic.line(p1.x, p1.z, p2.x, p2.z);
}
// Mesh graphing --------------
// Mesh graphing --------------
// Mesh graphing --------------
graphNormalVectors(color, length);
{
    for (triangle of this.triangles) {
        let field = new Field(this.vertices);
        let centerOfTriangle = Triangle.computeCentroid(field, triangle);
        let normalVector = Vector.scalarMult(Triangle.computeNormal(field, triangle), length);
        normalVector = Vector.add(normalVector, centerOfTriangle);
        Line.graphBetweenTwoPoints(normalVector, centerOfTriangle, color);
    }
}
graphSpecificVertices(indices, diameter, color);
{
    for (const index of indices) {
        this.vertices[index].graph(diameter, color);
    }
}
graphVertices(diameter, color);
{
    for (const vertex of this.vertices) {
        vertex.graph(diameter, color);
    }
}
getVerticesFromTriangle(triangle);
{
    let vertices = [];
    for (const reference of triangle.verticeReferences) {
        vertices.push(reference);
    }
    return vertices;
}
graph(mesh, graphTriangles, graphVertices, graphNormalVectors);
{
    if (graphVertices) {
        mesh.graphVertices(mesh.standalonePointDiameter, mesh.standalonePointColor);
    }
    if (graphTriangles) {
        mesh.graphTriangles(mesh.triangleColor, mesh.trianglePointDiameter, mesh.trianglePointColor, 1);
    }
    if (!graphNormalVectors) {
        return;
    }
    mesh.graphNormalVectors(mesh.normalVectorColor, 40);
}
graphConvexHullOnCanvas(mesh, t, graphConvexHull, doBackFaceCulling, doNormalVectors, triangleColor);
{
    let currentMesh = Mesh.copy(mesh);
    let rotatedMesh = Mesh.rotate(currentMesh, t, t, 0);
    rotatedMesh.triangleColor = triangleColor;
    if (!graphConvexHull) {
        Mesh.graph(rotatedMesh, graphConvexHull, true, false);
        return;
    }
    if (doBackFaceCulling) {
        rotatedMesh = Mesh.backFaceCulling(rotatedMesh, viewVector);
        let colors = Triangle.getColorOfTriangles(new Field(rotatedMesh.vertices), rotatedMesh.triangles, lights);
        rotatedMesh = Mesh.setColorOfTriangles(rotatedMesh, colors);
        Mesh.graph(rotatedMesh, graphConvexHull, false, doNormalVectors);
    }
    else {
        rotatedMesh.triangleColor = new ColorHandler(0, 0, 0);
        Mesh.graph(rotatedMesh, graphConvexHull, true, doNormalVectors);
    }
}
setColorOfTriangles(mesh, colors);
{
    if (colors.length != mesh.triangles.length)
        throw new Error("Array size mismatch");
    let newMesh = this.copy(mesh);
    let triangles = [...newMesh.triangles];
    for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        triangles[i].color = color;
    }
    newMesh.triangles = triangles;
    return newMesh;
}
constructor();
{
    if (doGraphNormalVectors == true) {
        this.doGraphNormalVectors = true;
    }
    else {
        this.doGraphNormalVectors = false;
    }
    if (trianglePointColor == undefined) {
        this.trianglePointColor = new ColorHandler(0, 0, 0);
    }
    else {
        this.trianglePointColor = trianglePointColor;
    }
    if (triangleColor == undefined) {
        this.triangleColor = new ColorHandler(0, 0, 0);
    }
    else {
        this.triangleColor = triangleColor;
    }
    if (triangleColor == true) {
        this.triangleColor = true;
    }
    if (normalVectorColor == undefined) {
        this.normalVectorColor = new ColorHandler(0, 0, 0);
    }
    else {
        this.normalVectorColor = normalVectorColor;
    }
    if (standalonePointColor == undefined) {
        this.standalonePointColor = new ColorHandler(0, 0, 0);
    }
    else {
        this.standalonePointColor = standalonePointColor;
    }
}
// Triangle --------------
// Triangle --------------
// Triangle --------------
//constructor
this.color = ColorHandler.randomColorAtWithGeneralRadius(210, 60, 140, 40);
if (color == undefined)
    return;
this.color = color.copy();
getColorOfTriangle(field, triangle, lights);
{
    let light, lightingVector, observedColor;
    let centerOfTriangle = this.computeCentroid(field, triangle);
    let colorArray = [];
    let angleBrightness;
    for (let i = 0; i < lights.length; i++) {
        light = lights[i];
        lightingVector = Vector.sub(centerOfTriangle, light.position);
        lightingVector = Vector.normalize(lightingVector);
        angleBrightness = this.getDotProductBetweenNormalAndVector(field, triangle, lightingVector);
        observedColor = Light.calculateObservedColor(light, triangle.color);
        observedColor.multiplyByNumber(angleBrightness);
        colorArray.push(observedColor);
    }
    return ColorHandler.sumAndClamp(colorArray);
}
getColorOfTriangles(field, triangles, lights);
{
    let colors = [];
    for (const triangle of triangles) {
        colors.push(this.getColorOfTriangle(field, triangle, lights));
    }
    return colors;
}
graphTriangleOutline(vertices, triangle, color, lineWeight);
{
    let verticesThatMakeUpTriangle = triangle.verticeReferences;
    color.p5NoFill();
    color.p5Stroke();
    renderGraphic.strokeWeight(lineWeight);
    renderGraphic.strokeJoin(ROUND);
    renderGraphic.triangle(vertices[verticesThatMakeUpTriangle[0]].x, vertices[verticesThatMakeUpTriangle[0]].y, vertices[verticesThatMakeUpTriangle[1]].x, vertices[verticesThatMakeUpTriangle[1]].y, vertices[verticesThatMakeUpTriangle[2]].x, vertices[verticesThatMakeUpTriangle[2]].y);
}
graphTriangleFill(vertices, triangle, color);
{
    let verticesThatMakeUpTriangle = triangle.verticeReferences;
    color.p5Fill();
    color.p5NoStroke();
    renderGraphic.triangle(vertices[verticesThatMakeUpTriangle[0]].x, vertices[verticesThatMakeUpTriangle[0]].y, vertices[verticesThatMakeUpTriangle[1]].x, vertices[verticesThatMakeUpTriangle[1]].y, vertices[verticesThatMakeUpTriangle[2]].x, vertices[verticesThatMakeUpTriangle[2]].y);
}
// Vector -------------
// Vector -------------
// Vector -------------
graph(diameter, color, index);
{
    color.p5NoStroke();
    color.p5Fill();
    renderGraphic.circle(this.x, this.y, diameter);
    if (index == undefined)
        return;
}
labelPosition(index);
{
    renderGraphic.text(index, this.x + 10, this.y + 10);
}
// MESH
/*
        if (this.renderParameters.doBackFaceCulling) {
            //mesh = Mesh.backFaceCulling(mesh,this.camera)
        }
        if (this.renderParameters.doVertices) {
            this.graphVertices(mesh);
        }
        if (this.renderParameters.doFill) {
            //mesh.graphTriangles(mesh.triangleColor,mesh.trianglePointDiameter,mesh.trianglePointColor,1);
        }

        if (!this.renderParameters.doNormalVectors) {
            return
        }
        mesh.graphNormalVectors(mesh.normalVectorColor,40);
        */ 
//# sourceMappingURL=p5-RENDER-CHOOSE-GOOD-NAME.js.map