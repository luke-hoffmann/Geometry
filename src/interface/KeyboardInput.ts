import { Vector } from "../geometry/Vector";

export class KeyboardInput {
    #up : boolean;
    #down : boolean;
    #left : boolean;
    #right : boolean;
    #control : boolean;
    #space : boolean;
    constructor() {
        this.#up = false;
        this.#down = false;
        this.#left = false;
        this.#right = false;
        this.#control = false;
        this.#space = false;
    }
    get up() {
        return this.#up;
    }
    get down() {
        return this.#down;
    }
    get left() {
        return this.#left;
    }
    get right() {
        return this.#right;
    }
    get space() {
        return this.#space;
    }
    get control() {
        return this.#control;
    }
    set up(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#up=value
    }
    set down(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#down=value
    }
    set left(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#left=value
    }
    set right(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#right=value
    }
    set space(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#space=value
    }
    set control(value : boolean) {
        if (typeof value != "boolean") throw Error("poor input");
        this.#control=value
    }
    updateLeftRightUpDown(left : boolean, right :boolean,  up:boolean, down: boolean) : void{
        this.up= up;
        this.down= down;
        this.left=left;
        this.right=right;
    }
    updateControlSpace(control : boolean, space: boolean) {
        this.control = control;
        this.space = space;
    }
    movementInCertainCoordinateSystem(forward: Vector, up : Vector, right: Vector) : Vector{
        forward = Vector.unitVector(forward);
        up = Vector.unitVector(up);
        right = Vector.unitVector(right);
        // forward is going more positive
        // right is going more positive
        let velocity = Vector.zero();
        if (this.#up) {
            velocity = Vector.add(velocity,forward);
        }
        if (this.#down) {
            velocity = Vector.add(velocity,Vector.oppositeVector(forward));
        }
        if (this.#left) {
            velocity = Vector.add(velocity,Vector.oppositeVector(right));
        }
        if (this.#right) {
            velocity = Vector.add(velocity,right);
        }
        if (this.#control) {
            velocity = Vector.add(velocity, Vector.oppositeVector(up));
        }
        if (this.#space) {
            velocity = Vector.add(velocity, up);
        }
        return velocity;
    }
}