import { Gear, Gears } from "@/bll/gear"
import GlobalConfig from "@/bll/globalConfig";
import GcMath from "@/bll/math";
import { PitchType, type Pitch } from "@/bll/pitch";

export class GearHelper {

    private static get config() {return GlobalConfig.config; }

    public static sortFn = function(a: Gear, b: Gear) { return Gears.compare(a,b); };
    public static formatFn = function(g: Gear, hideModuleFn: () => boolean = () => false) { 
        return g == undefined || g == null ? "" : GearHelper.config.isMultiModule && !hideModuleFn() ? g.toString() : g.teeth.toFixed(0); 
    }
}

export class PitchHelper {
    
    public static sortFn = function(a: Pitch, b: Pitch) { return a.value - b.value; }

    private static sortValue(p: Pitch, asc: boolean, prefer: PitchType | undefined = undefined) {
        const v = prefer == undefined || p.type == prefer ?  p.value : p.convert().value;
        const pv = prefer == undefined 
            ? 0
            : asc != (prefer == PitchType.Metric) 
                ? (-p.type) * 1000
                : p.type * 1000;
        return pv+v;
    }
    private static sortFnPreferType(t: PitchType) {
        return (a: Pitch, b: Pitch, asc: boolean = true) => { return PitchHelper.sortValue(a, asc, t) - PitchHelper.sortValue(b, asc, t); };
    }

    public static sortFnPreferMetric = this.sortFnPreferType(PitchType.Metric);
    public static sortFnPreferImperial = this.sortFnPreferType(PitchType.Imperial);

    public static formatFn = function(p: Pitch) {
        return p == null || p == undefined ? "" : GcMath.round(p.value, 0.001).toFixed(3) + " " + (p.type == PitchType.Metric ? "mm/rev" : "TPI");
    }
    public static formatFnShowMetric = function(p: Pitch) {
        return p == null || p == undefined ? "" : PitchHelper.formatFn(p.type == PitchType.Metric ? p : p.convert());
    }
    public static formatFnShowImperial = function(p: Pitch) {
        return p == null || p == undefined ? "" : PitchHelper.formatFn(p.type == PitchType.Metric ? p.convert() : p);
    }
}

