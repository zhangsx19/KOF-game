import { Player } from "./base.js";
import { GIF } from '/static/js/utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animations();
    }
    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, -135, 0, 0, 0];
        for (let i = 0; i < this.status_total; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,//总图片数
                frame_rate: 5,//每5帧过度1次
                offset_y: offsets[i],//y方向偏移量
                loaded: false,//判断有没有被成功加载进来
                scale: 2,//放大多少倍
            });
            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;//最后一个gif
                obj.loaded = true;
            }
        }
    }

}