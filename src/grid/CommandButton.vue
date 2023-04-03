<template>
  <button :class="buttonClassComp">
    <i v-if="iconClass != ''" :class="iconClass" :title="label"></i>
    {{ iconClass == '' ? label : "" }}
  </button>
</template>

<script lang="ts">
export default {
    props: {
        cssClass: {type: String},
        iconClass: {type: String},
        label: {type: String}
    },
    computed: {
        buttonClassComp() {
            let r = this.cssClass ?? "";
            r += ' button';
            if (this.iconClass){
                r+= ' has-icon';
            }
            return r;
        }
    }
}
</script>