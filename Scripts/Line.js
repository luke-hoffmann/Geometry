class Line {
    constructor(p1,p2){
        this.p1 = p1;
        this.p2 = p2;
    }
    static isLineEqual(l1,l2){
        if (l1===l2) return true;
        if (l1.p1 === l2.p1 && l1.p2 === l2.p2) return true;
        if (l1.p1 === l2.p2 && l1.p2 == l2.p1) return true;
        return false;
    }
    static calculateFarthestPoint(field,line) {
        let farthestDistance = 0;
        let farthestPoint = undefined
        let farthestPointIndex = undefined;
        for (let i =0 ; i <field.array.length ; i++) {
            let pointIsFromLine = Vector.isVectorEqual(point,line.p1) || Vector.isVectorEqual(point,line.p2);
            if (pointIsFromLine) continue;
            let distance= line.distanceToPoint(field.array[i]);
            
            if (farthestDistance < distance) {
                farthestPoint = field.array[i];
                farthestDistance = distance;
                farthestPointIndex = i;
            }
        }
        return farthestPointIndex;
    }
    distanceToPoint(v){
       this.BA = Vector.sub(v,this.p1);
       this.BC = Vector.sub(this.p2,this.p1);
       return Vector.magnitude(Vector.crossProduct(this.BA,this.BC)) / Vector.magnitude(this.BC)
    }
    static graphLine(line,color){
        color.p5Stroke();
        color.p5Fill();
        this.graphBetweenTwoPoints(line.p1,line.p2,color);
    }
    static graphBetweenTwoPoints(p1,p2,color) {
        color.p5Stroke(color);
        color.p5Fill(color);
        renderGraphic.line(p1.x,p1.z,p2.x,p2.z);
    }
}
