let decision = {
    purpose: function(agent1, obs, agent2){
        if(agent1.v > obs.v && agent1.angle == obs.course){
            console.log("СОВЕРШАЕМ ОБГОН");
            return 1;
        }
        if(agent1.length > agent2.length){
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ МЕНЬШИЕ ГАБАРИТЫ, СОВЕРШЕНИЕ МАНЕВРА");
            return 2;
        }else{
            console.log("ОБЪЕКТ МАНЕВРА ИМЕЕТ БОЛЬШЕ ГАБАРИТЫ, СОВЕРШЕНИЕ МАНЕВРА");
            return 0;
        }
    }
}

module.exports = decision;