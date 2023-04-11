export default class GcMath {
    public static round(val: number, roundTo: number) : number {
        return Math.round(val / roundTo) * roundTo;
    }

    public static roughlyEqual(val1: number, val2: number, threshold: number): boolean{
        if (threshold < 1) threshold = 1 / threshold;
        return val1 > (val2 / threshold) && val1 < (val2 * threshold);
    }

    public static isNaN(val: any): boolean {
        return val !== 0 && (val == null || val == "" || Number.isNaN(val));
    }
}

export class Vector {
    public x: number = 0;
    public y: number = 0;

    public constructor (x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public length(): number{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public add(other: Vector) : Vector{
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public sub(other: Vector) : Vector{
        return new Vector(this.x- other.x, this.y - other.y);
    }

    public angle() : number {
        if (this.x == 0)
            return Math.PI / 2;
        return Math.atan(this.y/this.x)
    }

    public static fromAngle(angle: number, length: number = 1): Vector {
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
    }
}


export const INCH = 25.4;