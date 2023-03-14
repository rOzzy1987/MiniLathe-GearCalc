import TranslationsBase from "./lang";

export default class HuTranslations extends TranslationsBase{
    credits: string = "2023 Mihály Rozovits";
    langName: string = "Magyar";
    langCode: string = "hu";
    langUnicode: number[] = [0x1F1ED, 0x1F1FA];
    

    appTitle: string = "Kiseszterga váltókerék kalkulátor";
    appSubtitle: string = "Tudd mit tudsz vágni, és milyen pontosan!";

    tabPitchTable: string = "Menettáblázat";
    tabPitchForGears: string = "Menetemelkedés kombinációhoz";
    tabGearsForPitch: string = "Kombináció menetemelkedéshez";
    tabSetup: string = "Beállítás";

    genericMetric: string = "Metrikus";
    genericImperial: string = "Angolszász";
    genericMetricUnit: string = "mm/ford";
    genericImperialUnit: string = "TPI";

    genericPitch: string = "Menetemelkedés";
    genericEdit: string = "Szerkesztés";
    genericSave: string = "Mentés";
    genericBack: string = "Vissza";

    genericGearBMissing: string = "A B fogaskerék megadáa kötelező, ha a C kerék meg van adva";
    genericGearCMissing: string = "A C fogaskerék megadáa kötelező, ha a B kerék meg van adva";

    numericShouldBeGreaterThanRaw: string = "A szám nagyobb kell hogy legyen, mint {0}";
    numericShouldBeLessThanRaw: string = "A szám kisebb kell hogy legyen mint {0}";
    numericShouldBeBetweenRaw: string = "A számnak {0} és {1} közé kell esnie";
    numericRequired: string = "Kötelező megadni";
    numericInvalid: string = "Érvénytelen szám";

    setupCalculate: string = "Áttételek kiszámítása";

    leadscrewSelectedPitch: string = "Kiválasztott menetemelkedés";
    leadscrewDoYouKnowPitch: string = "Ismered a vonóorsód menetemelkedését?";
    leadscrewKnowPitch: string = "Igen";
    leadscrewDontKnowPitch: string = "Nem, segíts kideríteni";
    leadscrewSampleTip: string = "Adj meg egy tetzőleges kerékkombinációt egy ismert menetemelkedéhez. Valószínűleg az esztergád oldalán találsz párat. Bármelyik jó. Lehet 2 vagy 4 kerekes kombináció is.";
    leadscrewFind: string = "Keresd meg!";
    leadscrewLikelyMetric: string = "A vonóorsód valózínűleg metrikus.";
    leadscrewLikelyImperial: string = "A vonóorsód valózínűleg angolszász.";
    leadscrewNoIdea: string = "Nem tudtuk megállapítani a vonóorsód típusát. ";
    leadscrewReviewOptions: string = "Nézd át a talált értékeket, és válassz egyet:";

    gearsExistingGears: string = "Fogaskerekeid";
    gearsAddNew: string = "Új fogaskerék";
    gearsAddNewTip: string = "Nyomd meg az Entert vagy kattints a jobb oldali gombra a hozzáadáshoz";

    otherSetAxleDistance: string = "Tengelytávolág beállítása";
    otherAxleDistance: string = "Tengelytávolság";
    otherAxleDistanceTip: string = "A meghajtó tengely és a vonóorsó tengelyének távolsága. Számítás: hossz(mm) / modulszám (általában 1)";
    otherMaxGearSize: string = "Legnagyobb megengedett fogaskerék";
    otherMaxGearSizeTip: string = "A legnagyobb fogaskerék ami még befér a gépedbe";

    gfpDescription: string = "Adj meg egy menetemelkedést, és megkeressük a hozzá taartozó fogaskerék kombinációkat";
    pfgDescription: string = "Böngéssz a kombinációk között hogy lásd milyen menetemelkedést eredményeznek";
    ptDescription: string = "Itt a gyakori menetemelkedésekhez találhatsz példákat";
}