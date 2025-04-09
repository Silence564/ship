let active = {
    main: function(store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y){
        if (decision.checkAngle(store) == 1){ //совершаем поворот при движении на встречу
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                [dAngle, dx, dy] = utils.rotate(true, store);
                store.angle += dAngle;
                store.x += dx;
                store.y += dy;
                console.log("----------------ROTATE------------------");
            }else {
                store.angleFlag = 2;
                store.angle = store.angleTemp;
                store.active = "null";
            }
        }else if (decision.checkAngle(store) == 2 && decision.flagPath == 1){ //совершаем поворот после маневра при движении навстречу
            if (store.angleTemp - store.angle < Math.abs(store.criticalAngle)){
                [dAngle, dx, dy] = utils.rotate(false, store);
                store.angle += dAngle;
                store.x += dx;
                store.y += dy;
                console.log("----------------ROTATE------------------");
            }else {
                store.angleFlag = 0;
                store.angle = store.angleTemp;
                decision.flagPath = 0;
            }
        }else if(decision.checkAngle(store) == 4){ //совершаем поворот при обгоне
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                [dAngle, dx, dy] = utils.rotate(true, store);
                store.angle += dAngle;
                store.x += dx;
                store.y += dy;
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 3;
                store.angle = store.angleTemp;
            }
        }else if(decision.checkAngle(store) == 3 && decision.flagPath == 2){ //совершаем поворот после маневра обгона
            if (store.angleTemp - store.angle < Math.abs(store.criticalAngle)){
                [dAngle, dx, dy] = utils.rotate(false, store);
                store.angle += dAngle;
                store.x += dx;
                store.y += dy;
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 0;
                store.angle = store.angleTemp;
                decision.flagPath = 0;
                store.active = "null";
            }
        }else if (decision.checkAngle(store) == 5){ //совершаем поворот для пересечения курсов
            if (store.angle - store.angleTemp < Math.abs(store.criticalAngle)){
                [dAngle, dx, dy] = utils.rotate(true, store);
                store.angle += dAngle;
                store.x += dx;
                store.y += dy;
                console.log("----------------ROTATE------------------");
            }else{
                store.angleFlag = 6;
            }
        }else if(decision.checkAngle(store) == 6 && decision.traverse(observed[store.indexObs]) && store.indexObs != undefined){
            store.angleFlag = 0;
            store.angle = store.angleTemp; 
            store.active = "null";
        }else{ //движение прямо
            [dx, dy] = utils.linearIncrement(store.angle, store.v); // Пересчитали в приращение
            store.x += dx; // Применили приращение
            store.y += dy;
            if (store.indexObs != undefined && decision.checkPath(Distancetemp[store.name][store.indexObs]) && store.angleFlag == 2) decision.flagPath = 1;
            //console.log(observed[store.indexObs]);
            if(store.indexObs != undefined && decision.overtake(store, observed[store.indexObs]) && store.angleFlag == 3) decision.flagPath = 2;
        }   
    },
}

module.exports = active;
