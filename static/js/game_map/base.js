import { GameObject } from '/static/js/game_object/base.js'
import { Controller } from '/static/js/controller/base.js';
class GameMap extends GameObject {
    constructor(root) {//root是kof类
        super();
        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');//tabindex聚焦
        //console.log(this.$canvas[0]);//<canvas width="1280" height="720" tabindex=0></canvas>
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        //要让canvas获取键盘输入
        this.$canvas.focus();
        this.controller = new Controller(this.$canvas);
        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));
        this.time_left = 60000;//单位：ms
        this.$timer = this.root.$kof.find(`.kof-head-timer`);
    }
    start() {

    }
    update() {//每一帧都必须清空，否则会把轨迹存下来
        this.time_left -= this.timedelta;
        let [a, b] = this.root.Players;
        if (this.time_left < 0 || a.status === 6 || b.status === 6) {//时间结束
            this.time_left = 0;
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = a.vy = b.vy = 0;
            }
        }
        this.$timer.text(parseInt(this.time_left / 1000));
        this.render();//渲染函数
    }
    render() {
        this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}

export {
    GameMap
}