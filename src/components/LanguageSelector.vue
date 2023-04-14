<template>
    <div class="language dropdown" :class="{'is-active': droppedDown, 'is-right': alignRight}">
        <div class="dropdown-trigger">
            <button class="button is-small language-item" @click="droppedDown = !droppedDown">
                <img :src="i18n.langCode+'.svg'"/>
                <span>{{i18n.langName}}</span>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a href="#" class="dropdown-item language-item" :class="{'is-active': i18n.langCode == item.langCode }" v-for="(item, idx) in languages" :key="idx" @click.prevent="changeLang(item)">
                    <img :src="item.langCode+'.svg'"/> 
                    <span>{{item.langName}}</span>
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
            droppedDown: false,
        }
    },
    props: {
        alignRight: { type: Boolean, default: false}
    },
    methods: {
        changeLang(l: TranslationsBase){
            GlobalConfig.i18n = l;
            this.droppedDown = false;
        }
    }
}
</script>
<style scoped lang="scss">
.language-item {
    font-size: 14px;
    line-height: 21px;
    span {
        vertical-align: baseline;
        padding: 0px 10px;
    }
    img {
        height: 14px;
        vertical-align: middle;
    }
} 
</style>
