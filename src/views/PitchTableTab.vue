<template>
    <div>
        <div class="block">{{ i18n.ptDescription }}</div>
      <div class="box columns column-table">
        <div class="column is-half table-container">
            <PitchSetupTable :model-value="model" v-model:selectedItem="selectedSetup" :order-by="OrderBy.N"/>
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
import PitchSetupTable, {OrderBy} from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(20, null, null, 80, new Pitch(1, PitchType.Metric)),
            OrderBy: OrderBy,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        modelValue: { type: Array<PitchSetup>, default: [] },
    },
    computed: {
        model() {
            const result: PitchSetup[] = [];
            const thr = 1.003;
            const t = this;

            function f(p: Pitch){
                p = p.type == PitchType.Metric ? p : p.convert();
                let n  = t.modelValue.filter(s => s.pitch.value > p.value / thr && s.pitch.value < p.value * thr);
                
                n = n.sort((a,b) => Math.abs(p.value - a.pitch.value) - Math.abs(p.value - b.pitch.value));
                return n.length > 0 ? n[0] : null;  
            }

            function a(s: PitchSetup | null) {
                if(s == null)
                    return;
                result.push(s);
            }

            a(f(new Pitch(0.35, PitchType.Metric)));
            a(f(new Pitch(0.40, PitchType.Metric)));
            a(f(new Pitch(0.45, PitchType.Metric)));
            a(f(new Pitch(0.50, PitchType.Metric)));
            a(f(new Pitch(0.70, PitchType.Metric)));
            a(f(new Pitch(0.80, PitchType.Metric)));
            a(f(new Pitch(1.00, PitchType.Metric)));
            a(f(new Pitch(1.25, PitchType.Metric)));
            a(f(new Pitch(1.50, PitchType.Metric)));
            a(f(new Pitch(1.75, PitchType.Metric)));
            a(f(new Pitch(2.00, PitchType.Metric)));
            a(f(new Pitch(2.50, PitchType.Metric)));
            a(f(new Pitch(3.00, PitchType.Metric)));
            a(f(new Pitch(3.50, PitchType.Metric)));
            a(f(new Pitch(4.00, PitchType.Metric)));

            a(f(new Pitch(72, PitchType.Imperial)));
            a(f(new Pitch(64, PitchType.Imperial)));
            a(f(new Pitch(56, PitchType.Imperial)));
            a(f(new Pitch(48, PitchType.Imperial)));
            a(f(new Pitch(40, PitchType.Imperial)));
            a(f(new Pitch(36, PitchType.Imperial)));
            a(f(new Pitch(32, PitchType.Imperial)));
            a(f(new Pitch(28, PitchType.Imperial)));
            a(f(new Pitch(24, PitchType.Imperial)));
            a(f(new Pitch(20, PitchType.Imperial)));
            a(f(new Pitch(19, PitchType.Imperial)));
            a(f(new Pitch(18, PitchType.Imperial)));
            a(f(new Pitch(16, PitchType.Imperial)));
            a(f(new Pitch(14, PitchType.Imperial)));
            a(f(new Pitch(13, PitchType.Imperial)));
            a(f(new Pitch(12, PitchType.Imperial)));
            a(f(new Pitch(11, PitchType.Imperial)));
            a(f(new Pitch(10, PitchType.Imperial)));
            a(f(new Pitch(9, PitchType.Imperial)));
            a(f(new Pitch(8, PitchType.Imperial)));
            a(f(new Pitch(7, PitchType.Imperial)));
            a(f(new Pitch(6, PitchType.Imperial)));

            return result;
        }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    components: { GeartrainImg, PitchSetupTable }
}
</script>
<style scoped>
  td, th {
    text-align: right !important;
  }
  .column-table {
    max-height: 100%;
    overflow-x: hidden;
  }
</style>