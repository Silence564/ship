class maneuvering {
    constructor(){};
    controle_check_line(data, nameAgent, description) {
        const distance = data.distance;
        const safeThreshold = 1000; // допустимый безопасный порог
        if (distance <= safeThreshold && data.trueBearing > 0 && data.angle < 90 && data.angle > -90) {
            console.log("Нарушена зона безопасного плавания. Впереди", nameAgent, " опасная зона ", description);
            return 0;
        }
        return 1;
    }
    controle_check(data, nameAgent){
        const distance = data.distance;
        if (distance <= 800){
            console.log("Нарушена зона безопасного плавания. Объект ", data.name, " вторгся в зону объекта ", nameAgent);
            return 0;
        }
        return 1;
    }
    relativePath(agent1, agent2, obs, Bearing, Distance){
        let agentFlag = 0;
        for (let i =0 ; i< Bearing.length; i++){
            if (agent2.name == Bearing[i][0])
                agentFlag = i;
        }
        
        let teta = Bearing[agentFlag][1][1] - Bearing[agentFlag][1][2];
        let m = Distance[agentFlag][1][1]/Distance[agentFlag][1][2];
        //console.log(m, teta);
        const k_D = Math.sqrt(1+m*m-(2*m*Math.cos(teta)))
        //console.log("k_d=", k_D);
        //console.log( k_D*Distance[agentFlag][1][2]);
        return k_D*Distance[agentFlag][1][2];
    }
    relativeVelocity(flag, agent, obs){
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
                return k_V*obs.v;
            }
            case 3:{
                let dzeta = agent.angle - obs.angle;
                let m = agent.v/obs.v;
                //console.log(m, dzeta);
                const k_V = Math.sqrt(1+m*m-(2*m*Math.cos(dzeta)))
                //console.log("k_v: ",k_V);
                return k_V*obs.v;
            }
        }
    }
    relativeCourse(agent1, agent2, obs, Bearing, Distance){
        let agentFlag = 0;
        for (let i =0 ; i< Bearing.length; i++){
            if (agent2.name == Bearing[i][0])
                agentFlag = i;
        }
        //console.log(Distance, Bearing);
        let teta = Bearing[agentFlag][1][1] - Bearing[agentFlag][1][2];
        let m = Distance[agentFlag][1][1]/Distance[agentFlag][1][2];
        //console.log(m, teta);
        let up = m* Math.sin(teta);
        let down = 1- (m*Math.cos(teta));
        let p_0 = Math.atan(up/down)* 180 / Math.PI;
        //console.log("Относит кур угол", p_0);
        //console.log(Bearing[agentFlag][1][0]- p_0);
        return [Bearing[agentFlag][1][0]- p_0, agentFlag];
    }
    CourseAngle(obs){
        if (obs.trueBearing > 180){
            return obs.trueBearing -180 - obs.course
        }
        return obs.trueBearing +180 - obs.course;
    }
    relativeAngle(obs){
        let RC = obs.relativeCourse;
        let p_0 = obs.trueBearing - RC;
        return p_0
    }
    criticalAngle(agent1, agent2){
        if (agent1.v > agent2.v) {
            let q_k = this.CourseAngle(agent2);
            let p_0 = this.relativeAngle(agent2);
            //console.log("HELLO", agent2.name, q_k);
            if (Math.asin(agent2.v/agent1.v* Math.sin(p_0+q_k))*180/Math.PI == q_k) return 90;
            return Math.asin(agent2.v/agent1.v* Math.sin(p_0+q_k))*180/Math.PI;
        }
        const Q = Math.asin(agent1.v/agent2.v)*180/Math.PI;
        //console.log("Q: ", Q);
        return Q;
    }
    courseAngleNew(agent, env){
        let D_1 = 800;
       
        let D_0 = env.distance;
        let q_0 = Math.sin(env.angle);
        //console.log(q_0);
        let q_1 = Math.asin((D_0*q_0)/D_1)*180/Math.PI;
        console.log(q_1);
        return q_1;
    }
    CourseNew(agent, env){
        let D_1 = 500;
        if (env.angle < 0){
            D_1 = env.distance;
        }
        if(D_1 > env.distance) D_1 = env.distance - 100;
        
        let D_0 = env.distance;
        let q_0 = Math.asin(D_1/D_0)*180/Math.PI;
        //console.log(q_0);
        let K_1 = env.trueBearing+180-q_0;
        let K_2 = env.trueBearing-180+q_0;
        return [K_1, K_2];
    }
    course(agent1, agent2, obs, Bearing, Distance){
        let agentFlag = 0;
        for (let i =0 ; i< Bearing.length; i++){
            if (agent2.name == Bearing[i][0])
                agentFlag = i;
        }
        
        let V_p = this.relativeVelocity(3, agent1, agent2);
        //console.log(obs.relativePath, V_p);
        let m = agent1.v/agent2.v;
        let k_v = V_p/agent2.v;
        //console.log("k_v",k_v);
        let argForAcos = (1 + m * m - k_v * k_v) / (2 * m);
        if (argForAcos > 1) argForAcos = 1;
        if (argForAcos < -1) argForAcos = -1;
        let dzeta = Math.acos(argForAcos)* 180 / Math.PI;
        //console.log(dzeta);
        if(dzeta < 180) {dzeta = dzeta+180;
        } else if(dzeta > 180) {dzeta = dzeta-180;
        }
        let newAngle = agent1.angle - dzeta;
        if (agent1.angle < dzeta) newAngle = agent1.angle + dzeta

    // Нормализация угла (для корректировки направления поворота)
        while (newAngle < 0) newAngle += 360;
        while (newAngle >= 360) newAngle -= 360;
        //console.log("AAAAAAAAAA2",newAngle);
        return newAngle; // Просто уменьшаем угол
        
    }
}
module.exports = maneuvering;