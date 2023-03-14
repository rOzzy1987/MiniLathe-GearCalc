<template>
  <header>
    <LanguageSelector />
    <section class="section">
      <div class="container">
        <h1 class="title">
          {{ i18n.appTitle }}
        </h1>
        <h2 class="subtitle">{{ i18n.appSubtitle }}</h2>
      </div>
    </section>
  </header>
  <main>
    <div class="tabs">
      <ul>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchTable}" @click="activeTab = ActiveTabs.PitchTable"><a>{{ i18n.tabPitchTable }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.GearsForPitch}" @click="activeTab = ActiveTabs.GearsForPitch"><a>{{ i18n.tabGearsForPitch }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchForGears}" @click="activeTab = ActiveTabs.PitchForGears"><a>{{ i18n.tabPitchForGears }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.Configure}" @click="activeTab = ActiveTabs.Configure"><a>{{ i18n.tabSetup }}</a></li>
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
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Mini lathe change gear claculator</strong><br/> 
          &copy; 2023 Mihály Rozovits
        </p>
        <p>
          Translation: &copy; {{i18n.credits}}
        </p>

        <p>
          <a href="https://github.com/rOzzy1987/MiniLathe-GearCalc" class="button is-small">
          <figure clas="image is-16x16">
            <img src="https://github.com/favicon.ico" style="height: 16px;">
            Contribute on GitHub
          </figure>
          </a>
        </p>
      </div>
    </footer>
      
  </main>
</template>

<script lang="ts">
import CombinationFinder from './bll/combinationFinder';
import GlobalConfig from './bll/globalConfig';
import type LatheConfig from './bll/latheConfig';
import { Pitch, PitchType } from './bll/pitch';
import LanguageSelector from './components/LanguageSelector.vue';
import GearsForPitchTab from './views/GearsForPitchTab.vue';
import PitchForGearsTab from './views/PitchForGearsTab.vue';
import PitchTableTab from './views/PitchTableTab.vue';
import SetupTab from './views/SetupTab.vue';

export default {
    data() {
        const config = undefined as LatheConfig | undefined;
        const activeTab = config == undefined
          ?ActiveTabs.Configure
          :ActiveTabs.PitchTable;
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
            i18n: GlobalConfig.i18n,
        };
    },
    mounted() {
      GlobalConfig.addLanguageChangeListener(() => this.i18n = GlobalConfig.i18n);
      GlobalConfig.loadLanguage();
      this.config = GlobalConfig.loadConfig() ?? undefined;
      this.combos = GlobalConfig.loadCombos();

      GlobalConfig.addLanguageChangeListener(() => GlobalConfig.saveLanguage());
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
    components: { SetupTab, PitchTableTab, PitchForGearsTab, GearsForPitchTab, LanguageSelector }
}

enum ActiveTabs {
  GearsForPitch,
  PitchForGears,
  Configure,
  PitchTable
}
</script>

