let GAME_OBJECTS = [];//存所有对象
//base类
class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.timedelta = 0;//现在帧距离上一帧的时间
        //因为每个物体运动速度取决于时间而不是帧数
        this.has_call_start = false;
    }
    start() {//初始执行一次

    }
    update() {//每一帧执行一次(除了第一帧)

    }
    destroy() {//删除当前对象
        for (let i in GAME_OBJECTS) {
            if (GAME_OBJECTS[i] === this) {
                GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}


let last_timestamp;
let GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;//当前帧-上一帧
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(GAME_OBJECTS_FRAME);
}
requestAnimationFrame(GAME_OBJECTS_FRAME);

export {
    GameObject
}