const MovementStrategy = require('./strategy_interface');
const utils = new (require('../rti/utils'));

class BoostStrategy extends MovementStrategy {
    execute(store) {
        store.v = utils.braking(store.v, 0.5); 
    }
}

module.exports = BoostStrategy;