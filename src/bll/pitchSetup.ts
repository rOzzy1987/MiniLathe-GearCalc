import { Gear, Gears } from "./gear";
import type LatheConfig from "./latheConfig";
// import GlobalConfig from "./globalConfig";
import { Pitch, PitchType } from "./pitch";


export class PitchSetup {
    public pitch: Pitch;
    public gearA: Gear | undefined;
    public gearB: Gear | undefined;
    public gearC: Gear | undefined;
    public gearD: Gear | undefined;

    public constructor(gearA: Gear | undefined, gearB: Gear | undefined, gearC: Gear | undefined, gearD: Gear | undefined, pitch: number | Pitch, pitchType: PitchType = PitchType.Metric) {
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

    public isValid(minTeeth: number): boolean {
        return this.areGearsProvided() &&
            this.areModulesMatching() &&
            this.areGearsClearingAxles(minTeeth);
    }

    public areGearsClearingAxles(minTeeth: number){
        const pcA = Gears.pitchRadius(this.gearA)!;
        const pcB = Gears.pitchRadius(this.gearB)!;
        const pcC = Gears.pitchRadius(this.gearC)!;
        const pcD = Gears.pitchRadius(this.gearD)!;
        const axleRadius = 8;

        // the banjo can't stretch long enough
        if (pcA + pcB + pcC + pcD <= minTeeth)
            return false;

        // gear B interferes with the leadscrew axle
        if (pcB > pcC + pcD - axleRadius)
            return false;
        
        // gear C interferes with the driving axle
        if (pcC > pcA + pcB - axleRadius)
            return false;
            
        return true;
    }

    public areGearsProvided() : boolean {
        return (this.gearA != undefined && this.gearD != undefined) &&
            ((this.gearB == undefined && this.gearC == undefined) || (this.gearB != undefined && this.gearC != undefined));
    }

    public areModulesMatching(): boolean {
        if (this.gearB == undefined && this.gearC == undefined){
            return this.gearA!.module.equals(this.gearD!.module);
        } else if (this.gearB != undefined && this.gearC != undefined) {
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

    public equals(s: PitchSetup) {
        return Gears.equal(this.gearA, s.gearA) &&
            Gears.equal(this.gearB, s.gearB) &&
            Gears.equal(this.gearC, s.gearC) &&
            Gears.equal(this.gearD, s.gearD) &&
            (this.pitch.equals(s.pitch) || this.pitch.convert().equals(s.pitch));
    }

    public toMetric() {
        return this.pitch.type == PitchType.Metric ? this : new PitchSetup(this.gearA, this.gearB, this.gearC, this.gearD, this.pitch.toMetric());
    }

    public static fromPlainObject(o: any): PitchSetup {
        return new PitchSetup(
            Gear.fromString(o.gearA)!, 
            Gear.fromString(o.gearB), 
            Gear.fromString(o.gearC), 
            Gear.fromString(o.gearD)!, 
            Pitch.fromPlainObject(o.pitch)!);
    }

    public static fromGearsAndLeadscrew(gearA: Gear | undefined, gearB: Gear | undefined, gearC: Gear | undefined, gearD: Gear | undefined, leadscrew: Pitch): PitchSetup {
        if (gearA == undefined || gearD == undefined){
            return new PitchSetup(gearA,gearB,gearC,gearD, new Pitch(0, leadscrew.type));
        }
        const ratio = gearB == undefined && gearC == undefined
            ? gearD.teeth / gearA.teeth 
            : gearB != undefined && gearC != undefined
                ? (gearB.teeth * gearD.teeth) / (gearA.teeth * gearC.teeth)
                : 0;
        return new PitchSetup(gearA, gearB ?? undefined, gearC ?? undefined, gearD, leadscrew.withRatio(ratio));
    }
}
