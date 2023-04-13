import GcMath, { INCH } from "./math";

export class Gear {
    public module: GearModule;
    public teeth: number;

    public constructor(module: GearModule, teeth: number){
        this.module = module;
        this.teeth = teeth;
    }

    public convert(): Gear {
        return new Gear(this.module.convert(), this.teeth);
    }

    public toMetric(): Gear {
        return this.module.type == ModuleType.Metric ? this : this.convert();
    }

    public toString(): string {
        return (this.module.toString()) + (" Z"+this.teeth);
    }

    public equals(other: Gear){
        return Gears.equal(this, other);
    }

    public static fromString(str: string): Gear | undefined {
        const pattern = /((?:m|M|dp|DP)[0-9](?:[0-9]*)(?:\.(?:[0-9]+))?)(?:\s?)[zZ]([1-9](?:[0-9]*))/g;
        const m = pattern.exec(str);
        if (m == undefined)
            return undefined;
        return new Gear(GearModule.fromString(m[1])!, Number(m[2]));
    }
    public toPlainObject(){
        return {
            teeth: this.teeth,
            module: this.module.toString()
        }
    }
}

export class Gears {

    public static equal(g1: Gear | undefined, g2: Gear | undefined) {
        if (g1 == undefined && g2 == undefined) return true;
        if (g1 == undefined || g2 == undefined) return false;
        return g1.module.equals(g2.module) &&
            g1.teeth == g2.teeth;
    }

    private static diameterWithAddendum(g: Gear | undefined, a: number) {
        if (g == undefined) return undefined;
        return (g.teeth + a) * g.module.toMetric().number;
    }

    private static radiusWithAddendum(g: Gear | undefined, a: number) {
        if (g == undefined) return undefined;
        return this.diameterWithAddendum(g, a)! / 2;
    }

    public static pitchDiameter(g:Gear | undefined){
        return this.diameterWithAddendum(g, 0);
    }

    public static pitchRadius(g: Gear | undefined) {
        return this.radiusWithAddendum(g, 0);
    }

    public static rootDiameter(g: Gear | undefined) {
        return this.diameterWithAddendum(g, -3);
    }

    public static rootRadius(g: Gear | undefined) {
        return this.radiusWithAddendum(g, -3);
    }

    public static outerDiameter(g: Gear | undefined) {
        return this.diameterWithAddendum(g, 2);
    }

    public static outerRadius(g: Gear | undefined) {
        return this.radiusWithAddendum(g, 2);
    }

    public static listFromTeeth(teethArray: number[], module: GearModule): Gear[] {
        return teethArray.map(t => new Gear(module, t));
    }

    private static valueForCompare(g: Gear){
        return g.module.type* 1000000 +
        g.module.number*10000 +
        g.teeth;
    } 

    public static compare(a: Gear, b: Gear) {
        return this.valueForCompare(a) - this.valueForCompare(b);
    }
}

export class GearModule {
    public number: number;
    public type: ModuleType;

    public constructor(number: number, type: ModuleType){
        this.number = number;
        this.type = type;
    }

    public convert(): GearModule {
        return new GearModule(
            INCH / this.number,
            this.type == ModuleType.Metric
                ? ModuleType.DiametralPitch
                : ModuleType.Metric);
    }
    
    public toMetric(): GearModule {
        return this.type == ModuleType.Metric ? this : this.convert();
    }

    public toString(): string {
        const n = GcMath.toFixedMax(this.number, 2);
        return this.type == ModuleType.Metric ? ("M"+n) : ("DP"+n);
    }

    public equals(p: GearModule) {
        return this.number == p.number &&
            this.type == p.type;
    }

    public static fromString(str: string): GearModule | undefined {
        const pattern = /(m|M|dp|DP)([0-9](?:[0-9]*)(?:\.(?:[0-9]+))?)/g;
        const m = pattern.exec(str);
        if(m == undefined)
            return undefined;
        const n = Number(m[2]);
        if (n <= 0)
            return undefined;
        return new GearModule(n, m[1].toLowerCase() == 'm' ? ModuleType.Metric : ModuleType.DiametralPitch)
    }
}

export enum ModuleType {
    Metric, DiametralPitch
}