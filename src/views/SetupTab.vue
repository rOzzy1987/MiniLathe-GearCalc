<template>
    <div>
      <div class="box">
        <LeadscrewWizard v-model="pitch" @saved="saveConfig"/>
      </div>
      <div class="box">
        <GearListEditor v-model="gears" v-model:maxSize="maxSize" @saved="saveConfig" />
      </div>
      <div class="box">
        <OtherParamsEditor v-model:distance="distance" v-model:maxSize="maxSize" @saved="saveConfig" />
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
import GearListEditor from '../components/Editors/GearListEditor.vue';
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
            gears,
            pitch,
            distance: distance,
            maxSize: maxSize,
            i18n: GlobalConfig.i18n
        };
    },
    props: {
      modelValue: {type: LatheConfig, default: null, required: true }
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