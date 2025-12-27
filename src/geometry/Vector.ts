


export class Vector {
    #x : number;
    #y : number;
    #z : number;
    constructor (x : number,y : number,z : number){
        this.#x = x;
        this.#y = y;
        this.#z = z;
    }
    get x(){
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    get z(){
        return this.#z;
    }
    static zero() : Vector{
        return new this(0,0,0);
    }
    set z(n :number){
        if (!Number.isFinite(n)) throw Error("n is not finite");
        this.#z = n;
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
        return new this(0,1,0);
    }
    static downVector() : Vector{
        return new this(0,-1,0);
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
    equals (v : this) : boolean{
        return (v.x == this.#x && v.y == this.#y && v.z == this.#z);
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
    
    isDotProductLEThanX(vector : Vector,x : number) : boolean{
        let dotProduct = Vector.dotProduct(this,vector);
        return (dotProduct <= x);
    }
    copy(): Vector {
        
        return new Vector(this.#x, this.#y, this.#z);
    }
}

