


export class Vector {
    private x : number;
    private y : number;
    private z : number;
    constructor (x : number,y : number,z : number){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static zero() : Vector{
        return new this(0,0,0);
    }
    static isVectorEqual(v1 : Vector,v2 : Vector) : boolean{
        if (!(v1 instanceof Vector)) {throw Error("v1 must be a vector");}
        if (!(v2 instanceof Vector)) {throw Error("v2 must be a vector");}
        
        return v1.x === v2.x && v1.y === v2.y && v2.z === v2.z;
    }
    
    static unitVector(v : Vector) : Vector{
        if (!(v instanceof Vector)) {throw Error("v must be a vector");}
        let mag = v.magnitude();
        return new this(v.x/mag,v.y/mag,v.z/mag);
    }
    static upVector() : Vector{
        return new this(0,0,1);
    }
    static generateVectorInSphere(mag : number) : Vector {
        
        mag = Math.random()*mag*mag*mag;
        mag = Math.cbrt(mag)
        let d = 2;
        let x = 0, y = 0, z = 0;
        while (d > 1.0) {
            x = (Math.random()*2)-1;
            y = (Math.random()*2)-1;
            z = (Math.random()*2)-1;
            d = (x*x)+(y*y)+(z*z);
        }
        return new Vector(x*mag,y*mag,z*mag);
    
    }
    

    static magnitude(v : Vector) : number{
        if (!(v instanceof Vector)) {throw Error("p1 must be a vector");}
        return v.magnitude();
    }
    magnitude() : number{
        return Math.hypot(this.x,this.y,this.z);
    }
    static distanceBetweenVectors(v1 : Vector ,v2 : Vector) : number{
        if (!(v1 instanceof Vector)) {throw Error("v1 must be a vector");}
        if (!(v2 instanceof Vector)) {throw Error("v2 must be a vector");}

        return Math.hypot((v1.x-v2.x),(v1.y-v2.y),(v1.z-v2.z));
    }
    static lerp(p1 : number,p2 : number,t : number) : number{
        if (!Number.isFinite(p1)) {throw Error("p1 is not a finite number");}
        if (!Number.isFinite(p2)) {throw Error("p2 is not a finite number");}
        if (!Number.isFinite(t)) {throw Error("t is not a finite number");}
        
        return ((p2-p1)*t) + p1;
        
    }

    static lerpVector(v1 : Vector,v2 : Vector,t : number) : Vector{
        return new this(this.lerp(v1.x,v2.x,t),this.lerp(v1.y,v2.y,t),this.lerp(v1.z,v2.z,t));
    }
    
    static normalize(v : Vector) : Vector{
        throw Error ("depreciated : use Vector.unitVector(v) instead");
        let mag = Math.sqrt( (v.x **2) + (v.y **2) + (v.z **2));
        
        return new this(v.x/mag,v.y/mag,v.z/mag);
    }

    
    static crossProduct(v1 : Vector,v2 : Vector) : Vector{
       
        return new this((v1.y*v2.z)-(v1.z*v2.y),(v1.z*v2.x)-(v1.x*v2.z),(v1.x*v2.y)-(v1.y*v2.x));
        
    }
    static dotProduct(v1 : Vector,v2 : Vector) : number{
        return ((v1.x *v2.x) + (v1.y *v2.y) + (v1.z *v2.z));
    }


    static sub (v1 : Vector,v2 : Vector) : Vector{
        return new this(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
    }
    static add(v1 : Vector,v2 : Vector) : Vector{
        return new this(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z);
    }
    
    static scalarMult(v : Vector,c : number) : Vector{
        return new this(v.x*c,v.y*c,v.z * c);
    }
    static rotateVector(v : Vector,xRotate : number,yRotate : number,zRotate : number) : Vector{
        v = this.rotateAroundX(v,xRotate);
        v = this.rotateAroundY(v,yRotate);
        v = this.rotateAroundZ(v,zRotate);
        return v;
    }
    static rotateAroundX(v : Vector,theta : number) : Vector{
        return new this(v.x, (v.y*Math.cos(theta))-(v.z*Math.sin(theta)), (v.y*Math.sin(theta))+ (v.z* Math.cos(theta)));
    }
    static rotateAroundY(v : Vector,theta : number) : Vector{
        return new this((v.x*Math.cos(theta))+(v.z*Math.sin(theta)),v.y,(-v.x*Math.sin(theta))+(v.z*Math.cos(theta)));
    }
    static rotateAroundZ(v : Vector,theta : number) : Vector{
        return new this((v.x*Math.cos(theta))-(v.y*Math.sin(theta)), (v.x*Math.sin(theta))+(v.y*Math.cos(theta)),v.z);
    }
    static rotate2DVector(v: Vector,theta : number) : Vector{
        return new this((v.x*Math.cos(theta)) -(v.y* Math.sin(theta)),(v.x*Math.sin(theta))+(v.y*Math.cos(theta)),0);
    }
    
    copy(): this {
        const Ctor = this.constructor as new (x: number, y: number, z: number) => this;
        return new Ctor(this.x, this.y, this.z);
    }
}

