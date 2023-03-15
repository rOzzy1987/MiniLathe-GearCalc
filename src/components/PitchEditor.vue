<template>
 <div>
    <NumericEditor v-model="pitchEdit" 
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
import { INCH, PitchType } from '@/bll/pitch';
import NumericEditor from './NumericEditor.vue';
import GlobalConfig from '@/bll/globalConfig';

export default {
    data() {
        return {
            isPvValid: true,
            PitchType: PitchType,
            i18n: GlobalConfig.i18n
        };
    },
    props: {
        pitch: { type: Number, default: 1 },
        pitchType: { type: Number, default: PitchType.Metric },
        isValid: {type: Boolean, deafult: true}
    },
    methods: {
        updateValue(event: any) {
            const val = Number(event.target.value);
            this.updateValueImpl(val);
        },
        updateValueImpl(val: number) {
            if (this.pitch != val) {
                this.$emit("update:pitch", val);
            }
        },
        updateType(event: any) {
            const val = Number(event.target.value);
            this.updateTypeImpl(val);
        },
        updateTypeImpl(val: number) {
            if (this.pitchType != val) {
                this.updateValueImpl(INCH / this.pitch);
                this.$emit("update:pitchType", val);
            }
        },
        validate() {
            if (this.isValid != this.isPvValid)
                this.$emit("update:isValid", this.isPvValid);
        }
    },
    computed: {
        pitchEdit: {
            get() {return this.pitch;},
            set(val: number) {this.updateValueImpl(val);}
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
        "update:pitch",
        "update:pitchType"    
    ],
    components: { NumericEditor }
}
</script>