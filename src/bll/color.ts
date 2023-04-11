export class Color {
    public r: number;
    public g: number;
    public b: number;

    public constructor (r: number, g: number, b: number){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public toHex(){
        return "#" +
        this.r.toString(16) +
        this.g.toString(16) +
        this.b.toString(16);
    }

    public static fromHsl(h: number, s: number, l: number){
        h*=360;

        const d = s * (1 - Math.abs(2 * l - 1));
        const m = 255 * (l - (d / 2));
        const x = d * (1 - Math.abs(((h / 60) % 2) - 1 ));

        let r = 0;
        let g = 0;
        let b = 0;

        if (h >= 0 && h < 60){
            r = Math.round(255 * d + m);
            g = Math.round(255 * x + m);
            b = Math.round(m);
        } else if (h >= 60 && h < 120) {
            r = Math.round(255 * x + m);
            g = Math.round(255 * d + m);
            b = Math.round(m);
        } else if (h >= 120 && h < 180) {
            r = Math.round(m);
            g = Math.round(255 * d + m);
            b = Math.round(255 * x + m);
        } else if (h >= 180 && h < 240) {
            r = Math.round(m);
            g = Math.round(255 * x + m);
            b = Math.round(255 * d + m);
        } else if (h >= 240 && h < 300) {
            r = Math.round(255 * x + m);
            g = Math.round(m);
            b = Math.round(255 * d + m);
        } else {
            r = Math.round(255 * d + m);
            g = Math.round(m);
            b = Math.round(255 * x + m);
        }
        return new Color(r, g, b);
    }
}