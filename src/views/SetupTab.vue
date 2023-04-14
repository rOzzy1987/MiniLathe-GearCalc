<template>
    <div>
      <div class="box">
        <LeadscrewWizard v-model="pitch" @saved="saveConfig"/>
      </div>
      <div class="box">
        <GearListEditor v-model="gears" v-model:maxSize="maxSize" @saved="saveConfig" />
      </div>
      <div class="box">
        <OtherParamsEditor v-model:distance="distance" v-model:maxSize="maxSize" v-model:geartrain-size="geartrainSize" @saved="saveConfig" />
      </div>
      <div class="box">
        <div class="control">
          <div class="field">
            <label class="label">Language</label>
            <language-selector />
          </div>  
        </div>
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
import CombinationFinder from '@/bll/combinationFinder';
import LanguageSelector from '@/components/LanguageSelector.vue';

export default {
    data() {
        var mv = GlobalConfig.config;
        var gears = mv?.gears;
        var pitch = mv?.leadscrew;
        var distance = mv?.minTeeth;
        var maxSize = mv?.maxSize;
        var geartrainSize = mv?.geartrainSize;
        var combinator = new CombinationFinder();
        var worker = combinator.createWorker(r => GlobalConfig.combos = r, b => this.setLoading(b), p => this.setProgress(p));
        return {
            gears,
            pitch,
            distance,
            maxSize,
            geartrainSize,
            worker,
            combinator,
            i18n: GlobalConfig.i18n,
        };
    },
    props: {
      isBusy: { type: Boolean },
      progress: { type: Number }
    },
    methods: {
        async saveConfig(){
            var config = new LatheConfig();
            config.gears = this.gears.slice();
            config.leadscrew = this.pitch;
            config.minTeeth = this.distance;
            config.maxSize = this.maxSize;
            config.geartrainSize = this.geartrainSize;
            GlobalConfig.config = config;

            this.combinator.runWorker(config.gears, config.leadscrew, this.worker);
        },
        setLoading(l: boolean) { this.$emit("update:isBusy", l); },
        setProgress(p: number) { this.$emit("update:progress", p); }
    },
    components: { GearListEditor, LeadscrewWizard, OtherParamsEditor, LanguageSelector }
}
</script>