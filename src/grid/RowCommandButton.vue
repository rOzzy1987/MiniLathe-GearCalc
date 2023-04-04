<template>
  <span :class="buttonClassComp" :title="iconClass == '' ? '' : label">
    <i v-if="iconClass != ''" :class="iconClass"></i>
    {{ iconClass == '' ? label : "" }}
  </span>
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
            if (this.iconClass){
                r+= ' has-icon';
            }
            else {
                r+= ' button'
            }
            return r;
        }
    }
}
</script>