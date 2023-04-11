import { Gear } from "./gear";
import { Pitch, PitchType } from "./pitch";


export class PitchSetup {
    public pitch: Pitch;
    public gearA: Gear | null;
    public gearB: Gear | null;
    public gearC: Gear | null;
    public gearD: Gear | null;

    public constructor(gearA: Gear | null, gearB: Gear | null, gearC: Gear | null, gearD: Gear | null, pitch: number | Pitch, pitchType: PitchType = PitchType.Metric) {
        this.gearA = gearA;
        this.gearB = gearB;
        this.gearC = gearC;
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

    public isValid(): boolean {
        return this.areGearsProvided() &&
            this.areModulesMatching();
    }

    public areGearsProvided() : boolean {
        return (this.gearA != null && this.gearD != null) &&
            ((this.gearB == null && this.gearC == null) || (this.gearB != null && this.gearC != null));
    }

    public areModulesMatching(): boolean {
        if (this.gearB == null && this.gearC == null){
            return this.gearA!.module.equals(this.gearD!.module);
        } else if (this.gearB != null && this.gearC != null) {
            return this.gearA!.module.equals(this.gearB.module) &&
                this.gearC.module.equals(this.gearD!.module);
        } else return false;
    }

    public toString() : string{
        return (this.gearA?.toString() ?? "-") + "\t" 
            + (this.gearB?.toString() ?? "-") + "\t" 
            + (this.gearC?.toString() ?? "-") + "\t" 
            + (this.gearD?.toString() ?? "-") + "\t >> " 
            + this.pitch.toString(0.0001)
    }

    public toPlainObject(): any {
        return {
            gearA: this.gearA?.toString(),
            gearB: this.gearB?.toString(),
            gearC: this.gearC?.toString(),
            gearD: this.gearD?.toString(),
            pitch: this.pitch.toPlainObject(),
        };
    }

    public static fromPlainObject(o: any): PitchSetup {
        return new PitchSetup(
            Gear.fromString(o.gearA)!, 
            Gear.fromString(o.gearB), 
            Gear.fromString(o.gearC), 
            Gear.fromString(o.gearD)!, 
            Pitch.fromPlainObject(o.pitch)!);
    }

    public equals(s: PitchSetup) {
        return Gear.equals(this.gearA, s.gearA) &&
            Gear.equals(this.gearB, s.gearB) &&
            Gear.equals(this.gearC, s.gearC) &&
            Gear.equals(this.gearD, s.gearD) &&
            (this.pitch.equals(s.pitch) || this.pitch.convert().equals(s.pitch));
    }
}
