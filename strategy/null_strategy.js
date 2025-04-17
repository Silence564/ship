const MovementStrategy = require('./strategy_interface');

class NullStrategy extends MovementStrategy {
    execute(store) {
        console.log(store);
    }
}

module.exports = NullStrategy;