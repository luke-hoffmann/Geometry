


export class Vector {
    constructor (x,y,z){
        this.points = [];
        if (x==undefined) {
            this.x=0
            this.points.push(x);
        } else {
            this.x = x;
            this.points.push(x);
        }
        if (y==undefined) {
            this.y=0
            this.points.push(y);
        } else {
            this.y = y;
            this.points.push(y);
        }
        if (z==undefined) {
            this.z=0
            this.points.push(0);
        } else {
            this.z = z;
            this.points.push(z);
        }




        if (typeof x != "object") return;

        this.points = [];
        if (x[0] == undefined) {
            this.x = 0;
            this.points.push(this.x)
        } else {
            this.x = x[0];
            this.points.push(this.x)
        }
        if (x[1] == undefined) {
            this.y = 0;
            this.points.push(this.y)
        } else {
            this.y = x[1];
            this.points.push(this.y)
        }
        if (x[2] == undefined) {
            this.z = 0;
            this.points.push(this.z)
        } else {
            this.z = x[2];
            this.points.push(this.z)
        }
        return;


        



        
        

    }

    static zero(){
        return new this(0,0,0);
    }
    static isVectorEqual(p1,p2) {
        return p1===p2;
    }
    
    static unitVector(vector) {
        let mag = vector.magnitude();
        return new this(vector.x/mag,vector.y/mag,vector.z/mag);
    }
    static upVector(){
        return new this(0,0,1);
    }
    static generateVectorInSphere(mag){
        
        mag = Math.random()*mag*mag*mag;
        mag = Math.cbrt(mag)
        let d = 2;
        let x,y,z;
        while (d > 1.0) {
            x = (Math.random()*2)-1
            y = (Math.random()*2)-1
            z = (Math.random()*2)-1;
            d = (x*x)+(y*y)+(z*z);
        }
        return new Vector(x*mag,y*mag,z*mag);
    
    }
    

    static magnitude(v){
        return Math.sqrt((v.x**2)+(v.y**2)+(v.z**2))
    }
    magnitude(){
        return Vector.magnitude(this);
    }
    static distanceBetweenVectors(v1,v2) {
        return (((v1.x-v2.x)**2) + ((v1.y-v2.y)**2) + ((v1.z-v2.z)**2))
    }
    static lerp(p1,p2,t){
        if (p1== undefined || p2 ==undefined || t== undefined) return false;
        if (p1 instanceof this) {
            return this.lerpVector(p1,p2,t)
        }
        return ((p2-p1)*t) + p1;
    }

    static lerpVector(v1,v2,t){
        return new this(this.lerp(v1.x,v2.x,t),this.lerp(v1.y,v2.y,t),this.lerp(v1.z,v2.z,t));
    }
    /**
     * 
     * @param {*} v 2D or 3D Vector
     * @returns The 2D or 3D Vector that has the same direction as v but a magnitude of 1.
     */
    static normalize(v){
        let mag = Math.sqrt( (v.x **2) + (v.y **2) + (v.z **2));
        
        return new this(v.x/mag,v.y/mag,v.z/mag);
    }

    /**
     * 
     * @param {Vector} v1 3D Vector
     * @param {Vector} v2 3D Vector
     * @returns {Vector} The cross product of v1 and v2 in the form of a 3D Vector
     */
    static crossProduct(v1,v2){
       
        return new this((v1.y*v2.z)-(v1.z*v2.y),(v1.z*v2.x)-(v1.x*v2.z),(v1.x*v2.y)-(v1.y*v2.x));
        
    }
    static dotProduct(v1,v2){
        return ((v1.x *v2.x) + (v1.y *v2.y) + (v1.z *v2.z));
    }


    static sub (v1,v2) {
        return new this(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
    }
    static add(v1,v2) {
        return new this(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z);
    }
    /**
     * 
     * @param {Vector} v 
     * @param {Number} c 
     * @returns 
     */
    static scalarMult(v,c) {
        return new this (v.x*c,v.y*c,v.z * c);
    }
    static rotateVector(v,xRotate,yRotate,zRotate){
        v = this.rotateAroundX(v,xRotate);
        v = this.rotateAroundY(v,yRotate);
        v = this.rotateAroundZ(v,zRotate);
        return v;
    }
    static rotateAroundX(v,theta){
        return new this(v.x, (v.y*Math.cos(theta))-(v.z*Math.sin(theta)), (v.y*Math.sin(theta))+ (v.z* Math.cos(theta)));
    }
    static rotateAroundY(v,theta){
        return new this((v.x*Math.cos(theta))+(v.z*Math.sin(theta)),v.y,(-v.x*Math.sin(theta))+(v.z*Math.cos(theta)));
    }
    static rotateAroundZ(v,theta){
        return new this((v.x*Math.cos(theta))-(v.y*Math.sin(theta)), (v.x*Math.sin(theta))+(v.y*Math.cos(theta)),v.z);
    }
    static rotate2DVector(v,theta){
        return new this((v.x*Math.cos(theta)) -(v.y* Math.sin(theta)),(v.x*Math.sin(theta))+(v.y*Math.cos(theta)))
    }
    static findVectorWithLowestZ(field){
        let val = Infinity;
        let index = -1;
        for (let i =0 ; i < field.array.length;i++) {
            let v = field.array[i];
            if (v.z  < val) {
                val = v.z;
                index = i;
            }
        }
        if (index == -1) throw Error("no vector found!");
        return index;

    }
    static findVectorWithHighestZ(field){
        let val = -Infinity;
        let index = -1;
        for (let i =0 ; i < field.array.length;i++) {
            let v = field.array[i];
            if (v.z  > val) {
                val = v.z;
                index = i;
            }
        }
        if (index == -1) throw Error("no vector found!");
        return index;
    }
    copy(){
        return new this.constructor(this.x,this.y,this.z);
    }
}

