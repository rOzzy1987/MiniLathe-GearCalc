export default abstract class TranslationsBase{
    abstract langName: string;
    abstract langCode: string;
    abstract langUnicode: number[];
    abstract credits: string;

    langUnicodeHtml(): string {
        let result = "";
        for (let i = 0; i < this.langUnicode.length; i++) {
            const item = this.langUnicode[i];
            result += "&#"+item.toString(16)+";"
        }
        return result;
    }

    abstract appTitle: string;
    abstract appSubtitle: string;
    
    abstract tabPitchTable: string;
    abstract tabPitchForGears: string;
    abstract tabGearsForPitch: string;
    abstract tabSetup: string;
    
    abstract genericMetric: string;
    abstract genericImperial: string;
    abstract genericMetricUnit: string;
    abstract genericImperialUnit: string;
    
    abstract genericPitch: string;
    abstract genericEdit: string;
    abstract genericSave: string;
    abstract genericBack: string;
    
    abstract genericGearBMissing: string;
    abstract genericGearCMissing: string;

    abstract pitchTableNoResults: string;
    
    abstract numericShouldBeGreaterThanRaw: string;
    abstract numericShouldBeLessThanRaw: string;
    abstract numericShouldBeBetweenRaw: string;
    abstract numericRequired: string;
    abstract numericInvalid: string;
    
    numericShouldBeGreaterThan(n: number): string { return this.f(this.numericShouldBeGreaterThanRaw, [n]); }
    numericShouldBeLessThan(n: number): string { return this.f(this.numericShouldBeLessThanRaw, [n]); }
    numericShouldBeBetween(lower: number, upper: number): string { return this.f(this.numericShouldBeBetweenRaw, [lower, upper]); }
    
    abstract setupCalculate: string;
    
    abstract leadscrewSelectedPitch: string;
    abstract leadscrewDoYouKnowPitch: string;
    abstract leadscrewKnowPitch: string;
    abstract leadscrewDontKnowPitch: string;
    abstract leadscrewSampleTip: string;
    abstract leadscrewFind: string;
    abstract leadscrewLikelyMetric: string;
    abstract leadscrewLikelyImperial: string;
    abstract leadscrewNoIdea: string;
    abstract leadscrewReviewOptions: string;
    
    abstract gearsExistingGears: string;
    abstract gearsAddNew: string;
    abstract gearsAddNewTip: string;
    
    abstract otherSetAxleDistance: string;
    abstract otherAxleDistance: string;
    abstract otherAxleDistanceTip: string;
    abstract otherMaxGearSize: string;
    abstract otherMaxGearSizeTip: string;

    abstract gfpTitle: string;
    abstract pfgTitle: string;
    abstract ptTitle: string;

    abstract pfgCalculated: string;
    abstract pfgSimilar: string;
    abstract pfgPartial: string;
    abstract pfgPartialTip: string;
    abstract pfgSearchTip: string;

    f(str: string, params: Array<any>): string{
        let result = str;

        const pattern = new RegExp("\\{([0-9]+)\\}");
        if(pattern.test(str)) {
            for (let i = 0; i < 10; i++) {
                result = result.replace("{"+i+"}", params[i]);
            }
        }
        return result;
    }
}

export class EnTranslations extends TranslationsBase {
    credits: string = "2023 Mihály Rozovits";
    langName: string = "English";
    langCode: string = "en";
    langUnicode: number[] = [0x1F1FA, 0x1F1F8]; 

    appTitle: string = "Mini Lathe Change Gear Calculator";
    appSubtitle: string = "Know what you can cut, and how precisely!";

    tabPitchTable: string = "Pitch table";
    tabPitchForGears: string = "Pitch for gears";
    tabGearsForPitch: string = "Gears for pitch";
    tabSetup: string = "Configure";

    genericMetric: string = "Metric";
    genericImperial: string = "Imperial";
    genericMetricUnit: string = "mm/rev";
    genericImperialUnit: string = "TPI";

    genericPitch: string = "Pitch";
    genericEdit: string = "Edit";
    genericSave: string = "Save";
    genericBack: string = "Back";

    genericGearBMissing: string = "Gear B is required if gear C is provided";
    genericGearCMissing: string = "Gear C is required if gear B is provided";
    pitchTableNoResults: string = "No gear combinations found";

    numericShouldBeGreaterThanRaw: string = "Number should be greater than {0}";
    numericShouldBeLessThanRaw: string = "Number should be less than {0}";
    numericShouldBeBetweenRaw: string  = "Number should be between {0} and {1}";
    numericRequired: string = "Number is required";
    numericInvalid: string = "Invalid number";

    setupCalculate: string = "Calculate gear ratios";

    leadscrewSelectedPitch: string = "Your selected leadscrew pitch";
    leadscrewDoYouKnowPitch: string = "Do you know your leadscrew pitch?";
    leadscrewKnowPitch: string = "Yes";
    leadscrewDontKnowPitch: string = "No, help me";
    leadscrewSampleTip: string = "Please provide a sample gear setup for a known pitch. You'll most likely find some printed on the geartrain cover. Any one will do. It can be 4 gears, or 2 gears.";
    leadscrewFind: string = "Find my pitch!";
    leadscrewLikelyMetric: string = "Your leadscrew pitch is likely metric.";
    leadscrewLikelyImperial: string = "Your leadscrew pitch is likely imperial.";
    leadscrewNoIdea: string = "We couldn't determine your leadscrew type confidently.";
    leadscrewReviewOptions: string = "Review the calculated options and click the one you prefer:";

    gearsExistingGears: string = "Gears you have";
    gearsAddNew: string = "Add new gear";
    gearsAddNewTip: string = "Press Enter or click the button to the right to add";

    otherSetAxleDistance: string = "Set axle distance";
    otherAxleDistance: string = "Axle distance";
    otherAxleDistanceTip: string = "the distance between the driving axle and the leadscrew axle. Calculation: distance(mm) / gear module number (usually 1)";
    otherMaxGearSize: string = "Max gear size";
    otherMaxGearSizeTip: string = "The maximum gear size that will fit the machine";

    
    gfpTitle: string = "Select a pitch and see which gear combination gets you there";
    pfgTitle: string = "Find the pitch for a gear combination";
    ptTitle: string = "Example combinations for common thread pitches";

    pfgCalculated: string = "Calculated value";
    pfgSimilar: string = "Similar pitches using your gears";
    pfgPartial: string = "Partial matches using your gears";
    pfgPartialTip: string = "Note that gears A and C are interchangeable a well as B and D. This means you may have unexpected results, but trust us, it's correct. Also note that if a gear combination you expect doesn't show up here, it is likely that it wouldn't physically fit on the machine.";
    pfgSearchTip: string = "Enter a complete gear combination to calculate the resulting pitch and find similar pitch combinations you can actually use with your own gear collection. Alternatively you can find partial matches from the precalculated combinations at the bottom of the page.";
}