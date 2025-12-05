import { UsefulFunction } from "../Useful-Function/src/UsefulFunction.js"
export class ColorHandler {
    constructor (red,green,blue,classToColor){
        this.classToColor = classToColor;
        red = Math.min(Math.max(0,red),255);
        green = Math.min(Math.max(0,green),255);
        blue = Math.min(Math.max(0,blue),255);
        this.color = [red,green,blue];
    }
    static random(){
        return new this(UsefulFunction.randomIntBetween(0,255),UsefulFunction.randomIntBetween(0,255),UsefulFunction.randomIntBetween(0,255));
    }
    getRed(){
        return this.color[0];
    }
    getGreen(){
        return this.color[1];
    }
    getBlue(){
        return this.color[2];
    }
    classFill() {
        this.classToColor.fill(this.getRed(),this.getGreen(),this.getBlue());
    }
    classStroke() {
        this.classToColor.stroke(this.getRed(),this.getGreen(),this.getBlue());
    }
    classNoFill(){
        this.classToColor.noFill();
    }
    classNoStroke(){
        this.classToColor.noStroke();
    }
    p5Fill(){
        renderGraphic.fill(this.getRed(),this.getGreen(),this.getBlue());
    }
    p5Stroke() {
        renderGraphic.stroke(this.getRed(),this.getGreen(),this.getBlue());
    }
    p5NoStroke(){
        renderGraphic.noStroke();
    }
    p5NoFill(){
        renderGraphic.noFill();
    }
    multiplyByNumber(number){
        for (let i =0; i < this.color.length;i++) {
            this.color[i] = this.color[i]*number;
        }

    }
    static randomColorBetween(red1,red2,green1,green2,blue1,blue2){
        return new this (UsefulFunction.randomIntBetween(red1,red2),UsefulFunction.randomIntBetween(green1,green2),UsefulFunction.randomIntBetween(blue1,blue2));
    }
    static randomColorAtWithGeneralRadius(redAt,greenAt,blueAt,radius){
        return this.randomColorAtWithRadius(redAt,greenAt,blueAt,radius,radius,radius);
    }
    static randomColorAtWithRadius(redAt,greenAt,blueAt,redRad,greenRad,blueRad) {
        return this.randomColorBetween(redAt-(redRad/2),redAt+(redRad/2),greenAt-(greenRad/2),greenAt+(greenRad/2),blueAt-(blueRad/2),blueAt+(blueRad/2));
    }
    addNumber(number) {
        for (let i =0; i < this.color.length;i++) {
            this.color[i] = this.color[i] + number;
        }
    }
    copy(){
        return new this.constructor(this.color[0],this.color[1],this.color[2]);
    }
    static sumAndClamp(colors){
        let outputColor = new this(0,0,0);
        let colorElementValue;
        for (const color of colors) {
            for (let i =0 ; i < color.color.length;i++) {
                outputColor.color[i] += color.color[i];
            }
        }
        for (let i =0 ; i < outputColor.color.length;i++) {
            colorElementValue = outputColor.color[i];
            if (colorElementValue >255) colorElementValue = 255;
            if (colorElementValue < 0) colorElementValue = 0;
            outputColor.color[i] = colorElementValue;
        }
        return outputColor;
    }
}