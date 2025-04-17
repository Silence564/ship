const MovementStrategy = require('./strategy_interface');
const utils = new (require('../rti/utils'));

class RotateStrategy_L extends MovementStrategy {
    execute(store) {
        const [dAngle, dx, dy] = utils.rotate(false, store);
        store.angle += dAngle;
        store.x += dx;
        store.y += dy;
    }
}

module.exports =  RotateStrategy_L;