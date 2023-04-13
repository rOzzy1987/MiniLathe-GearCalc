<template>
  <div class="loading-overlay">
  </div>
  <div class="loading-overlay-content">
        <div class="spinner-container">
            <svg class="spinner" width="100" height="100">
                <path :d="path" transform="translate(50 50)"></path>
            </svg>
        </div>
        <div class="loading-message-container" v-if="modelValue != undefined">
            <div class="loading-message">{{ modelValue }}</div>
        </div>
  </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            i: 0,
        }
    },
    props: {
        modelValue: {type: String, default: "Loading"},
        progress: {type: Number}
    },
    methods: {
        getLineLength(lineNo: number){
            let i = (this.i + 1 - ((lineNo + 1) / 9)) % 1;
            return -i * 5
        },
        iterate() {
            if (this.progress == undefined)
                this.i = (this.i + 0.2) % 1;
        }
    },
    mounted() {
        setInterval(() => {this.iterate()}, 100);
    },
    computed: {
        path() {
            const r = 15;
            if(this.progress == undefined) {
                const s2 = Math.SQRT2;
                const r2 = r / s2;
                const ll0 = this.getLineLength(0);
                const ll1 = this.getLineLength(1) / s2;
                const ll2 = this.getLineLength(2);
                const ll3 = this.getLineLength(3) / s2;
                const ll4 = this.getLineLength(4);
                const ll5 = this.getLineLength(5) / s2;
                const ll6 = this.getLineLength(6);
                const ll7 = this.getLineLength(7) / s2;

                return `
                M 0 ${-r} l 0 ${ll0} 
                M ${r2} ${-r2} l ${-ll1} ${ll1}
                M ${r} 0 l ${-ll2} 0 
                M ${r2} ${r2} l ${-ll3} ${-ll3}
                M 0 ${r} l 0 ${-ll4} 
                M ${-r2} ${r2} l ${ll5} ${-ll5}
                M ${-r} 0 l ${ll6} 0 
                M ${-r2} ${-r2} l ${ll7} ${ll7}`;
            }
            const p = this.progress * Math.PI * 2;
            return `M 0 ${-r} A ${r} ${r} 0 ${this.progress > .5 ? 1 : 0} 1 ${Math.sin(p) * r} ${-Math.cos(p) * r} `;
        }
    }
}
</script>

<style scoped>
    .spinner {
        stroke: #FFF;
        stroke-width: 5px;
        stroke-linecap: round;
        fill: none;
    }
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .3;
    }
    .loading-overlay-content {
        position: fixed;
        top: 50%;
        left: 50%;
    }
    .spinner-container {
        position:absolute;
        top: -50px;
        left: -50px;
    }
    .loading-message-container {
        position: absolute;
        top: 55px;
        left: -160px;
    }
    .loading-message {
        width: 320px;
        text-align: center;
        color: #FFF;
        font-weight: bold;
    }
</style>