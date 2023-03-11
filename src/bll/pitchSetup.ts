import { Pitch, PitchType } from "./pitch";


export class PitchSetup {
    public pitch: Pitch;
    public gearA: number;
    public gearB: number;
    public gearC: number;
    public gearD: number;

    public constructor(gearA: number = 20, gearB: number | null = null, gearC: number | null = null, gearD: number = 80, pitch: number | Pitch = 1.5, pitchType: PitchType = PitchType.Metric) {
        this.gearA = gearA;
        this.gearB = gearB ?? NaN;
        this.gearC = gearC ?? NaN;
        this.gearD = gearD;

        if (typeof(pitch) == "number") 
            this.pitch = new Pitch(pitch as number, pitchType);
        else 
            this.pitch = pitch as Pitch;
    }

    public fitness(): number {
        const a = (this.gearA + (Number.isNaN(this.gearB)?60:this.gearB) + (Number.isNaN(this.gearC)?60:this.gearC) + this.gearD);
        return Math.abs(180 - a);
    }

    public toString() : string{
        return this.gearA + "\t" + (this.gearB ?? "-") + "\t" + (this.gearC ?? "-") + "\t" + this.gearD + "\t >> " + this.pitch.toString(0.0001)
    }

    public toPlainObject(): any {
        return {
            gearA: this.gearA,
            gearB: this.gearB,
            gearC: this.gearC,
            gearD: this.gearD,
            pitch: this.pitch.toPlainObject(),
        };
    }

    public static fromPlainObject(o: any): PitchSetup {
        return new PitchSetup(o.gearA, o.gearB, o.gearC, o.gearD, Pitch.fromPlainObject(o.pitch)!);
    }
}
