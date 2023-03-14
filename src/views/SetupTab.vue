<template>
    <div>
      <div class="box">
        <LeadscrewWizard v-model="pitch"/>
      </div>
      <div class="box">
        <GearListEditor v-model="gears" />
      </div>
      <div class="box">
        <OtherParamsEditor v-model:distance="distance" v-model:maxSize="maxSize" />
      </div>
      <div class="control">
        <div class="buttons">
            <button class="button is-primary" @click.prevent="saveConfig">{{ i18n.setupCalculate }}</button>
        </div>
      </div>
    </div>
</template>
<script lang="ts">

import LatheConfig from '@/bll/latheConfig';
import { Pitch, PitchType } from '@/bll/pitch';
import GearListEditor from '../components/GearListEditor.vue';
import LeadscrewWizard from '../components/LeadscrewWizard.vue';
import OtherParamsEditor from '@/components/OtherParamsEditor.vue';
import GlobalConfig from '@/bll/globalConfig';


export default {
    data(props) {
        var mv = props.modelValue;
        var gears = mv?.gears;
        var pitch = mv?.leadscrew;
        var distance = mv?.minTeeth;
        var maxSize = mv?.maxSize;
        return {
            gears: gears ?? [20,20,30,35,40,40,45,50,55,57,60,65,80,80],
            pitch: pitch ?? new Pitch(1.5, PitchType.Metric),
            distance: distance ?? 85,
            maxSize: maxSize ?? 130,
            i18n: GlobalConfig.i18n
        };
    },
    props: {
      modelValue: {type: LatheConfig, default: null, required: false }
    },
    methods: {
        saveConfig(){
            var config = new LatheConfig();
            config.gears = this.gears.slice();
            config.leadscrew = this.pitch;
            config.minTeeth = this.distance;
            config.maxSize = this.maxSize;
            this.$emit("update:modelValue", config);
        }
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    components: { GearListEditor, LeadscrewWizard, OtherParamsEditor }
}
</script>