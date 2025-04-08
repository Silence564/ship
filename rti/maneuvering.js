let maneuvering = {

    controle_check: function(data, nameAgent){
        const distance = data.distance;
        if (distance <= 800){
            console.log("Нарушена зона безопасного плавания. Объект ", data.name, " вторгся в зону объекта ", nameAgent);
            return 0;
        }
        return 1;
    },
    relativePath: function(agent1, agent2, obs, Bearing, Distance){
        let agentFlag = 0;
        for (let i =0 ; i< Bearing.length; i++){
            if (agent2.name == Bearing[i][0])
                agentFlag = i;
        }
        
        let teta = Math.round(Bearing[agentFlag][1][1] - Bearing[agentFlag][1][2]);
        let m = Distance[agentFlag][1][1]/Distance[agentFlag][1][2];
        //console.log(m, teta);
        const k_D = Math.sqrt(1+m*m-(2*m*Math.cos(teta)))
        //console.log("k_d=", k_D);
        //console.log( k_D*Distance[agentFlag][1][2]);
        return k_D*Distance[agentFlag][1][2];
    },
    relativeVelocity:  function(flag, agent, obs){
        switch (flag){
            case 0:
                return agent.v + obs.v;
            case 1:
                return agent.v - obs.v;
            case 2:{
                let dzeta = agent.angle - obs.course;
                let m = agent.v/obs.v;
                //console.log(m, dzeta);
                const k_V = Math.sqrt(1+m*m-(2*m*Math.cos(dzeta)))
                //console.log( k_V*obs.course);
                return k_V*obs.course;
            }
        }
    },
    relativeCourse: function(agent1, agent2, obs, Bearing, Distance){
        let agentFlag = 0;
        for (let i =0 ; i< Bearing.length; i++){
            if (agent2.name == Bearing[i][0])
                agentFlag = i;
        }
        //console.log(Distance, Bearing);
        let teta = Math.round(Bearing[agentFlag][1][1] - Bearing[agentFlag][1][2]);
        let m = Distance[agentFlag][1][1]/Distance[agentFlag][1][2];
        //console.log(m, teta);
        let up = m* Math.sin(teta);
        let down = 1- (m*Math.cos(teta));
        let p_0 = Math.atan(up/down)* 180 / Math.PI;
        //console.log(p_0);
        //console.log(Bearing[agentFlag][1][0]- p_0);
        return [Bearing[agentFlag][1][0]- p_0, agentFlag];
    },
    criticalAngle: function(agent1, agent2){
        if (agent1.v > agent2.v) return Math.asin(agent2.v/agent1.v)*180/Math.PI;
        const Q = Math.asin(agent1.v/agent2.v)*180/Math.PI;
        return Q;
    },
}

module.exports = maneuvering;