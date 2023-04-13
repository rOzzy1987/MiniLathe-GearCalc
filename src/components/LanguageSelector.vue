<template>
    <div class="language dropdown" :class="{'is-active': droppedDown}">
        <div class="dropdown-trigger">
            <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu" @click="droppedDown = !droppedDown">
                <span><img :src="i18n.langCode+'.svg'"/> {{i18n.langName}}</span>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a href="#" class="dropdown-item" :class="{'is-active': i18n.langCode == item.langCode }" v-for="(item, idx) in languages" :key="idx" @click.prevent="changeLang(item)">
                    <img :src="item.langCode+'.svg'"/> {{item.langName}}
                </a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import type TranslationsBase from '@/i18n/lang'
import GlobalConfig from '@/bll/globalConfig';

export default {
    data() {
        return {
            languages: GlobalConfig.availableLanguages,
            i18n: GlobalConfig.i18n,
            droppedDown: false
        }
    },
    methods: {
        changeLang(l: TranslationsBase){
            GlobalConfig.i18n = l;
            this.droppedDown = false;
        }
    }
}
</script>
<style scoped>
.language.dropdown img {
    height: 14px;
    vertical-align: middle;
}
</style>
