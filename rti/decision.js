let decision = {
    min: 1000,
    flag: 0,
    flagPath: 0,
    DistanceWalk: 0,
    purpose: function(agent1, obs, agent2){ //делаем маневр
        if(agent1.v > obs.v && agent1.angle == obs.course && obs.distance < 100){
            if(agent2.active == "overtake") return 2; //не препятствуем обгону
            console.log("СОВЕРШАЕМ ОБГОН");
            return 0;
        }
        if(agent1.length > agent2.length && Math.abs(agent1.angle - obs.course) == 180){ 
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ МЕНЬШИЕ ГАБАРИТЫ, СОВЕРШЕНИЕ МАНЕВРА");
            return 2;
        }else if (agent1.length < agent2.length && Math.abs(agent1.angle - obs.course) == 180){//делаем маневр
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ БОЛЬШЕ ГАБАРИТЫ, СОВЕРШЕНИЕ МАНЕВРА");
            return 1;
        }
        return 2;
    },

    checkAngle: function(agent){
        if(agent.angleFlag == 3){
            return 3;
        }
        if(agent.angleFlag == 4){
            return 4;
        }
        if(agent.angleFlag == 2){
            return 2;
        }
        if(agent.angleFlag == 1){
            return 1;
        }else{
            return 0;
        }
    },
    checkPath: function(Distancetemp){
        console.log(Distancetemp);
        if (Distancetemp[1][1] < this.min){
            this.min = Distancetemp[1][1];
            flag = 0;
        }else{
            flag++;
        }
        if (flag == 5){
            return 1;
        }
        return 0;
    },
    overtake: function(agent, obs){
        if (this.DistanceWalk == 0) this.DistanceWalk = obs.distance + agent.length*1.5;
        if (this.DistanceWalk < obs.distance) {
            return 1;
        }else{
            return 0;
        }
    }
}

module.exports = decision;

//Значения для флага angleFlag
/*0 - маневр не требуется
1 - отклоняемся на заданный угол
2 - контролируем прохождение промежуточного значения 
3 - выполняем возвращение на прошлый курс, выход из обгона
4 - совершение маневра обгона
5 - */