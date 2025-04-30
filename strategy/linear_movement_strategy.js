const MovementStrategy = require('./strategy_interface');
const utils = new (require('../rti/utils'));

class LinearMovementStrategy extends MovementStrategy {
    execute(store) {
        const [dx, dy] = utils.linearIncrement(store.angle, store.v);
        store.x += dx;
        store.y += dy;
    }
}

module.exports = LinearMovementStrategy;