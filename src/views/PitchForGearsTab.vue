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
            <GeartrainImg :gear-a="selectedSetup?.gearA" :gear-b="selectedSetup?.gearB" :gear-c="selectedSetup?.gearC" v-bind:gear-d="selectedSetup?.gearD" :scale="2"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import { PitchSetup } from '@/bll/pitchSetup';
import GearCombinationEditor from '@/components/GearCombinationEditor.vue';
import GeartrainImg from '@/components/GeartrainImg.vue';
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';
import CombinationFinder from '@/bll/combinationFinder';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(20, null, null, 80, new Pitch(1, PitchType.Metric)),
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
        gearA: {type: Number, default: NaN},
        gearB: {type: Number, default: NaN},
        gearC: {type: Number, default: NaN},
        gearD: {type: Number, default: NaN}
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    function f(x:number):boolean {return Number.isNaN(x);}
                    return (
                        ((f(t.ga) || v.gearA == t.ga) && (f(t.gc) || v.gearC == t.gc)) ||
                        ((f(t.ga) || v.gearC == t.ga) && (f(t.gc) || v.gearA == t.gc))
                     ) && (
                        ((f(t.gb) || v.gearB == t.gb) && (f(t.gd) || v.gearD == t.gd)) ||
                        ((f(t.gb) || v.gearD == t.gb) && (f(t.gd) || v.gearB == t.gd))
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