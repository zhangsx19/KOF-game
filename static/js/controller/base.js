export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        this.pressed_keys = new Set();//连续按只存一次，抬起时再删除即可
        this.start();
    }
    start() {
        let outer = this;
        this.$canvas.keydown(function (e) {//e is keyboardEvent
            outer.pressed_keys.add(e.key);
        })
        this.$canvas.keyup(function (e) {
            outer.pressed_keys.delete(e.key);
        })
    }
}