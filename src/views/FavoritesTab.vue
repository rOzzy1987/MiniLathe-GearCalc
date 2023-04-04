<template>
    <div class="box">
        <div class="block">{{ i18n.favTitle }}</div>
      <div class="columns">
        <div class="column is-half">
            <PitchSetupTable 
                v-model="model" 
                v-model:orderBy="orderBy" 
                v-model:orderAscending="orderAscending" 
                v-model:selectedItem="selectedSetup" 
                :isExportEnabled="true"
                :isPrintEnabled="true"
                :row-commands="rowCommands"/>
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
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(20, null, null, 80, new Pitch(1, PitchType.Metric)),
            orderBy: 4,
            orderAscending: true,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        desiredPitch: { type: Pitch, default: new Pitch(1, PitchType.Metric) }
    },
    computed: {
        model: {
            get(): PitchSetup[] { return GlobalConfig.favorites; },
            set(v: PitchSetup[]) { console.log("set value"); }
        },
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
    },
    components: { GeartrainImg, PitchSetupTable }
}
</script>