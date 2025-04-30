const MovementStrategy = require('./strategy_interface');
const utils = new (require('../rti/utils'));

class RotateStrategy_R extends MovementStrategy {
    execute(store) {
        const [dAngle, dx, dy] = utils.rotate(true, store);
        store.angle += dAngle;
        store.x += dx;
        store.y += dy;
    }
}

module.exports = RotateStrategy_R;