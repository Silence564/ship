const LinearMovementStrategy  = require('../strategy/linear_movement_strategy');
const RotationStrategy_R = require('../strategy/rotate_strategy_R');
const RotationStrategy_L = require('../strategy/rotate_strategy_L');
const BrakeStrategy = require('../strategy/brake_strategy');
const BoostStrategy = require('../strategy/boost_strategy');
const NullStrategy = require('../strategy/null_strategy');
const Agent = require('../strategy/agent');

class active {
    constructor(){
        this.agent = new Agent(new LinearMovementStrategy());
        this.decision = new (require('./decision'));
    }
    main(store, observed, bearingTemp, distanceTemp, vTempX, vTempY) {
        this.agent.store = store;
        if (this.decision.checkAngle(store) == 1){ //совершаем поворот при движении на встречу
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                this.agent.setStrategy(new RotationStrategy_R());
                console.log("----------------ROTATE------------------");
            }else {
                store.angleFlag = 2;
                store.angle = store.angleTemp;
                store.active = "null";
                this.agent.setStrategy(new NullStrategy());
            }
        }else if (this.decision.checkAngle(store) == 2 && this.decision.flagPath == 1){ //совершаем поворот после маневра при движении навстречу
            if (store.angleTemp - store.angle < Math.abs(store.criticalAngle)){
                this.agent.setStrategy(new RotationStrategy_L());
                console.log("----------------ROTATE------------------");
            }else {
                store.angleFlag = 0;
                store.angle = store.angleTemp;
                this.decision.flagPath = 0;
                this.agent.setStrategy(new NullStrategy());
            }
        }else if(this.decision.checkAngle(store) == 4){ //совершаем поворот при обгоне
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                this.agent.setStrategy(new RotationStrategy_R());
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 3;
                store.angle = store.angleTemp;
                this.agent.setStrategy(new NullStrategy());
            }
        }else if(this.decision.checkAngle(store) == 3 && this.decision.flagPath == 2){ //совершаем поворот после маневра обгона
            if (store.angleTemp - store.angle < Math.abs(store.criticalAngle)){
                this.agent.setStrategy(new RotationStrategy_L());
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 0;
                store.angle = store.angleTemp;
                this.decision.flagPath = 0;
                store.active = "null";
                this.agent.setStrategy(new NullStrategy());
            }
        }else if (this.decision.checkAngle(store) == 5){ //совершаем поворот для пересечения курсов
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                this.agent.setStrategy(new RotationStrategy_R());
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 6;
                this.agent.setStrategy(new NullStrategy());
            }
        }else if(this.decision.checkAngle(store) == 6 && this.decision.traverse(observed[store.indexObs]) && store.indexObs != undefined){
            store.angleFlag = 0;
            store.angle = store.angleTemp; 
            store.active = "null";
            this.agent.setStrategy(new NullStrategy());
        }else if(this.decision.checkAngle(store) == 7){
            if (Math.round(store.angle - store.newCourse) != 0 && Math.round(store.angle - store.newCourse) > 0){
                this.agent.setStrategy(new RotationStrategy_L());
                console.log("----------------ROTATE------------------");
            }else if (Math.round(store.angle - store.newCourse) != 0 && Math.round(store.angle - store.newCourse) < 0){
                this.agent.setStrategy(new RotationStrategy_R());
                console.log("----------------ROTATE------------------");
            }else {
                store.angleFlag = 0;
                store.active = "finish";
                store.angle = store.angleTemp;
                this.agent.setStrategy(new NullStrategy());
            }
        }else if(this.decision.checkAngle(store) == 8){
            if (observed[store.indexObs].v < store.v)
                store.angleFlag = 0;
            this.agent.setStrategy(new BrakeStrategy());
        }else if(this.decision.checkAngle(store) == 9){
            console.log(store.vTemp);
            if (store.v > store.vTemp) {
                store.angleFlag = 0;
                store.the_reason_for_the_decrease = "null";}
                this.agent.setStrategy(new BoostStrategy());
        }else{ //движение прямо
            this.agent.setStrategy(new LinearMovementStrategy());
            if (store.indexObs != undefined && this.decision.checkPath(distanceTemp[store.name][store.indexObs]) && store.angleFlag == 2) this.decision.flagPath = 1;
            //console.log(observed[store.indexObs]);
            if(store.indexObs != undefined && this.decision.overtake(store, observed[store.indexObs]) && store.angleFlag == 3) this.decision.flagPath = 2;
        }   
        if (this.agent.getCurrentStrategyType() != "NullStrategy")
            this.agent.move();

    }
}

module.exports = active;

