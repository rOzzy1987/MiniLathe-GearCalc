import { PitchType, Pitch } from "./pitch";

export default class LatheConfig {
    public leadscrew: Pitch = new Pitch(1.5, PitchType.Metric);
    public gears: number[] = [];
    public minTeeth: number = 85;
    public maxSize: number = 130;

    public toString(): string {
        const gears = this.gears.sort();
        let gearsStr = "";
        for (let i = 0; i < this.gears.length; i++){
            gearsStr += gears[i];
            if(i < gears.length - 1)
                gearsStr += ", ";
        }
        return "Pitch: " + this.leadscrew + "\n" + "Gears: " + gearsStr;
    }

    public toPlainObject() {
        return {
            gears: this.gears.slice(),
            leadscrew: this.leadscrew.toPlainObject(),
            minTeeth: this.minTeeth,
            maxSize: this.maxSize
        };
    }

    public static fromPlainObject(o: any) {
        const result = new LatheConfig();
        result.gears = o.gears;
        result.leadscrew = Pitch.fromPlainObject(o.leadscrew)!;
        result.minTeeth = o.minTeeth;
        result.maxSize = o.maxSize;
        return result;
    }
}