<template>
    <div>
      <div class="box">
        <LeadscrewWizard v-model="pitch"/>
      </div>
      <div class="box">
        <GearListEditor v-model="gears" />
      </div>
      <div class="control">
        <div class="buttons">
            <button class="button is-primary" @click.prevent="saveConfig">Save data</button>
        </div>
      </div>
    </div>
</template>
<script lang="ts">

import LatheConfig from '@/bll/latheConfig';
import { Pitch, PitchType } from '@/bll/pitch';
import GearListEditor from '../components/GearListEditor.vue';
import LeadscrewWizard from '../components/LeadscrewWizard.vue';


export default {
    data(props) {
        var mv = props.modelValue;
        var gears = mv?.gears;
        var pitch = mv?.leadscrew;
        return {
            gears: gears ?? [20,20,30,35,40,40,45,50,55,57,60,65,80,80],
            pitch: pitch ?? new Pitch(1.5, PitchType.Metric) 
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
            this.$emit("update:modelValue", config);
        }
    },
    components: { GearListEditor, LeadscrewWizard }
}
</script>