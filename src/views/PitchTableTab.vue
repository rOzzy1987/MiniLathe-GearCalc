<template>
    <div class="box">
        <div class="block">
            <p>{{ i18n.ptTitle }}</p>
        </div>
      <div class="columns column-table">
        <div class="column">
            <div class="block">
                <div class="title is-3">{{ i18n.ptMetricCoarse }}</div>
                <DataGrid v-model="metricModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
            <div class="block">
                <div class="title is-3">{{ i18n.ptMetricFine }}</div>
                <DataGrid v-model="metricFineModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
            <div class="block">
                <div class="title is-3">{{ i18n.ptMetricSuperfine }}</div>
                <DataGrid v-model="metricSFineModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
            <div class="block">
                <div class="title is-3">{{ i18n.ptImperialCoarse }}</div>
                <DataGrid v-model="imperialModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
            <div class="block">
                <div class="title is-3">{{ i18n.ptImperialFine }}</div>
                <DataGrid v-model="imperialFineModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
            <div class="block">
                <div class="title is-3">{{ i18n.ptBritishPipe }}</div>
                <DataGrid v-model="bspModel" v-model:columns="cols" :is-sortable="false" :selection-mode="GridSelectionMode.One" v-model:selectedItems="selectedItems" :isExportEnabled="isExportEnabled" :isPrintEnabled="isPrintEnabled" :row-commands="rowCommands" :exportText="i18n.genericExportCsv" :emptyText="i18n.genericEmpty"/>
            </div>
        </div>
        <div class="column no-print">
            <GeartrainImg 
                :gear-a="selectedSetup?.gearA ?? undefined" 
                :gear-b="selectedSetup?.gearB ?? undefined" 
                :gear-c="selectedSetup?.gearC ?? undefined" 
                :gear-d="selectedSetup?.gearD ?? undefined" 
                :min-teeth="config.minTeeth"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import { PitchSetup } from '@/bll/pitchSetup';
import GeartrainImg from '@/components/Graphics/GeartrainImg.vue';
import GlobalConfig from '@/bll/globalConfig';
import DataGrid, { GridSelectionMode } from '@/grid/DataGrid.vue';
import { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import { Gear } from '@/bll/gear';
import { GearHelper, PitchHelper } from '@/components/gridHelpers';
import { GridColumnDefinition } from '@/grid/GridColumnDefinition';
import { DeviceHelper } from '@/bll/device';

class NamedPitchSetup extends PitchSetup {
    public name: string = null!;

    public static fromSetup(s: PitchSetup): NamedPitchSetup {
        return new NamedPitchSetup(s.gearA, s.gearB, s.gearC, s.gearD, s.pitch);
    }

    public withName(name: string): NamedPitchSetup {
        this.name = name;
        return this;
    }

    public withType(type: PitchType): NamedPitchSetup {
        if (this.pitch.type != type)
            this.pitch = this.pitch.convert();
        return this;
    }
}

export default {
    data(){
        const i18n = GlobalConfig.i18n;
        return {
            selectedSetup: new NamedPitchSetup(Gear.fromString("M1Z20"), undefined, undefined, Gear.fromString("M1Z80"), new Pitch(1, PitchType.Metric)),
            cols: [
                new GridColumnDefinition("name", i18n.ptName, i => i.name),
                new GridColumnDefinition("a", "A", i => i.gearA)
                    .withFormat(GearHelper.formatFn)
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("b", "B", i => i.gearB)
                    .withFormat(GearHelper.formatFn)
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("c", "C", i => i.gearC)
                    .withFormat(GearHelper.formatFn)
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("d", "D", i => i.gearD)
                    .withFormat(GearHelper.formatFn)
                    .withExportFn(g => g.toString())
                    .withSortForValues(GearHelper.sortFn)
                    .withStyle("width: 10%").withAlignRight().withHeaderAlignRight(),
                new GridColumnDefinition("p", "P", i => i.pitch, i18n.genericPitch)
                    .withFormat(PitchHelper.formatFn)
                    .withStyle("width: 30%").withAlignRight().withHeaderAlignRight(),
            ],
            isPrintEnabled: false,
            metricModel: [] as NamedPitchSetup[],
            metricFineModel: [] as NamedPitchSetup[],
            metricSFineModel: [] as NamedPitchSetup[],
            imperialModel: [] as NamedPitchSetup[],
            imperialFineModel: [] as NamedPitchSetup[],
            bspModel: [] as NamedPitchSetup[],
            combos: GlobalConfig.combos,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            isExportEnabled: true,
            config: GlobalConfig.config,
            i18n,
            GridSelectionMode: GridSelectionMode
        }
    },
    mounted() {
        this.computeModel();
    },
    async created() {
        this.isPrintEnabled = !await DeviceHelper.isNativeApp();
    },
    methods: {
        computeModel() {
            const result: NamedPitchSetup[] = [];
            const thr = 1.003;
            const t = this;

            t.metricModel = [];
            t.metricFineModel = [];
            t.metricSFineModel = [];
            t.imperialModel = [];
            t.imperialFineModel = [];
            t.bspModel = [];

            function f(p: Pitch, name: string){
                let type = p.type;
                p = p.type == PitchType.Metric ? p : p.convert();
                let n  = t.combos.filter(s => s.pitch.value > p.value / thr && s.pitch.value < p.value * thr);
                
                n = n.sort((a,b) => Math.abs(p.value - a.pitch.value) - Math.abs(p.value - b.pitch.value));

                return n.length > 0 
                    ? NamedPitchSetup.fromSetup(n[0]).withName(name).withType(type)
                    : null;  
            }

            function a(s: NamedPitchSetup | null, arr: NamedPitchSetup[]) {
                if(s == null)
                    return;
                arr.push(s);
            }

            a(f(new Pitch(0.35, PitchType.Metric), "M1.6"), this.metricModel);
            a(f(new Pitch(0.40, PitchType.Metric), "M2"), this.metricModel);
            a(f(new Pitch(0.45, PitchType.Metric), "M2.5"), this.metricModel);
            a(f(new Pitch(0.50, PitchType.Metric), "M3"), this.metricModel);
            a(f(new Pitch(0.70, PitchType.Metric), "M4"), this.metricModel);
            a(f(new Pitch(0.80, PitchType.Metric), "M5"), this.metricModel);
            a(f(new Pitch(1.00, PitchType.Metric), "M6"), this.metricModel);
            a(f(new Pitch(1.25, PitchType.Metric), "M8"), this.metricModel);
            a(f(new Pitch(1.50, PitchType.Metric), "M10"), this.metricModel);
            a(f(new Pitch(1.75, PitchType.Metric), "M12"), this.metricModel);
            a(f(new Pitch(2.00, PitchType.Metric), "M14"), this.metricModel);
            a(f(new Pitch(2.00, PitchType.Metric), "M16"), this.metricModel);
            a(f(new Pitch(2.50, PitchType.Metric), "M20"), this.metricModel);
            a(f(new Pitch(3.00, PitchType.Metric), "M24"), this.metricModel);
            a(f(new Pitch(3.00, PitchType.Metric), "M27"), this.metricModel);
            a(f(new Pitch(3.50, PitchType.Metric), "M30"), this.metricModel);
            a(f(new Pitch(3.50, PitchType.Metric), "M33"), this.metricModel);
            a(f(new Pitch(4.00, PitchType.Metric), "M36"), this.metricModel);
            a(f(new Pitch(4.00, PitchType.Metric), "M39"), this.metricModel);
            
            a(f(new Pitch(1.00, PitchType.Metric), "M8 Fine"), this.metricFineModel);
            a(f(new Pitch(1.25, PitchType.Metric), "M10 Fine"), this.metricFineModel);
            a(f(new Pitch(1.50, PitchType.Metric), "M12 Fine"), this.metricFineModel);
            a(f(new Pitch(1.50, PitchType.Metric), "M16 Fine"), this.metricFineModel);
            a(f(new Pitch(1.50, PitchType.Metric), "M20 Fine"), this.metricFineModel);
            a(f(new Pitch(2.00, PitchType.Metric), "M24 Fine"), this.metricFineModel);
            a(f(new Pitch(2.00, PitchType.Metric), "M30 Fine"), this.metricFineModel);
            a(f(new Pitch(3.00, PitchType.Metric), "M36 Fine"), this.metricFineModel);
            a(f(new Pitch(3.00, PitchType.Metric), "M39 Fine"), this.metricFineModel);

            a(f(new Pitch(1.00, PitchType.Metric), "M10 Super fine"), this.metricSFineModel);
            a(f(new Pitch(1.25, PitchType.Metric), "M12 Super fine"), this.metricSFineModel);

            a(f(new Pitch(64, PitchType.Imperial), "UNC #1"), this.imperialModel);
            a(f(new Pitch(56, PitchType.Imperial), "UNC #2"), this.imperialModel);
            a(f(new Pitch(48, PitchType.Imperial), "UNC #3"), this.imperialModel);
            a(f(new Pitch(40, PitchType.Imperial), "UNC #4"), this.imperialModel);
            a(f(new Pitch(40, PitchType.Imperial), "UNC #5"), this.imperialModel);
            a(f(new Pitch(32, PitchType.Imperial), "UNC #6"), this.imperialModel);
            a(f(new Pitch(32, PitchType.Imperial), "UNC #8"), this.imperialModel);
            a(f(new Pitch(24, PitchType.Imperial), "UNC #10"), this.imperialModel);
            a(f(new Pitch(24, PitchType.Imperial), "UNC #12"), this.imperialModel);
            a(f(new Pitch(20, PitchType.Imperial), "UNC 1/4"), this.imperialModel);
            a(f(new Pitch(18, PitchType.Imperial), "UNC 5/16"), this.imperialModel);
            a(f(new Pitch(16, PitchType.Imperial), "UNC 3/8"), this.imperialModel);
            a(f(new Pitch(14, PitchType.Imperial), "UNC 7/16"), this.imperialModel);
            a(f(new Pitch(13, PitchType.Imperial), "UNC 1/2"), this.imperialModel);
            a(f(new Pitch(12, PitchType.Imperial), "UNC 9/16"), this.imperialModel);
            a(f(new Pitch(11, PitchType.Imperial), "UNC 5/8"), this.imperialModel);
            a(f(new Pitch(10, PitchType.Imperial), "UNC 3/4"), this.imperialModel);
            a(f(new Pitch(9 , PitchType.Imperial), "UNC 7/8"), this.imperialModel);
            a(f(new Pitch(8 , PitchType.Imperial), "UNC 1"), this.imperialModel);
            a(f(new Pitch(7 , PitchType.Imperial), "UNC 1 1/8"), this.imperialModel);
            a(f(new Pitch(7 , PitchType.Imperial), "UNC 1 1/4"), this.imperialModel);
            a(f(new Pitch(6 , PitchType.Imperial), "UNC 1 1/2"), this.imperialModel);

            a(f(new Pitch(64, PitchType.Imperial), "UNF #2"), this.imperialFineModel);
            a(f(new Pitch(56, PitchType.Imperial), "UNF #3"), this.imperialFineModel);
            a(f(new Pitch(48, PitchType.Imperial), "UNF #4"), this.imperialFineModel);
            a(f(new Pitch(44, PitchType.Imperial), "UNF #5"), this.imperialFineModel);
            a(f(new Pitch(40, PitchType.Imperial), "UNF #6"), this.imperialFineModel);
            a(f(new Pitch(36, PitchType.Imperial), "UNF #8"), this.imperialFineModel);
            a(f(new Pitch(32, PitchType.Imperial), "UNF #10"), this.imperialFineModel);
            a(f(new Pitch(28, PitchType.Imperial), "UNF #12"), this.imperialFineModel);
            a(f(new Pitch(28, PitchType.Imperial), "UNF 1/4"), this.imperialFineModel);
            a(f(new Pitch(24, PitchType.Imperial), "UNF 5/16"), this.imperialFineModel);
            a(f(new Pitch(24, PitchType.Imperial), "UNF 3/8"), this.imperialFineModel);
            a(f(new Pitch(20, PitchType.Imperial), "UNF 7/16"), this.imperialFineModel);
            a(f(new Pitch(20, PitchType.Imperial), "UNF 1/2"), this.imperialFineModel);
            a(f(new Pitch(18, PitchType.Imperial), "UNF 9/16"), this.imperialFineModel);
            a(f(new Pitch(18, PitchType.Imperial), "UNF 5/8"), this.imperialFineModel);
            a(f(new Pitch(16, PitchType.Imperial), "UNF 3/4"), this.imperialFineModel);
            a(f(new Pitch(14, PitchType.Imperial), "UNF 7/8"), this.imperialFineModel);
            a(f(new Pitch(14, PitchType.Imperial), "UNF 1"), this.imperialFineModel);
            a(f(new Pitch(12, PitchType.Imperial), "UNF 1 1/8"), this.imperialFineModel);
            a(f(new Pitch(11, PitchType.Imperial), "UNF 1 1/4"), this.imperialFineModel);
            a(f(new Pitch(10, PitchType.Imperial), "UNF 1 1/2"), this.imperialFineModel);
            
            a(f(new Pitch(28, PitchType.Imperial), "G 1/8"), this.bspModel);
            a(f(new Pitch(19, PitchType.Imperial), "G 1/4"), this.bspModel);
            a(f(new Pitch(19, PitchType.Imperial), "G 3/8"), this.bspModel);
            a(f(new Pitch(14, PitchType.Imperial), "G 1/2"), this.bspModel);
            a(f(new Pitch(14, PitchType.Imperial), "G 3/4"), this.bspModel);
            a(f(new Pitch(11, PitchType.Imperial), "G 1"), this.bspModel);
            a(f(new Pitch(11, PitchType.Imperial), "G 1 1/4"), this.bspModel);
            a(f(new Pitch(11, PitchType.Imperial), "G 1 1/2"), this.bspModel);

            return result;
        },
    },
    computed: {
        selectedItems: {
            get(): NamedPitchSetup[] { return [this.selectedSetup]; },
            set(v: NamedPitchSetup[]) { this.selectedSetup = v[0]; }
        },        
        isMultiModule() {
            return this.config.isMultiModule; 
        }
    },
    components: { GeartrainImg, DataGrid }
}
</script>