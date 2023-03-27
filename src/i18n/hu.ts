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
    pitchTableNoResults: string = "Nincs megfelelő kombináció";

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

    gfpTitle: string = "Adj meg egy menetemelkedést, és megkeressük a hozzá taartozó fogaskerék kombinációkat";
    pfgTitle: string = "Találd meg a kombinációhoz tartozó menetemelkedést";
    ptTitle: string = "Itt a gyakori menetemelkedésekhez találhatsz példákat";

    ptName: string = "Név";

    ptMetricCoarse: string = "Metrikus menetek";
    ptMetricFine: string = "Metrikus finom menetek";
    ptMetricSuperfine: string = "Metrikus extra finom menetek";
    ptImperialCoarse: string = "Angolszász menetek";
    ptImperialFine: string = "Angolszász finom menetek";
    ptBritishPipe: string = "Angolszász csőmenetek";

    pfgCalculated: string = "Számított érték";
    pfgSimilar: string = "Hasonló menetemelkedések a te fogakerekeiddel";
    pfgPartial: string = "Részleges egyezések a te fogakerekeiddel";
    pfgPartialTip: string = "Az A és C valamint a B és D fogaskerekek felcserélhetőek. Emiatt picit furcsa értékek is kijöhetnek, de hidd el, helyesek. Szintén megjegyzendő, hogy ha egy várt kombináció nem jelenik meg itt, akkor valószínűleg azért, mert nem fér el fizikailag a gépben.";
    pfgSearchTip: string = "Adj meg egy komplett kombinációt hogy kiszámold a hozzá tartozó menetemelkedést, és találj hasonló kombinációkat amiket a saját fogakerekeiddel be is tudsz állítani. Vagy ha csak részleges egyezéseket szeretnél keresni, megtalálod őket a lap alján.";
}