class Agent {
    constructor(strategy) {
        this.strategy = strategy;
        this.store = null;
    }

    getCurrentStrategyType() {
        return this.strategy.type; 
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    move() {
        this.strategy.execute(this.store);
    }
}

module.exports = Agent;