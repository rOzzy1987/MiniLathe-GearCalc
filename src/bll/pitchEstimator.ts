import GcMath from "./math";
import { INCH, Pitch, PitchType } from "./pitch";
import type { PitchSetup } from "./pitchSetup";

export default class PitchEstimator {

    public esitmate(sample: PitchSetup): PitchAssumption {

        if(!this.isGear(sample.gearA) || !this.isGear(sample.gearD))
            throw new Error("Gears A and D are mandatory!");

        if ((!this.isGear(sample.gearB) && this.isGear(sample.gearC)) || (this.isGear(sample.gearB) && !this.isGear(sample.gearC)))
            throw new Error("Gears B and C should both be set or unset");

        if (sample.pitch == null)
            throw new Error("No pitch provided");
        
        let div = sample.gearD / sample.gearA;
        if (this.isGear(sample.gearB) && this.isGear(sample.gearC))
            div *= sample.gearB / sample.gearC;
        
        const metricPitch = sample.pitch.type == PitchType.Metric
            ? sample.pitch.value
            : sample.pitch.convert().value;

        const lsMetricPitch = metricPitch * div;
        const lsImperialPitch = INCH / lsMetricPitch;

        const lsMetricRounded = GcMath.round(lsMetricPitch, 0.1);
        const lsImperialRounded = GcMath.round(lsImperialPitch, 0.25);

        const isMetric = GcMath.roughlyEqual(lsMetricPitch, lsMetricRounded, 1.003);
        const isImperial = GcMath.roughlyEqual(lsImperialPitch, lsImperialRounded, 1.003);
        
        const result = new PitchAssumption();

        result.imperialCalculated = new Pitch(lsImperialPitch, PitchType.Imperial);
        result.imperialAssumption = new Pitch(lsImperialRounded, PitchType.Imperial);
        result.metricCalculated = new Pitch(lsMetricPitch, PitchType.Metric);
        result.metricAssumption = new Pitch(lsMetricRounded, PitchType.Metric);

        if (isMetric && !isImperial)
        {
            result.result = PitchAssumptionResult.LikelyMetric;
        }
        if (!isMetric && isImperial)
        {
            result.result = PitchAssumptionResult.LikelyImperial;
        }

        return result;
    }

    private isGear(num: number | null | undefined){
        return num != null && num != undefined && !Number.isNaN(num) && num > 18;
    }

}

export class PitchAssumption{
    public metricAssumption: Pitch = null!;
    public imperialAssumption: Pitch = null!;
    public metricCalculated: Pitch = null!;
    public imperialCalculated: Pitch = null!;
    public result: PitchAssumptionResult = PitchAssumptionResult.NoIdea;

    public toString() : string {
        return "Assumed pitch: " + this.metricAssumption.toString() + " or " + this.imperialAssumption.toString()+"\n" +
        "Calculated pitch: " + this.metricCalculated.toString() +" or " + this.imperialCalculated.toString() +"\n" +
        (this.result == PitchAssumptionResult.LikelyMetric ? "Likely metric" 
        :this.result == PitchAssumptionResult.LikelyImperial ? "Likely imperial"
        : "Type is ambiguous");
    }
}

export enum PitchAssumptionResult {
    LikelyMetric,
    LikelyImperial,
    NoIdea
}