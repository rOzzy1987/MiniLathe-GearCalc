<template>
    <svg width="100%" :height="250 * scale" :style="{'stroke-width': 1/scale}">
        <defs>
            <filter id="dropShadow" x="-.50" y="-.50" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
        </defs>
        <g :transform="'scale('+scale+')'">

            <rect class="headstock" :x="spindlePos.x-40" :y="spindlePos.y -110" width="80" height="130" />
            <rect class="body" :x="spindlePos.x-90" :y="spindlePos.y +20" width="130" height="100" />
            <rect class="body" :x="spindlePos.x+40" :y="spindlePos.y -90" width="70" height="170" />

            <g class="dirchange" transform="rotate(20)" :transform-origin="(spindlePos.x)+' '+(spindlePos.y)" filter="url(#dropShadow)">
                <path :d="'M '+(spindlePos.x-50)+' '+(spindlePos.y)+
                ' l 50 0'+
                ' l 12 -40'+
                ' l -32.62 0'+
                ' a 45 45 0 0 0 -21.81 25'+
                ' m 6.42 0' +
                ' a 39 39 0 0 1 17.9 -19.54'+
                ' a 4 4 0 0 1 3.71 7.08 '+
                ' a 31 31 0 0 0 -14.22 15.53'+
                ' a 4 4 0 0 1 -7.39 -3.07 '+
                ' m -6.42 0'+
                ' l -7.57 0'+
                ' L '+(spindlePos.x-50)+' '+(spindlePos.y)
                "/>
                
                <path :d="'M '+(spindlePos.x-50)+' '+(spindlePos.y-2)+
                ' l -45 1'+
                ' l 0 -13'+
                ' l 45 1'+
                ' l 0 11'
                "/>

                <ellipse class="nut" :cx="spindlePos.x - 28" :cy="spindlePos.y-21" :rx="6 " :ry="6 "/>
            </g>
            
            <g>
                <!-- fixed gears -->
                <GearImg class="gear dark" :cx="spindlePos.x" :cy="spindlePos.y" gear="M1Z50"/>
                <GearImg class="gear dark" :cx="spindlePos.x" :cy="spindlePos.y - 36" gear="M1Z22"/>
                <GearImg class="gear dark" :cx="spindlePos.x + 19.6" :cy="spindlePos.y - 40" gear="M1Z18"/>
                <GearImg class="gear dark" :cx="spindlePos.x" :cy="spindlePos.y -72" gear="M1Z50"/>

                <!-- axles -->
                <ellipse class="axle" :cx="spindlePos.x" :cy="spindlePos.y - 36" rx="4 " ry="4 " />
                <ellipse class="axle" :cx="spindlePos.x + 19.6" :cy="spindlePos.y - 40" rx="4 " ry="4 " />
                <ellipse class="hole" :cx="spindlePos.x" :cy="spindlePos.y - 72" rx="21 " ry="21 " />
            </g>

            <g class="cover" filter="url(#dropShadow)">
                <path :d="'M '+((spindlePos.x-40) )+' '+((spindlePos.y+18) )+
                    ' l -3.72 -14.53'+
                    ' l 83.73 -21.5'+
                    ' l 3.72 14.53'+
                    ' l -83.73 21.5'"/>
                <path :d="'M '+(spindlePos.x-29.06)+' '+(spindlePos.y+7.45)+
                    ' a 30 30 0 0 0 58.12 -14.9'" />
                <ellipse class="bolt" :cx="spindlePos.x - 34.6" :cy="spindlePos.y + 8.87" rx="4" ry="4"/>
                <ellipse class="bolt" :cx="spindlePos.x + 34.6" :cy="spindlePos.y - 8.87" rx="4" ry="4"/>
            </g>

            <g class="banjo" :transform="'rotate('+(angle*180 / Math.PI)+')'" :transform-origin="(leadscrewPos.x )+' '+(leadscrewPos.y)" filter="url(#dropShadow)">
                <path :d="'M '+((leadscrewPos.x - 80))+' '+((leadscrewPos.y - 12))+
                    ' a 12 12 0 0 0 0 24'+
                    ' l 80 0'+
                    ' a 12 12 0 0 0 0 -24'+
                    ' l -80 0'+
                    ' m 0 8'+
                    ' l 60 0'+
                    ' a 4 4 0 0 1 0 8'+
                    ' l -60 0'+
                    ' a 4 4 0 0 1 0 -8'"/>
                <path :d="'M '+(leadscrewPos.x - 63.88)+' '+(leadscrewPos.y + 11)+
                    ' A 65 65 0 0 0 '+(leadscrewPos.x)+' '+(leadscrewPos.y + 65)+
                    ' a 12 12 0 0 0 0 -24'+
                    ' A 41 41 0 0 1 '+(leadscrewPos.x -39.2)+' '+(leadscrewPos.y + 11)+
                    ' m -8.3 0' +
                    ' A 49 49 0 0 0 '+(leadscrewPos.x)+' '+(leadscrewPos.y + 49)+
                    ' a 4 4 0 0 1 0 8'+
                    ' A 57 57 0 0 1 '+(leadscrewPos.x -55.72)+' '+(leadscrewPos.y + 11)+
                    ' M '+(leadscrewPos.x - 63.88)+' '+(leadscrewPos.y + 11)" />
            </g>

            <g class="nut" :transform="'translate('+(leadscrewPos.x - 39.8)+' '+(leadscrewPos.y + 35)+')'" filter="url(#dropShadow)">
                <path :d="'M 7.5 0'+
                    ' l -3.75 6.5'+
                    ' l -7.5 0'+
                    ' l -3.75 -6.5'+
                    ' l 3.75 -6.5'+
                    ' l 7.5 0'+
                    ' l 3.75 6.5'" />
                <ellipse class="axle" :rx="4 " :ry="4 "/>   
            </g>

            <g>
                <!-- gears -->
                <GearImg class="gear" :cx="spindlePos.x" :cy="spindlePos.y" :gear="ga" :sizeText="true" :textRotation="180"/>
                <ellipse class="axle" :cx="spindlePos.x " :cy="spindlePos.y " :rx="4 " :ry="4 "/>
                <GearImg class="gear" :cx="midAxlePos.x" :cy="midAxlePos.y" :gear="gb" :sizeText="true"  :textRotation="90"/>
                <GearImg class="gear" :cx="midAxlePos.x" :cy="midAxlePos.y" :gear="gc" :class="{trans: gearCLargerThanB}" :sizeText="true"  :textRotation="90"/>
                <ellipse class="axle" :cx="midAxlePos.x " :cy="midAxlePos.y " :rx="4 " :ry="4 "/>
                <GearImg class="gear" :cx="leadscrewPos.x" :cy="leadscrewPos.y" :gear="gd" :class="{trans: gearCSmallerThanB}" :sizeText="true" :textRotation="-90"/>
                <ellipse class="axle" :cx="leadscrewPos.x " :cy="leadscrewPos.y " :rx="4 " :ry="4 "/> 
            </g>

        </g>
    </svg>
</template>
<script lang="ts">import { Vector } from '@/bll/math';
import GearImg from './GearImg.vue';
import { Gear, Gears } from '@/bll/gear';

export default {
    data(props) {
        const spindlePos = new Vector(80, 105);
        const leadscrewOffsetX = 48;
        const leadscrewOffsetY = Math.sqrt((props.minTeeth*  props.minTeeth) -(leadscrewOffsetX * leadscrewOffsetX));
        const leadscrewPos = spindlePos.add(new Vector(leadscrewOffsetX, leadscrewOffsetY));
        return {
            spindlePos,
            leadscrewPos,
        };
    },
    computed: {
        midAxlePos() { return this.calculateMidAxlePos(); },
        ga() { return this.gearA == undefined ? Gear.fromString("M1Z20")! : this.gearA },
        gb() { return this.gearB == undefined ? new Gear(this.ga.module, 45) : this.gearB; },
        gc() { return this.gearC == undefined ? new Gear(this.ga.module, 45) : this.gearC; },
        gd() { return this.gearD == undefined ? Gear.fromString("M1Z80")! : this.gearD; },
        angle() { return this.leadscrewPos.sub(this.midAxlePos).angle(); },
        gearCLargerThanB() { return Gears.pitchRadius(this.gc)! > Gears.pitchRadius(this.gb)!; },
        gearCSmallerThanB() { return Gears.pitchRadius(this.gc)! < Gears.pitchRadius(this.gb)!; }
    },
    methods: {
        calculateMidAxlePos(): Vector {
            var a = Gears.pitchRadius(this.ga)! + Gears.pitchRadius(this.gb)!;
            var c = Gears.pitchRadius(this.gc)! + Gears.pitchRadius(this.gd)!;
            const leadscrewPos = this.leadscrewPos.sub(this.spindlePos);
            const b = leadscrewPos.length();
            let angle = Math.PI / 6;
            if (b <= a + c) {
                const cosA = (c * c + b * b - a * a) / (2 * c * b);
                angle = Math.acos(cosA);
            }
            else {
                console.log(`Gears too small: distance: ${b} gears a+b: ${a} gears c+d: ${c}`);
            }
            return Vector.fromAngle((Math.PI - angle) + leadscrewPos.angle(), c).add(this.leadscrewPos);
        }
    },
    props: {
        gearA: { type: Gear },
        gearB: { type: Gear },
        gearC: { type: Gear },
        gearD: { type: Gear },
        scale: { type: Number, default: 2 },
        minTeeth: {type: Number, default: 85}
    },
    components: { GearImg }
}
</script>
<style scoped>
svg {
  stroke: #000;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

svg .dirchange{
    fill: #333;
}
svg .banjo{
    fill: #234;
}
svg .cover {
    fill: #345;
}

svg .bolt,
svg .nut {
    fill: #808890;
}

svg .axle {
    fill: #555;
}
svg .gear {
    fill: #DDD;
}
svg .gear.trans {
    opacity: 0.66;
}

svg .gear.dark {
    fill: #AAA;
}

svg .hole {
    fill: #000;
}
svg .headstock {
    fill: #CCC;
}
svg .body {
    fill: #2d4ea8;
}
</style>