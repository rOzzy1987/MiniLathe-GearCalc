<template>
    <g :transform="'translate('+cx+' '+cy+')'">
        <path :d="path" />
        
        <g v-if="sizeText && gearVal.teeth >= 30" :transform="'rotate(' + textRotation + ')'" >
        <path :id="'curve'+id" stroke="none" fill="none" :d="'M '+(-(pitchR - 3))+' 0 A '+(pitchR - 3)+' '+(pitchR - 3)+' 0 0 0 '+(pitchR - 3)+' 0'" />
        <text width="100" alignment-baseline="baseline" :style="{'font-size':  (gearVal.module.toMetric().number * 8)+'px' }" style="letter-spacing: 2px;" stroke="none" fill="#888">
            <textPath :xlink:href="'#curve'+id">
            {{ gear.toString() }}
            </textPath>
        </text>
        </g>
    </g>
</template>
<script lang="ts">
import { Vector } from '@/bll/math';
import { Gear, Gears } from '@/bll/gear';

export default {
    data() {
        return {id: Math.round(Math.random()*10000)}
    },
    props: {
        cx: {type: Number, default: 0},
        cy: {type: Number, default: 0},
        gear: {type: [Gear, String], required: true},
        module: {type: Number, default: 1},
        sizeText: {type: Boolean, default: false},
        textRotation: {type: Number, default: 0}
    },
    methods: {
        getPoint(tooth: number, point: number, angleStep: number){

            let angle = tooth * angleStep;
            switch (point) {
                case 0:
                    break;
                case 1:
                    angle += angleStep/3;
                    break;
                case 2:
                    angle += angleStep/2;
                    break;
                case 3:
                    angle += angleStep*5/6;
                    break;
            }
            return Vector.fromAngle(angle, point ==2 || point == 3 ? Gears.outerRadius(this.gearVal)! : Gears.rootRadius(this.gearVal)! )
        }
    },
    computed: {
        gearVal() { return typeof(this.gear) == "string" ? Gear.fromString(this.gear)! : this.gear; },
        pitchR() { return Gears.pitchRadius(this.gearVal)!; },
        path(){
            const angleStep = Math.PI * 2 / this.gearVal.teeth;

            var start = this.getPoint(-1, 3, angleStep);
            let p = "M "+ start.x +" "+start.y+" ";

            for(let i = 0; i< this.gearVal.teeth; i++){
                for(let j = 0; j< 4; j++)
                {
                    var v = this.getPoint(i, j, angleStep);
                    p+= "L "+v.x+" "+v.y+" ";
                }
            }

            return p;
        }
    }
}
</script>