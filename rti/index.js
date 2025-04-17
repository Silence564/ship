const fs = require('fs');
const folder = "./agents/";
const folder2 = "./environment/";

class rti {
    constructor(){
        this.agents = []; //массив агентов
        this.zones = []; //массив опасных зон
        this.time = 0; // время
        this.config = {};
        this.Bearingtemp = [];
        this.Distancetemp = [];
        this.Vtemp_x = [];
        this.Vtemp_y = [];
        this.flag_desicion = 0;
        this.utils = new (require('./utils'));
        this.maneuvering = new (require('./maneuvering'));
        this.active = new (require('./active'));
        this.decision = new (require('./decision'));
    }
    
    init() {
        this.time = 0;
        this.agents = [];
        this.zones = [];

        this.Bearingtemp = [];
        this.Distancetemp = [];

        let files = fs.readdirSync(folder)
        console.log(JSON.stringify(files))

        let files2 = fs.readdirSync(folder2)
        console.log(JSON.stringify(files2))
    
        for(let file of files)
            if (file.endsWith(".js")) {
                let agent = fs.readFileSync(folder + file, {encoding:"utf-8"});
                agent = eval(agent);
                agent.init.name = file.substr(0, file.length - 3); 
                agent.init.time = this.time;
                agent.store = JSON.parse(JSON.stringify(agent.init));
                this.agents.push(agent);
            }
        for(let file of files2)
            if (file.endsWith(".js")) {
                let zona = fs.readFileSync(folder2 + file, {encoding:"utf-8"});
                zona = eval(zona);
                zona.init.name = file.substr(0, file.length - 3); 
                zona.store = JSON.parse(JSON.stringify(zona.init));
                this.zones.push(zona);
            }
        for (let i = 0; i < this.agents.length; i++) {
            let agent = this.agents[i];
            this.Bearingtemp[agent.init.name] = [];
            this.Distancetemp[agent.init.name] = [];
            this.Vtemp_x[agent.init.name] = [];
            this.Vtemp_y[agent.init.name] = [];
            agent.init.invFreq = Math.floor(1 / agent.init.frequency);
            let n = 0;
            for (let j = 0; j < this.agents.length; j++) {
                if (i !=j){
                    this.Bearingtemp[agent.init.name][n] = [this.agents[j].init.name, {}];
                    this.Distancetemp[agent.init.name][n] = [this.agents[j].init.name, {}];
                    this.Vtemp_x[agent.init.name][n] = [this.agents[j].init.name, {}];
                    this.Vtemp_y[agent.init.name][n] = [this.agents[j].init.name, {}];
                    n++;
                }
            }
        }
        //console.log(this.Distancetemp, this.Bearingtemp);
        
        let config = fs.readFileSync(folder + "config.json", {encoding:"utf-8"});
        this.config = JSON.parse(config);
        this.utils.seed(this.config.seed);
    }
    next() {
        let timetemp = 0;
        this.time++;
        for (let i = 0; i < this.agents.length; i++) {
            this.calcObservations(this.agents[i], this.agents, this.Bearingtemp, this.Distancetemp, this.Vtemp_x, this.Vtemp_y, this.zones);
        }
        for (let i = 0; i < this.agents.length; i++) {
            let agent = this.agents[i];
            //console.log(agent.store);
            if (!agent.store.angleTemp){
                agent.store.angleTemp = agent.store.angle;  
                agent.store.angleFlag = 0;
                agent.store.vTemp = agent.store.v;
            }
            for(let j =0; j < agent.observed.length; j++){
                if (agent.observed[j].Maneuver && agent.store.angleFlag != 4){
                    agent.store.indexObs = j;
                    console.log("----SOS----SOS----SOS----SOS----");
                }else if (agent.observed[j].Maneuver && agent.store.angleFlag == 4){
                    agent.store.indexObs = j;
                    console.log("----SOS----SOS----SOS----SOS----");
                }else if(agent.store.angleFlag == 8) agent.store.indexObs = j;
            }
            for(let j =0; j < agent.enviroment.length; j++){
                if (agent.enviroment[j].Maneuver){
                    console.log("----SOS----SOS----SOS----SOS----");
                }
            }
            agent.store.time = this.time;
            agent.store.angle *= 1
            agent.store.angleTemp *= 1 //для временного изменения
            agent.store.v *= 1
            agent.update(this.active, agent.store, agent.observed, this.maneuvering, this.Bearingtemp, this.Distancetemp,this.Vtemp_x, this.Vtemp_y);
            agent.store.x = this.utils.round1(agent.store.x);
            agent.store.y = this.utils.round1(agent.store.y);
            agent.store.angle = this.utils.round5(agent.store.angle);
            agent.store.angleTemp = this.utils.round5(agent.store.angleTemp);
            agent.store.v = this.utils.round5(agent.store.v);
        }
    }
    calcObservations(agent, list, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y, zones) {
        agent.observed = [];
        agent.real = [];
        agent.enviroment = [];
        if (agent.store.time % agent.init.invFreq == 0) {
            for(let j = 0; j < zones.length; j++){
                let real = this.utils.distanceToPolygonANDangle(agent.store, zones[j].store.points);
                real.name = zones[j].store.name;
                agent.real.push(real);
                let env = JSON.parse(JSON.stringify(real));
                const dr = this.utils.randomNormal(this.config.distance.mean, this.config.distance.std) * 1;
                const ar = this.utils.randomNormal(this.config.peleng.mean, this.config.peleng.std) * 1;  
                env.distance = this.utils.round1(env.distance + dr);
                env.angle = this.utils.round5(env.angle + ar);
                agent.enviroment.push(env);
                let flag_env = this.maneuvering.controle_check_line(env, agent.store.name, zones[j].store.description);
                if (!flag_env){
                    if(this.decision.purpose2(agent.store, env)){
                        env.Maneuver = true;
                        let newCourses = this.maneuvering.CourseNew(agent.store, env);
                        if(agent.store.active != "envM" && agent.store.angleFlag !=7) {
                        // Выбор оптимального курса (ближайшего к исходному направлению)
                            let selectedCourse = newCourses.reduce((best, current) => {
                                return Math.abs(current - agent.store.angle) < Math.abs(best - agent.store.angle) ? current : best;
                            });
                            if (selectedCourse == agent.store.angle){
                                if(env.thueBearing <=180){
                                    selectedCourse = agent.store.angle/2;
                                }
                            }
                            agent.store.newCourse = selectedCourse;
                        } 
                        agent.store.active = "envM";  
                        agent.store.angleFlag = 7;
                    }
                    console.log(agent.store.newCourse);
                }
                env.Maneuver = false;
            }

            for (let i = 0; i < list.length; i++) {
                if (agent.store.name != list[i].store.name) {
                    let real = this.utils.observation(agent.store, list[i].store);
                    real.name = list[i].store.name;
                    agent.real.push(real);
                    let obs = JSON.parse(JSON.stringify(real));
                    const dr = this.utils.randomNormal(this.config.distance.mean, this.config.distance.std) * 1;
                    const ar = this.utils.randomNormal(this.config.peleng.mean, this.config.peleng.std) * 1;
                    obs.distance = this.utils.round1(obs.distance + dr);
                    obs.angle = this.utils.round5(obs.angle + ar);
                    agent.observed.push(obs);
                    let flagXY = 0
                    //Заполнение массивов для пеленгов и дистанций (прошлое значение и текущее)
                    for (let j =0; j < list.length-1; j++){
                        if (Bearingtemp[agent.store.name][j][0] == list[i].store.name){
                            if (Bearingtemp[agent.store.name][j][1][1]){
                                let temp1 = Bearingtemp[agent.store.name][j][1][1];
                                let temp2 = Distancetemp[agent.store.name][j][1][1];
                                let temp3 = Vtemp_x[agent.store.name][j][1][1];
                                let temp4 = Vtemp_y[agent.store.name][j][1][1];
                                Bearingtemp[agent.store.name][j][1][0] = temp1;
                                Distancetemp[agent.store.name][j][1][0] = temp2;
                                Vtemp_x[agent.store.name][j][1][0] = temp3;
                                Vtemp_y[agent.store.name][j][1][0] = temp4;
                                Bearingtemp[agent.store.name][j][1][1] = obs.trueBearing;
                                Distancetemp[agent.store.name][j][1][1] = obs.distance;
                                Vtemp_x[agent.store.name][j][1][1] = list[i].store.x;
                                Vtemp_y[agent.store.name][j][1][1] = list[i].store.y;
                            }

                            if (Bearingtemp[agent.store.name][j][1][0]){
                                Bearingtemp[agent.store.name][j][1][1] = obs.trueBearing;
                                Distancetemp[agent.store.name][j][1][1] = obs.distance;
                                Vtemp_x[agent.store.name][j][1][1] = list[i].store.x;
                                Vtemp_y[agent.store.name][j][1][1] = list[i].store.y;
                                flagXY = 1;
                            } else{
                                Bearingtemp[agent.store.name][j][1][0] = obs.trueBearing;
                                Distancetemp[agent.store.name][j][1][0] = obs.distance;
                                Vtemp_x[agent.store.name][j][1][0] = list[i].store.x;
                                Vtemp_y[agent.store.name][j][1][0] = list[i].store.y;
                                Bearingtemp[agent.store.name][j][1][2] = obs.trueBearing; //начальный пеленг
                                Distancetemp[agent.store.name][j][1][2] = obs.distance; //начальная дистанция
                            }
                        }
                        if (flagXY == 1){ //расчет скорости оппонента ()
                            //console.log("x:", Vtemp_x[agent.store.name][j][1][1]-Vtemp_x[agent.store.name][j][1][0], "y:", Vtemp_y[agent.store.name][j][1][1]-Vtemp_y[agent.store.name][j][1][0])
                            //console.log("xn:", 0, "yn:", Vtemp_y[agent.store.name][j][1][0]+1-Vtemp_y[agent.store.name][j][1][0])
                            let r = Math.sqrt((Vtemp_x[agent.store.name][j][1][1]-Vtemp_x[agent.store.name][j][1][0])*(Vtemp_x[agent.store.name][j][1][1]-Vtemp_x[agent.store.name][j][1][0])+(Vtemp_y[agent.store.name][j][1][1]-Vtemp_y[agent.store.name][j][1][0])*(Vtemp_y[agent.store.name][j][1][1]-Vtemp_y[agent.store.name][j][1][0]));
                            obs.v = r/1;
                            //let course = Math.acos((Vtemp_y[agent.store.name][j][1][1]-Vtemp_y[agent.store.name][j][1][0])/(r))*180/Math.PI;
                            //console.log("result", course);
                            //console.log(obs.name, obs.v)
                            flagXY = 0;
                            obs.Maneuver = false;
                        }
                    }

                    let flag_obs = this.maneuvering.controle_check(obs, agent.store.name);    //Проверка на не пересечение зоны безопасного плавания
                    if (this.decision.check_reason(agent.store, obs, list[i].store)){
                        agent.store.angleFlag = 9;
                    }
                    let relativecourse;
                    if (agent.store.active == "stop" && flag_obs && list[i].store.active == "null")
                        agent.store.active = "null";
                    if (!flag_obs){
                        relativecourse = this.maneuvering.relativeCourse(agent.store, list[i].store, obs, Bearingtemp[agent.store.name], Distancetemp[agent.store.name]);
                        obs.relativeCourse = relativecourse[0];
                        //console.log(obs.relativeCourse);
                        if(Bearingtemp[agent.store.name][relativecourse[1]][1][0] == relativecourse[0]){//встречный и единый курс
                            //console.log(obs);
                            const angleDiff = Math.abs(agent.store.angle % 360 - relativecourse[0]);
                            // Проверяем параллельность или встречу (равенство углов или разница равна 180)
                            if (angleDiff == 0 || angleDiff == 180) {
                                // Рассматриваем динамику изменений координаты x и y
                                const deltaX = Vtemp_x[agent.store.name][relativecourse[1]][1][1] - Vtemp_x[agent.store.name][relativecourse[1]][1][0];
                                const deltaY = Vtemp_y[agent.store.name][relativecourse[1]][1][1] - Vtemp_y[agent.store.name][relativecourse[1]][1][0];
                                if (deltaX !== 0) { // Есть движение по горизонтали
                                    if ((deltaX < 0 && agent.store.angle > 180) || (deltaX > 0 && agent.store.angle <= 180)) {
                                        obs.course = agent.store.angle;
                                    } else {
                                        obs.course = (agent.store.angle + 180) % 360;
                                    }
                                } else if (deltaY !== 0) { // Движение по вертикали
                                    if ((deltaY > 0 && (agent.store.angle > 270 || agent.store.angle < 90)) || (deltaY < 0 && agent.store.angle > 180 && agent.store.angle < 270)) {
                                        obs.course = agent.store.angle;
                                    } else {
                                        obs.course = (agent.store.angle + 180) % 360;
                                    }
                                }
                            }

                            
                            if (agent.store.angle == obs.course){
                                obs.relativeVelocity = this.maneuvering.relativeVelocity(1, agent.store, obs);
                            }else{
                                obs.relativeVelocity = this.maneuvering.relativeVelocity(0, agent.store, obs);
                            }
                            
                            //console.log(obs.relativeVelocity);
                            obs.relativePath = obs.distance;
                            obs.Maneuver = false; //флаг для определения совершения маневра

                            let purpose = this.decision.purpose(agent.store, obs, list[i].store);
                            if(purpose == 1 )  {
                                obs.Maneuver = true;
                                //console.log(this.maneuvering.criticalAngle(agent.store, obs)); 
                                agent.store.criticalAngle = this.maneuvering.criticalAngle(agent.store, obs);//критический угол
                                agent.store.angleFlag = 1;
                            }else if (purpose == 0 && agent.store.v > obs.v){
                                obs.Maneuver = true;
                                agent.store.active = "overtake";
                                agent.store.criticalAngle = this.maneuvering.criticalAngle(agent.store, obs);//критический угол
                                agent.store.angleFlag = 4;
                            }else if(purpose == 3){
                                obs.Maneuver = true;
                                if (agent.store.v < obs.v){
                                    agent.store.criticalAngle = 90 + (360 - obs.trueBearing) + this.maneuvering.criticalAngle(agent.store, obs);
                                }else{
                                    agent.store.criticalAngle = 20;
                                    agent.store.angleFlag = 1;
                                }
                            }
                        }else{
                            //вычисление относительного пути и относительной скорости для пересечения курсов
                            obs.relativeVelocity = this.maneuvering.relativeVelocity(2, agent.store, obs);
                            obs.relativePath = this.maneuvering.relativePath(agent.store, list[i].store, obs, Bearingtemp[agent.store.name], Distancetemp[agent.store.name]);
                            //console.log(obs.relativePath);
                            //console.log(obs.relativeVelocity);
                            let purpose1 = this.decision.purpose1(agent.store, obs, list[i].store);
                            if (purpose1 == 1){
                                obs.Maneuver = true;
                                agent.store.criticalAngle = this.maneuvering.criticalAngle(agent.store, obs);
                                agent.store.angleFlag = 5;
                                agent.store.active = "stop";
                                list[i].store.active = "stop";
                            }else if (purpose1 == 2){
                                obs.Maneuver = true;
                                agent.store.criticalAngle = this.maneuvering.criticalAngle(agent.store, obs);
                                agent.store.angleFlag = 5;
                                agent.store.active = "stop";
                                list[i].store.active = "stop";
                            }else if(purpose1 == 3 && obs.distance < 500){
                                agent.store.angleFlag = 8;
                                agent.store.the_reason_for_the_decrease = list[i].store.name;
                            }
                        } 
                        //console.log(obs.relativePath/obs.relativeVelocity);
                    }
                }
            }
        }
    }
}

module.exports = rti;
