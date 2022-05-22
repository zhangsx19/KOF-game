import { Kyo } from './game_player/kyo.js';
import { GameMap } from '/static/js/game_map/base.js';
//import { Player } from '/static/js/game_player/base.js';

class KOF {//游戏大窗口 包括地图和玩家
    constructor(id) {//id用来索引kof的
        this.$kof = $('#' + id);
        this.game_map = new GameMap(this);
        this.Players = [
            new Kyo(this, {
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
                id: 0,
            }),
            new Kyo(this, {
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
                id: 1,
            }),
        ];
    }
}
export {
    KOF
}