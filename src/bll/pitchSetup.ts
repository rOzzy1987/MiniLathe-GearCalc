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

    public convert(): PitchSetup {
        return new PitchSetup(
            this.gearA,
            this.gearB, 
            this.gearC,
            this.gearD,
            this.pitch.convert()
        );
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

    public equals(s: PitchSetup) {
        return this.gearA == s.gearA &&
            this.gearB == s.gearB &&
            this.gearC == s.gearC &&
            this.gearD == s.gearD &&
            (this.pitch.equals(s.pitch) || this.pitch.convert().equals(s.pitch));

    }
}
