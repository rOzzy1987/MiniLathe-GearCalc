<template>
    <path :transform="'translate('+cx+' '+cy+')'" :d="path" />
</template>
<script lang="ts">
import { Vector } from '@/bll/math';

export default {
    props: {
        cx: {type: Number, default: 0},
        cy: {type: Number, default: 0},
        size: {type: Number, default: 20},
    },
    methods: {
        getPoint(cog: number, point: number, angleStep: number, rootR: number, outsideR: number){

            let angle = cog*angleStep;
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
            return Vector.fromAngle(angle, point ==2 || point == 3 ? outsideR : rootR )
        }
    },
    computed: {
        path(){
            const rootR = (this.size / 2) - 1.5;
            const outerR = (this.size / 2) + 1;
            const angleStep = Math.PI*2/this.size;

            var start = this.getPoint(-1, 3, angleStep,rootR, outerR);
            let p = "M "+ start.x +" "+start.y+" ";

            for(let i = 0; i< this.size; i++){
                for(let j = 0; j< 4; j++)
                {
                    var v = this.getPoint(i,j,angleStep,rootR,outerR);
                    p+= "L "+v.x+" "+v.y+" ";
                }
            }

            return p;
        }
    }
}
</script>