const MovementStrategy = require('./strategy_interface');
const utils = new (require('../rti/utils'));

class BrakeStrategy extends MovementStrategy {
    execute(store) {
        store.v = utils.braking(store.v, -0.5); // Медленно тормозим
    }
}

module.exports = BrakeStrategy;