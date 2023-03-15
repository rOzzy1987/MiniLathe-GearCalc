<template>
    <div class="box">
        <div class="block">{{ i18n.gfpTitle }}</div>
      <div class="columns">
        <div class="column is-half">
            <PitchEditor v-model:pitch="dpv" v-model:pitchType="dpt" v-model:isValid="isPitchValid"/>
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
import GeartrainImg from '@/components/GeartrainImg.vue';
import PitchEditor from '@/components/PitchEditor.vue';
import PitchSetupTable, { OrderBy } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(20, null, null, 80, new Pitch(1, PitchType.Metric)),
            orderBy: OrderBy.P,
            orderAscending: true,
            threshold: 1.003,
            isPitchValid: true,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
        desiredPitch: { type: Pitch, default: new Pitch(1, PitchType.Metric) }
    },
    computed: {
        filter() {
            const t = this;
            return {
                filter(v: PitchSetup):boolean {
                    var p = t.dpt == v.pitch.type
                        ? v.pitch : v.pitch.convert();
                    return p.value > t.dpv / t.threshold 
                        && p.value < t.dpv * t.threshold 
                }
            }
        },
        model: {
            get(): PitchSetup[] { return this.modelValue; },
            set(v: PitchSetup[]) { this.$emit("update:modelValue", v); }
        },
        dpv: {
            get() { return this.desiredPitch.value; },
            set(v: number) { this.$emit("update:desiredPitch", new Pitch(v, this.dpt)); }
        },
        dpt: {
            get() { return this.desiredPitch.type; },
            set(v: number) { this.$emit("update:desiredPitch", new Pitch(this.dpv, v)); }
        },
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    components: { GeartrainImg, PitchSetupTable, PitchEditor }
}
</script>
<style scoped>
  td, th {
    text-align: right !important;
  }
</style>