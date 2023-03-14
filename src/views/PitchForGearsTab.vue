<template>
    <div class="box">
        <div class="block">{{ i18n.pfgDescription }}</div>
      <div class="columns">
        <div class="column is-half">
            <GearCombinationEditor v-model:gearA="ga" v-model:gearB="gb" v-model:gearC="gc" v-model:gearD="gd" :check-required="false"/>
            <PitchSetupTable v-model="model" v-model:orderBy="orderBy" v-model:orderAscending="orderAscending" v-model:selectedItem="selectedSetup" :filter="filter"/>
        </div>
        <div class="column">
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
import PitchSetupTable, { OrderBy } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(20, null, null, 80, new Pitch(1, PitchType.Metric)),
            orderBy: OrderBy.P,
            orderAscending: true,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
        gearA: {type: Number, default: 40},
        gearB: {type: Number, default: NaN},
        gearC: {type: Number, default: NaN},
        gearD: {type: Number, default: 60}
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    function f(x:number):boolean {return Number.isNaN(x);}
                    return (f(t.ga) || v.gearA == t.ga)
                        && (f(t.gb) || v.gearB == t.gb)
                        && (f(t.gc) || v.gearC == t.gc)
                        && (f(t.gd) || v.gearD == t.gd);
                }
            }
        },
        model: {
            get(): PitchSetup[] { return this.modelValue; },
            set(v: PitchSetup[]) { this.$emit("update:modelValue", v); }
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