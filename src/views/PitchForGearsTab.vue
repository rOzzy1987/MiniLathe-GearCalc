<template>
    <div class="box">
        <div class="block">
            <p>{{ i18n.pfgTitle }}</p>
            <p class="help">{{ i18n.pfgSearchTip }}</p>
        </div>
      <div class="columns">
        <div class="column">
            <GearCombinationEditor v-model:gearA="ga" v-model:gearB="gb" v-model:gearC="gc" v-model:gearD="gd" v-model:isComboValid="isGearComboValid" :checkRequired="false"/>
            <div class="block" >
                <p>{{ i18n.pfgCalculated }}</p>
                <PitchSetupTable :modelValue="exactMatch" v-model:selectedItem="selectedSetup" :isSortable="false"/>
            </div>

            <div class="block" >
                <p>{{ i18n.pfgSimilar }}</p>
                <PitchSetupTable :modelValue="similarMatches" v-model:orderBy="orderBy" v-model:orderAscending="orderAscending" v-model:selectedItem="selectedSetup" 
                :isExportEnabled="true" :isPrintEnabled="true" :row-commands="rowCommands"/>
            </div>

            <div class="block" >
                <p>{{i18n.pfgPartial}}</p>
                <p class="help">{{i18n.pfgPartialTip}}</p>
                <PitchSetupTable v-model="model" v-model:orderBy="orderBy" v-model:orderAscending="orderAscending" v-model:selectedItem="selectedSetup" 
                :filter="filter" :isExportEnabled="true" :isPrintEnabled="true" :itemsPerPage="20" :row-commands="rowCommands" :is-items-per-page-editable="true"/>
            </div>
                </div>
        <div class="column no-print">
            <GeartrainImg 
                :gear-a="selectedSetup?.gearA ?? undefined" 
                :gear-b="selectedSetup?.gearB ?? undefined" 
                :gear-c="selectedSetup?.gearC ?? undefined" 
                :gear-d="selectedSetup?.gearD ?? undefined" 
                :scale="2"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import { PitchSetup } from '@/bll/pitchSetup';
import GeartrainImg from '@/components/Graphics/GeartrainImg.vue';
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';
import CombinationFinder from '@/bll/combinationFinder';
import { Gear, Gears } from '@/bll/gear';
import GearCombinationEditor from '@/components/Editors/GearCombinationEditor.vue';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(Gear.fromString("M1Z20"), undefined, undefined, Gear.fromString("M1Z80"), new Pitch(1, PitchType.Metric)),
            orderBy: "pm",
            orderAscending: true,
            isGearComboValid: true,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            comboFinder: new CombinationFinder(),
            i18n: GlobalConfig.i18n,
        }
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
        leadscrew: {type: Pitch, required: true},
        gearA: {type: Gear},
        gearB: {type: Gear},
        gearC: {type: Gear},
        gearD: {type: Gear}
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    return (
                        ((t.ga == undefined || Gears.equal(t.ga, v.gearA)) && (t.gc == undefined || Gears.equal(t.gc, v.gearC))) ||
                        ((t.ga == undefined || Gears.equal(t.ga, v.gearC)) && (t.gc == undefined || Gears.equal(t.gc, v.gearA)))
                     ) && (
                        ((t.gb == undefined || Gears.equal(t.gb, v.gearB)) && (t.gd == undefined || Gears.equal(t.gd, v.gearD))) ||
                        ((t.gb == undefined || Gears.equal(t.gb, v.gearD)) && (t.gd == undefined || Gears.equal(t.gd, v.gearB)))
                     );
                }
            }
        },
        model: {
            get(): PitchSetup[] { return this.modelValue; },
            set(v: PitchSetup[]) { this.$emit("update:modelValue", v); }
        },
        exactMatch(): PitchSetup[] {
            return this.isGearComboValid 
                ? [this.comboFinder.findMetricPitch(this.gearA,this.gearB,this.gearC,this.gearD, this.leadscrew)] 
                : [];
        },
        similarMatches(){
            const pitch = this.exactMatch[0]?.pitch;
            const thr = 1.003;
            return this.isGearComboValid
                ? this.modelValue.filter(p => p.pitch.value > pitch.value / thr && p.pitch.value < pitch.value * thr)
                : [];
        },
        ga: {
            get() { return this.gearA; },
            set(v: number) { this.$emit("update:gearA", v); }
        },
        gb: {
            get() { return this.gearB; },
            set(v: number) { this.$emit("update:gearB", v); }
        },
        gc: {
            get() { return this.gearC; },
            set(v: number) { this.$emit("update:gearC", v); }
        },
        gd: {
            get() { return this.gearD; },
            set(v: number) { this.$emit("update:gearD", v); }
        },
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    components: { GeartrainImg, PitchSetupTable, GearCombinationEditor }
}
</script>
<style scoped>
  td, th {
    text-align: right !important;
  }
</style>