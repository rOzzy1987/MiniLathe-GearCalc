<template>
    <div class="box">
        <div class="block">{{ i18n.favTitle }}</div>
      <div class="columns">
        <div class="column">
            <PitchSetupTable 
                v-model="model" 
                v-model:orderBy="orderBy" 
                v-model:orderAscending="orderAscending" 
                v-model:selectedItem="selectedSetup" 
                :isExportEnabled="true"
                :isPrintEnabled="true"
                :row-commands="rowCommands"/>
        </div>
        <div class="column no-print">
            <GeartrainImg 
                :gear-a="selectedSetup?.gearA ?? undefined" 
                :gear-b="selectedSetup?.gearB ?? undefined" 
                :gear-c="selectedSetup?.gearC ?? undefined" 
                :gear-d="selectedSetup?.gearD ?? undefined"
                :min-teeth="config.minTeeth"/>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Pitch, PitchType } from '@/bll/pitch';
import { PitchSetup } from '@/bll/pitchSetup';
import GeartrainImg from '@/components/Graphics/GeartrainImg.vue';
import PitchSetupTable, { AddToFavoritesRowCommand, RemoveFavoriteRowCommand } from '@/components/PitchSetupTable.vue';
import GlobalConfig from '@/bll/globalConfig';
import { Gear } from '@/bll/gear';


export default {
    data(){
        return {
            selectedSetup: new PitchSetup(Gear.fromString("M1Z20"), undefined, undefined, Gear.fromString("M1Z80"), new Pitch(1, PitchType.Metric)),
            orderBy: "pm",
            orderAscending: true,
            rowCommands: [new AddToFavoritesRowCommand(), new RemoveFavoriteRowCommand()],
            config: GlobalConfig.config,
            model: GlobalConfig.favorites,
            i18n: GlobalConfig.i18n
        }
    },
    props: {
        desiredPitch: { type: Pitch, default: new Pitch(1, PitchType.Metric) }
    },
    components: { GeartrainImg, PitchSetupTable }
}
</script>