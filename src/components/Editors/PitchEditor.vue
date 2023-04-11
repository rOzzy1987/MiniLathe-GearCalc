<template>
 <div>
    <NumericEditor v-model="pitchVal" 
        :decimals="pitchType == PitchType.Metric ? 2 : 0" 
        :min-value="pitchType == PitchType.Metric ? .3 : 6"    
        :max-value="pitchType == PitchType.Metric ? 4 : 64" 
        :label="i18n.genericPitch" 
        :required="true"
        v-model:isValid="isPvValid" />

    <div class="field">
      <div class="control">
        <label class="radio">
            <input type="radio" name="dpt" :value="PitchType.Metric" :checked="pitchType == PitchType.Metric" @change="updateType"/>
            {{i18n.genericMetric}} ({{i18n.genericMetricUnit}})
        </label>
        <label class="radio">
            <input type="radio" name="dpt" :value="PitchType.Imperial" :checked="pitchType == PitchType.Imperial" @change="updateType"/>
            {{ i18n.genericImperial }} ({{ i18n.genericImperialUnit }})
        </label>
      </div>
    </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import NumericEditor from './NumericEditor.vue';
import GlobalConfig from '@/bll/globalConfig';

export default {
    data() {
        return {
            isPvValid: true,
            i18n: GlobalConfig.i18n,
            PitchType: PitchType
        };
    },
    props: {
        modelValue: { type: Pitch, required: true },
        isValid: {type: Boolean, deafult: true}
    },
    methods: {
        validate() {
            if (this.isValid != this.isPvValid)
                this.$emit("update:isValid", this.isPvValid);
        },
        updateType(ev: any){
            const val = ev.target.value;
            if (this.pitchType != val){
                this.pitchType = val;
            }
        }
    },
    computed: {
        pitchVal: {
            get() {return this.modelValue?.value;},
            set(val: number) {this.$emit("update:modelValue", new Pitch(val, this.modelValue?.type));}
        },
        pitchType: {
            get() {return this.modelValue?.type;},
            set(val: PitchType) {this.$emit("update:modelValue", val != this.modelValue?.type ? this.modelValue?.convert() : this.modelValue);}
        },
    },
    watch: {
        isPvValid() { this.validate(); }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
      this.validate();
    },
    emits: [
        "update:isValid",
        "update:modelValue"    
    ],
    components: { NumericEditor }
}
</script>