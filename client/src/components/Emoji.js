/*window.addEventListener("DOMContentLoaded",() =>{
    const fr = new FaceRating("#face-rating");
})

class FaceRating{
    constructor(qs){
        this.input = document.querySelector(qs);
        this.input?.addEventListener("input",this.update.bind(this));
        this.face = this.input?.previousElmentsibling;
        this.update();
    }
    update(e){
        let value = this.input.defaultvalue;
        if (e) value = e.target?.value;
        else this.input.value = value;
        const min = this.input.min || 0;
        const max = this.input.max || 100;
        const percentRaw = (value - min) / (max - min) * 100;
        const percent = +percentRaw.toFixed(2);

        this.input?.style.setProperty("--percent",`${percent}%`);

        //face and range fill color
        const maxHue = 120;
        const hueExtend = 30;
        const hue = Math.round(maxHue * percent / 100);

        let hue2 = hue - hueExtend;
        if (hue2 < 0) hue2 +=360;

        const hues = [hue , hue2];
        hues.forEach((h,i) => {
            this.face?.style.setProperty(`--face-hue`,hue);
        });
        this.input?.style.setProperty("--input-hue",hue);

        //emotions

        const duration = 1 ;
        const delay = -(duration * 0.99) * percent / 100;
        const parts = ["right","left","mouth-lower","mouth-upper"];

        parts.forEach(p => {
            const el = this.face?.querySelector(`[data-${p}]`);
            el?.style.setProperty(`--delay-${p}`,`${delay}s`)
        })

        const faces = [
            "Sad face",
            "Slightly sad face",
            "Straight face",
            "Slightly happy face",
            "Happy face"
        ];
        let faceIndex = Math.floor(faces?.length * percent / 100);
        if ( faceIndex === this.faces?.length) --faceIndex;

        this.face?.setAttribute("aria-label",faces[faceIndex]);
    }
}
*/