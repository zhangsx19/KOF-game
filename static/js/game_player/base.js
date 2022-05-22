import { GameObject } from "/static/js/game_object/base.js";
export class Player extends GameObject {
    constructor(root, info) {//root方便索引大窗口上的每一个元素
        super();
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.vx = 0;
        this.vy = 0;//速度
        this.speedx = 400;//水平速度 每秒移动多少像素
        this.speedy = -1300;//跳起的初始速度
        this.gravity = 50;
        this.ctx = this.root.game_map.ctx;
        this.direction = 1;//正方向是1，反方向是-1
        this.status = 3;//0:静止,1：向前,2：向后,3：跳跃,4：攻击,5：被打,6：死亡
        this.status_total = 7;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.animations = new Map();//每个状态对应的动作
        this.frame_current_cnt = 0;//每过一帧就记录一下，表示当前记录了多少帧
        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
    }
    start() {

    }
    update_direction() {
        if (this.status === 6) return;
        let players = this.root.Players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) {//我在左朝右
                me.direction = 1;
            } else {
                me.direction = -1;
            }
        }
    }
    is_attack() {
        if (this.status === 6) return;
        this.status = 5;
        this.frame_current_cnt = 0;//从头开始渲染被打画面
        this.hp = Math.max(this.hp - 100, 0);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        })

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = this.vy = 0;
        }
    }
    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }
    is_collision_move(r1, r2) {
        if (this.status === 3) return false;
        if (Math.max(r1.x1, r2.x1) <= Math.min(r1.x2, r2.x2)) {
            return true;
        }
        return false;
    }
    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.Players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            };

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }
    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');//攻击
        } else if (this.id === 1) {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }
        if (this.status === 0 || this.status === 1) {
            if (w) {
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = - this.speedx;
                } else {
                    this.vx = 0;
                }
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = this.vy = 0;
                this.status = 0;
            }
            if (space && !w) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
        }
    }
    update_move() {
        this.vy += this.gravity;//每一帧t是1单位
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        let [me, you] = this.root.Players;
        if (me !== this) [me, you] = [you, me];
        let r1 = {
            x1: me.x,
            y1: me.y,
            x2: me.x + me.width,
            y2: me.y + me.height,
        }
        let r2 = {
            x1: you.x,
            y1: you.y,
            x2: you.x + you.width,
            y2: you.y + you.height,
        }
        if (this.is_collision_move(r1, r2)) {
            you.x += this.vx * this.timedelta / 1000;
            you.y += this.vy * this.timedelta / 1000;
            if (you.x < 0 || you.x + you.width > you.root.game_map.$canvas.width()) {
                this.x -= this.vx * this.timedelta / 1000;
                this.y -= this.vy * this.timedelta / 1000;
            }
        }
        if (this.y + this.height > 600) {
            this.y = 600 - this.height;
            this.vy = 0;//掉落平地停下来
            if (this.status === 3) this.status = 0;
        } else if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }
    update() {//每一帧是渲染当前状态，需要先计算当前状态是什么再渲染
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();
        this.render();
    }
    render() {
        // this.ctx.fillStyle = 'blue';
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);//标定人物方框
        // if (this.direction > 0) {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);//标定拳头小方块
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + this.width - 100 - 120, this.y + 40, 100, 20);//标定拳头小方块
        // }
        let status = this.status;
        if (this.status === 1 && this.direction * this.vx < 0) {//表示后退
            status = 2;
        }
        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;//当前渲染到第几帧,有除号要取整
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;//当前渲染到第几帧,有除号要取整
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            }
        }
        this.frame_current_cnt++;//写完每一帧要记录一下，这样是1s走60帧，太快了，用frame_rate来调

        if (status === 4 || status === 5 || status === 6) {//已经是最后一帧即播放完了
            if (this.frame_current_cnt === obj.frame_rate * obj.frame_cnt) {
                if (status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                }
            }
        }
    }
}