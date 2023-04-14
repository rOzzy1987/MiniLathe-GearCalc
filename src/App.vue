<template>
  <div class="main-container">
    <header>
      <LanguageSelector style="float:right" :align-right="true" />
        <div class="container">
          <h1 class="title">
            <span class="icon">
              <i class="fas fa-gears"></i>
            </span>
            {{ i18n.appTitle }}
          </h1>
          <h2 class="subtitle">{{ i18n.appSubtitle }}</h2>
        </div>
    </header>
    <main>
      <div class="tabs no-print">
        <ul>
          <li :class="{'is-active': activeTab == ActiveTabs.PitchTable}" @click="activeTab = ActiveTabs.PitchTable"><a><span class="icon"><i class="fas fa-list"></i></span><span class="menuitem">{{ i18n.tabPitchTable }}</span></a></li>
          <li :class="{'is-active': activeTab == ActiveTabs.GearsForPitch}" @click="activeTab = ActiveTabs.GearsForPitch"><a><span class="icon"><i class="fas fa-gear"></i></span><span class="menuitem">{{ i18n.tabGearsForPitch }}</span></a></li>
          <li :class="{'is-active': activeTab == ActiveTabs.PitchForGears}" @click="activeTab = ActiveTabs.PitchForGears"><a><span class="icon"><i class="fas fa-arrows-left-right-to-line"></i></span><span class="menuitem">{{ i18n.tabPitchForGears }}</span></a></li>
          <li :class="{'is-active': activeTab == ActiveTabs.Favorites}" @click="activeTab = ActiveTabs.Favorites"><a><span class="icon"><i class="fas fa-heart"></i></span><span class="menuitem">{{ i18n.tabFavorites }}</span></a></li>
          <li :class="{'is-active': activeTab == ActiveTabs.Configure}" @click="activeTab = ActiveTabs.Configure"><a><span class="icon"><i class="fas fa-sliders"></i></span><span class="menuitem">{{ i18n.tabSetup }}</span></a></li>
        </ul>
      </div>

      <section v-if="activeTab == ActiveTabs.Configure" class="box" >
        <SetupTab v-model:isBusy="isLoading" v-model:progress="loadingProgress" :key="i"/>
      </section>
      <section v-if="activeTab == ActiveTabs.PitchTable" class="" >
        <PitchTableTab :key="i" />
      </section>
      <section v-if="activeTab == ActiveTabs.PitchForGears" class="" >
        <PitchForGearsTab v-model:gearA="gearA" v-model:gearB="gearB" v-model:gearC="gearC" v-model:gearD="gearD" :key="i"/>
      </section>
      <section v-if="activeTab == ActiveTabs.GearsForPitch" class="" >
        <GearsForPitchTab v-model:desiredPitch="pitch" :key="i"/>
      </section>
      <section v-if="activeTab == ActiveTabs.Favorites" class="" >
        <FavoritesTab :key="i"/>
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
            <a href="https://github.com/rOzzy1987/MiniLathe-GearCalc" class="button is-small has-icon">
              <span class="icon"><i class="fa-brands fa-github"></i></span>
              &nbsp;&nbsp;&nbsp;Contribute on GitHub
            </a>
          </p>
        </div>
      </footer>
      <loading-overlay v-if="isLoading" :progress="loadingProgress" />
        
    </main>
  </div>
</template>

<script lang="ts">
import CombinationFinder from './bll/combinationFinder';
import GlobalConfig from './bll/globalConfig';
import { Pitch, PitchType } from './bll/pitch';
import LanguageSelector from './components/LanguageSelector.vue';
import FavoritesTab from './views/FavoritesTab.vue';
import GearsForPitchTab from './views/GearsForPitchTab.vue';
import LoadingOverlay from './views/LoadingOverlay.vue';
import PitchForGearsTab from './views/PitchForGearsTab.vue';
import PitchTableTab from './views/PitchTableTab.vue';
import SetupTab from './views/SetupTab.vue';

export default {
    data() {
        const combinator = new CombinationFinder();
        return {
            activeTab: GlobalConfig.favorites.length > 0 ? ActiveTabs.Favorites : ActiveTabs.PitchTable,
            combinator,
            gearA: undefined,
            gearB: undefined,
            gearC: undefined,
            gearD: undefined,
            pitch: new Pitch(1, PitchType.Metric),
            ActiveTabs: ActiveTabs,
            i18n: GlobalConfig.i18n,
            isLoading: false,
            loadingProgress: (undefined as number | undefined),
            worker: combinator.createWorker(r => GlobalConfig.combos = r, b => this.setLoading(b), p => this.setProgress(p)),
            i: 0
        };
    },
    methods: {
      setLoading(l: boolean) { this.isLoading = l; },
      setProgress(p: number) { this.loadingProgress = p; }
    },
    mounted() {
      if(GlobalConfig.combos.length == 0 && GlobalConfig.config.gears.length > 2)
      {
          this.combinator.runWorker(GlobalConfig.config.gears, GlobalConfig.config.leadscrew, this.worker);

          this.i++;
      }
    },
    components: { SetupTab, PitchTableTab, PitchForGearsTab, GearsForPitchTab, LanguageSelector, FavoritesTab, LoadingOverlay }
}

enum ActiveTabs {
  GearsForPitch,
  PitchForGears,
  Configure,
  PitchTable,
  Favorites
}
</script>

<style lang="scss">

header, main {
  position: relative;
}
header {
  z-index: 10;
}
main{
  z-index: 0;
}

header {
  .container {
    padding-left: 30px;
    padding-bottom: 20px;
  }
}

@media screen and (max-width: 1279px){

  header {
    .container {
      background: #345;
      color: #FFF;
      padding-bottom: 0px;
      max-width: 100%;
    }

    .title {
      font-size: 12pt;
      color: #FFF;
    }
    .subtitle {
      font-size: 6pt;
      color: #8AC;
      padding: 0 40px 5px;
    }

    .language.dropdown{
      display: none;
    }
  }

  main {
    .tabs {
      position: fixed;
      left: 0px;
      bottom: 0px;
      width: 100%;
      background: #FFF;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
      margin-bottom: 0px !important;

      z-index: 1000;
      align-items: stretch;
      white-space: normal;

      ul {
        justify-content: center;
        align-items: stretch;
      }
      li {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 120px;
        text-align: center;
      }
      a {
        flex-direction: column;
        height: 100%;

        * {
          text-align: center;
        }

        *:last-child {
          flex-grow: 1;
        }
      }

      .icon {
        margin-right: 0px !important;
        font-size: 24px;
      }
      .menuitem {
        margin-top: .5em;
        font-size: 8pt;
      }
    }
  }
}
</style>

