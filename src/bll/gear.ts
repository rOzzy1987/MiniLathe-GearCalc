import { INCH } from "./math";

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

    public toPlainObject():any {
        return {module: this.module, teeth: this.teeth };
    }

    public static fromPlainObject(val: any): Gear | null {
        if (val == null)
            return null;
        const module = GearModule.fromPlainObject(val.module);
        return module == null ? null : new Gear(module, val.teeth);
    }

    public equals(p: Gear) {
        return this.module.equals(p.module) &&
            this.teeth == p.teeth;
    }

    public static ListFromTeeth(teethArray: number[], module: GearModule){
        return teethArray.map(t => new Gear(module, t));
    }

    public static fromString(str: string): Gear | null {
        const pattern = /((?:m|M|dp|DP)[1-9](?:[0-9]*)(?:\.(?:[0-9]+))?)(?:\s?)[zZ]([1-9](?:[0-9]*))/g;
        const m = pattern.exec(str);
        if (m == null)
            return null;
        return new Gear(GearModule.fromString(m[1]), Number(m[2]));
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
        return this.type == ModuleType.Metric ? ("M"+this.number) : ("DP"+this.number);
    }

    public toPlainObject():any {
        return {number: this.number, type: Number(this.type) };
    }

    public static fromPlainObject(val: any): GearModule | null {
        return val == null ? null : new GearModule(val.number, val.type);
    }

    public equals(p: GearModule) {
        return this.number == p.number &&
            this.type == p.type;
    }

    public static fromString(str: string): GearModule | null {
        const pattern = /(m|M|dp|DP)([1-9](?:[0-9]*)(?:\.(?:[0-9]+))?)/g;
        const m = pattern.exec(str);
        if(str == null)
            return null;
        return new GearModule(Number(m[2]), m[1].toLowerCase == 'm' ? ModuleType.Metric : ModuleType.DiametralPitch)
    }
}

export enum ModuleType {
    Metric, DiametralPitch
}