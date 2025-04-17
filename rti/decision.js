class decision {
    constructor(){
        this.min = 1000;
        this.flag = 0;
        this.flagPath = 0;
        this.DistanceWalk = 0;
    }
    
    purpose(agent1, obs, agent2){ //делаем маневр
        if(agent1.v > obs.v && agent1.angle == obs.course){
            if(agent2.active == "overtake") return 2; //не препятствуем обгону
            
            console.log("СОВЕРШАЕМ ОБГОН");
            return 0;
        }
        if(agent1.length < agent2.length && Math.abs(agent1.angle - obs.course) == 180 && agent1.v < obs.v){ 
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ БОЛЬШИЕ ГАБАРИТЫ И БОЛЬШУЮ СКОРОСТЬ, ОН ТОЖЕ СОВЕРШАЕТ МАНЕВР");
            agent2.active = "theSlope";
            return 3;
        }else if (agent1.length < agent2.length && Math.abs(agent1.angle - obs.course) == 180){//делаем маневр
            //console.log(agent1.angle, obs.course);
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ БОЛЬШЕ ГАБАРИТЫ, СОВЕРШЕНИЕ МАНЕВРА");
            return 1;
        }else if (agent1.active == "theSlope"){
            console.log("ДЕЛАЕМ УКЛОН");
            return 3;
        }
        return 2;
    }

    purpose1(agent1, obs, agent2){ //делаем маневр для пересечения курса
        //console.log(agent2);
        if(agent2.active == "envM" && agent1.v > obs.v) {
                console.log("СБАВЛЯЕМ СКОРОСТЬ ");
                return 3; //  не обгоняем, так как объекта маневра совершает маневр;
            }
        if (obs.angle > 0 && agent1.active != "stop" && agent2.active != "stop" && agent1.v >= obs.v && obs.trueBearing < 180){
            console.log("ОБЪЕКТ МАНЕВРА НАХОДИТСЯ ПО ПРАВУЮ СТОРОНУ, УСТУПАЕМ ПУТЬ")
            return 1;
        }

        if (obs.angle > 0 && agent1.active != "stop" && agent2.active != "stop" && agent1.v >= obs.v && obs.trueBearing >= 180){
            console.log("ОБЪЕКТ МАНЕВРА НАХОДИТСЯ ПО ЛЕВУЮ СТОРОНУ, УСТУПАЕМ ПУТЬ!!!!")
            return 2;
        }
       return 0;
    }

    purpose2(agent, env){
        if (env.trueBearing != 360 ){
            console.log("ПОД УГЛОМ", env.angle, "НАХОДИТСЯ ОПАСНАЯ ЗОНА, ОТКЛОНЯЕМСЯ ОТ НЕЕ");
            return 1;
        }
        return 0;
    }

    check_reason(agent1, obs, agent2){
        if (agent1.the_reason_for_the_decrease == agent2.name && obs.distance > 1500) return 1
        return 0;
    }

    checkAngle(agent){
        if(agent.angleFlag == 9){
            return 9;
        }
        if(agent.angleFlag == 8){
            return 8;
        }
        if(agent.angleFlag == 7){
            return 7;
        }
        if(agent.angleFlag == 6){
            return 6;
        }
        if(agent.angleFlag == 5){
            return 5;
        }
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
    }

    checkPath(Distancetemp){
        //console.log(Distancetemp);
        if (Distancetemp[1][1] < this.min){
            this.min = Distancetemp[1][1];
            this.flag = 0;
        }else{
            this.flag++;
        }
        if (this.flag == 5){
            return 1;
        }
        return 0;
    }

    overtake(agent, obs){
        if (this.DistanceWalk == 0) this.DistanceWalk = obs.distance + agent.length*1.5;
        if (this.DistanceWalk < obs.distance) {
            return 1;
        }else{
            return 0;
        }
    }

    traverse(obs){
        if (Math.abs(obs.angle) >= 90)
            return 1;
        return 0;
    }
}

module.exports = decision;

//Значения для флага angleFlag
/*0 - маневр не требуется
1 - отклоняемся на заданный угол
2 - контролируем прохождение промежуточного значения

3 - выполняем возвращение на прошлый курс, выход из обгона
4 - совершение маневра обгона

5 - маневр при пересечении курсов
6 - выход на траверз и возращение на первоначальный курс
7 - обход опасной зоны
8 - сбавляем скорость
9 - ожидание возвращения скорости*/