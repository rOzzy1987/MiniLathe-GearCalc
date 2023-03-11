<template>
  <header>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Mini lathe gear calculator
        </h1>
        <h2 class="subtitle">Know what you can do, and how precisely!</h2>
      </div>
    </section>
  </header>
  <main>
    <div class="tabs">
      <ul>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchTable}" @click="activeTab = ActiveTabs.PitchTable"><a>Pitch table</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.GearsForPitch}" @click="activeTab = ActiveTabs.GearsForPitch"><a>Gears for pitch</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchForGears}" @click="activeTab = ActiveTabs.PitchForGears"><a>Pitch for gears</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.Configure}" @click="activeTab = ActiveTabs.Configure"><a>Configure</a></li>
      </ul>
    </div>

    <section v-if="activeTab == ActiveTabs.Configure" class="section" >
      <SetupTab v-model="config" />
    </section>
    <section v-if="activeTab == ActiveTabs.PitchTable" class="section" >
      <PitchTableTab v-model="combos"/>
    </section>
    <section v-if="activeTab == ActiveTabs.PitchForGears" class="section" >
      <PitchForGearsTab v-model="combos" v-model:gearA="gearA" v-model:gearB="gearB" v-model:gearC="gearC" v-model:gearD="gearD"/>
    </section>
    <section v-if="activeTab == ActiveTabs.GearsForPitch" class="section" >
      <GearsForPitchTab v-model="combos" v-model:desiredPitch="pitch"/>
    </section>
      
  </main>
</template>

<script lang="ts">
import CombinationFinder from './bll/combinationFinder';
import GlobalConfig from './bll/globalConfig';
import type LatheConfig from './bll/latheConfig';
import { Pitch, PitchType } from './bll/pitch';
import GearsForPitchTab from './views/GearsForPitchTab.vue';
import PitchForGearsTab from './views/PitchForGearsTab.vue';
import PitchTableTab from './views/PitchTableTab.vue';
import SetupTab from './views/SetupTab.vue';

export default {
    data() {
        const config = undefined as LatheConfig | undefined;
        const activeTab = config == undefined
          ?ActiveTabs.Configure
          :ActiveTabs.GearsForPitch;
        const combinator = new CombinationFinder();
        const combos = config == undefined ? [] : combinator.findAllCombinations(config);
        return {
            config,
            activeTab,
            combos,
            combinator,
            gearA: NaN,
            gearB: NaN,
            gearC: NaN,
            gearD: NaN,
            pitch: new Pitch(1, PitchType.Metric),
            ActiveTabs: ActiveTabs,
        };
    },
    mounted() {
      this.config = GlobalConfig.loadConfig() ?? undefined;
      this.combos = GlobalConfig.loadCombos();
    },
    methods: {

    },
    watch: {
      config(n, o){
        if (o == undefined && n != undefined){
          this.activeTab = ActiveTabs.PitchTable;
        }
        this.combos = n == undefined ? [] : this.combinator.findAllCombinations(n);
        GlobalConfig.saveCombos(this.combos);
        GlobalConfig.saveConfig(n);
      }
    },
    computed: {},
    components: { SetupTab, PitchTableTab, PitchForGearsTab, GearsForPitchTab }
}

enum ActiveTabs {
  GearsForPitch,
  PitchForGears,
  Configure,
  PitchTable
}
</script>

