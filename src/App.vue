<template>
  <header>
    <LanguageSelector />
    <section class="section">
      <div class="container">
        <h1 class="title">
          <span class="icon">
            <i class="fas fa-gears"></i>
          </span>
          {{ i18n.appTitle }}
        </h1>
        <h2 class="subtitle">{{ i18n.appSubtitle }}</h2>
      </div>
    </section>
  </header>
  <main>
    <div class="tabs no-print">
      <ul>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchTable}" @click="activeTab = ActiveTabs.PitchTable"><a>{{ i18n.tabPitchTable }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.GearsForPitch}" @click="activeTab = ActiveTabs.GearsForPitch"><a>{{ i18n.tabGearsForPitch }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.PitchForGears}" @click="activeTab = ActiveTabs.PitchForGears"><a>{{ i18n.tabPitchForGears }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.Favorites}" @click="activeTab = ActiveTabs.Favorites"><a>{{ i18n.tabFavorites }}</a></li>
        <li :class="{'is-active': activeTab == ActiveTabs.Configure}" @click="activeTab = ActiveTabs.Configure"><a>{{ i18n.tabSetup }}</a></li>
      </ul>
    </div>

    <section v-if="activeTab == ActiveTabs.Configure" class="section" >
      <SetupTab />
    </section>
    <section v-if="activeTab == ActiveTabs.PitchTable" class="section" >
      <PitchTableTab />
    </section>
    <section v-if="activeTab == ActiveTabs.PitchForGears" class="section" >
      <PitchForGearsTab v-model:gearA="gearA" v-model:gearB="gearB" v-model:gearC="gearC" v-model:gearD="gearD"/>
    </section>
    <section v-if="activeTab == ActiveTabs.GearsForPitch" class="section" >
      <GearsForPitchTab v-model:desiredPitch="pitch"/>
    </section>
    <section v-if="activeTab == ActiveTabs.Favorites" class="section" >
      <FavoritesTab />
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Mini lathe change gear claculator</strong><br/> 
          &copy; 2023 Mihály Rozovits
        </p>
        <p>
          Translation:<br/>
          &copy; {{i18n.credits}}
        </p>
        <p class="no-print">
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
import { Pitch, PitchType } from './bll/pitch';
import LanguageSelector from './components/LanguageSelector.vue';
import FavoritesTab from './views/FavoritesTab.vue';
import GearsForPitchTab from './views/GearsForPitchTab.vue';
import PitchForGearsTab from './views/PitchForGearsTab.vue';
import PitchTableTab from './views/PitchTableTab.vue';
import SetupTab from './views/SetupTab.vue';

export default {
    data() {
        const combinator = new CombinationFinder();
        return {
            activeTab: ActiveTabs.PitchTable,
            combinator,
            gearA: undefined,
            gearB: undefined,
            gearC: undefined,
            gearD: undefined,
            pitch: new Pitch(1, PitchType.Metric),
            ActiveTabs: ActiveTabs,
            i18n: GlobalConfig.i18n
        };
    },
    mounted() {
      if(GlobalConfig.combos.length == 0 && GlobalConfig.config.gears.length > 2)
      {
        GlobalConfig.combos = this.combinator.findAllCombinations(GlobalConfig.config);
      }
    },
    components: { SetupTab, PitchTableTab, PitchForGearsTab, GearsForPitchTab, LanguageSelector, FavoritesTab }
}

enum ActiveTabs {
  GearsForPitch,
  PitchForGears,
  Configure,
  PitchTable,
  Favorites
}
</script>

