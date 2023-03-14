import GcMath from "./math";

export class Pitch {
    public value: number;
    public type: PitchType;

    public constructor(value: number, type: PitchType) {
        this.value = value;
        this.type = type;
    }

    public convert(): Pitch {
        return new Pitch(
            INCH / this.value, 
            this.type == PitchType.Metric
                ? PitchType.Imperial
                : PitchType.Metric);
    }

    public toMetric(): Pitch {
        return this.type == PitchType.Metric ? this : this.convert();
    }

    public withRatio(ratio: number): Pitch{
        return new Pitch(this.type == PitchType.Metric ? this.value / ratio : this.value * ratio, this.type);
    }

    public toString(roundTo: number = 0.001): string {
        return GcMath.round(this.value, roundTo).toFixed(3) + " " + (this.type == PitchType.Metric ? "mm/rev" : "TPI");
    }

    public toPlainObject():any {
        return {value: this.value, type: Number(this.type) };
    }

    public static fromPlainObject(val: any): Pitch | null {
        return val == null ? null : new Pitch(val.value, val.type);
    }
}

export enum PitchType {
    Metric, Imperial
}

export const INCH = 25.4;