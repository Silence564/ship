let historyJson = [];
let resp;
let configJson;

function drawScale(ctx, scale) {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,800, 800);
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(10, 400);
    ctx.lineTo(790, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(780, 405);
    ctx.lineTo(780, 395);
    ctx.lineTo(800, 400);
    ctx.lineTo(780, 405);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(405, 20);
    ctx.lineTo(395, 20);
    ctx.lineTo(400, 0);
    ctx.lineTo(405, 20);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(400, 10);
    ctx.lineTo(400, 790);
    ctx.stroke();
    let step = 1000 / scale;
    for(let i = 1; i < 390 / step; i++) {
        ctx.beginPath();
        ctx.moveTo(400 + i * step, 395);
        ctx.lineTo(400 + i * step, 405);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(400 - i * step, 395);
        ctx.lineTo(400 - i * step, 405);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(395, 400 + i * step);
        ctx.lineTo(405, 400 + i * step);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(395, 400 - i * step);
        ctx.lineTo(405, 400 - i * step);
        ctx.stroke();
    }
}

async function init() {
    let response = await fetch("update/init");
    if (response.ok) {
        let json = await response.json();
        resp = json;
        addHistory(resp.agents);
        struct(json);
        const canvas = document.getElementById("sea");
        const ctx = canvas.getContext('2d');
        drawScale(ctx, json.config.screen.scale);
        drawAllShips(json);
        drawAllZones(json);
        document.getElementById("next").disabled=false;
        document.getElementById("json").disabled=false;
        document.getElementById("config").disabled=false;
        document.getElementById("run").disabled=false;
        document.getElementById("history").disabled=false;
        historyJson = [];
    } else {
        console.log(response);
        alert("Ошибка HTTP: " + response.status);
    }
}

let counter;
let delay;
async function run() {
    counter = configJson.run.amount;
    delay = configJson.run.delay;
    document.getElementById("next").disabled=true;
    document.getElementById("json").disabled=true;
    document.getElementById("config").disabled=true;
    document.getElementById("run").disabled=true;
    document.getElementById("history").disabled=true;
    runner();
}

async function runner() {
    document.getElementById("run").textContent=`Run ${counter}`
    counter--;
    if(counter >= 0)
        setTimeout(()=>{
            next();
            runner();
        }, delay);
    else {
        document.getElementById("next").disabled=false;
        document.getElementById("json").disabled=false;
        document.getElementById("config").disabled=false;
        document.getElementById("run").disabled=false;
        document.getElementById("run").textContent=`Run ${configJson.run.amount}`
        document.getElementById("history").disabled=false;
    }
}

async function next() {
    let response = await fetch("update");
    if (response.ok) {
        let json = await response.json();
        resp = json.agents
        addHistory(resp);
        struct(json);
        drawAllShips(json);
        drawAllZones(json);
    } else {
        console.log(response);
        alert("Ошибка HTTP: " + response.status);
    }
}

function addHistory(agents) {
    let list = [];
    for(let a of agents) {
        let c = JSON.parse(JSON.stringify(a));
        delete c.init;
        list.push(c);
    }
    historyJson.push(list);
}

function history() {
    let div = document.getElementById("response");
    let map = new Map();
    for(let i = 0; i < historyJson.length; i++) {
        let row = historyJson[i];
        for(let j = 0; j < row.length; j++) {
            let ship = row[j];
            if(!map.get(ship.store.name))
                map.set(ship.store.name, `<h3>${ship.store.name}</h3>\nx;\ty;\tangle;\tv;\treal_name;\treal_dist;\treal_angle;\tobserved_name;\tobserved_dist;\tobserved_angle;<br>\n`);
            let data = map.get(ship.store.name);
            data += `${ship.store.x};\t${ship.store.y};\t${ship.store.angle};\t${ship.store.v};\t`;
            let obs = ""
            let real = ""
            if(ship.real) {
                for(let k = 0; k < ship.real.length; k++) {
                    obs += `${ship.observed[k].name};\t${ship.observed[k].distance};\t${ship.observed[k].angle};\t${ship.observed[k].trueBearing};\t`
                    real += `${ship.real[k].name};\t${ship.real[k].distance};\t${ship.real[k].angle};\t${ship.observed[k].trueBearing};\t`
                    //console.log(env);
                    //env += `${ship.enviroment[k].name};\t${ship.enviroment[k].distance};\t${ship.enviroment[k].angle};\t${ship.enviroment[k].trueBearing};\t`
                }
                data += real + obs +"<br>\n"
            }
            map.set(ship.store.name, data);        }
    }
    div.innerHTML = ``;
    for(let s of map.values())
        div.innerHTML += `${s}<br>`;
}

async function config() {
    let response = await fetch("update/config");
    if (response.ok) {
        let json = await response.json();
        let div = document.getElementById("response");
        div.innerHTML = `<b>Config</b>: ${JSON.stringify(json, null, "&nbsp;").replaceAll("\n", "<br>")}<br>`
    } else {
        console.log(response);
        alert("Ошибка HTTP: " + response.status);
    }
}

function json() {
    let div = document.getElementById("response");
    div.innerHTML = `<br>${JSON.stringify(resp, null, "&nbsp;").replaceAll("\n", "<br>")}`;
}

function struct(json) {
    let div = document.getElementById("response");
    div.innerHTML = `<span style="color: blue"><b>Time</b>: ${json.agents[0].store.time}</span><br>`
    for(let ship of json.agents)
        div.innerHTML += `<b>Ship</b> <u>${ship.store.name}</u>: (x,y, angle, v): (${ship.store.x}, ${ship.store.y}, ${ship.store.angle}, ${ship.store.v}),<br><div style="padding:10px"><span style="color: blue">observed</span>: ${JSON.stringify(ship.observed)}</div><br><div style="padding:10px"><span style="color: blue">enviroment</span>: ${JSON.stringify(ship.enviroment)}</div><br><br>,`;
    if(json.config) {
        div.innerHTML += `<br>${JSON.stringify(json.config, null, "&nbsp;").replaceAll("\n", "<br>")}`
        configJson = json.config
        document.getElementById("run").textContent=`Run ${configJson.run.amount}`
    }
}

function drawAllShips(json) {
    for(let ship of json.agents)
        drawShip(ship)
}

function drawAllZones(json) {
    for(let zona of json.zones)
        drawZone(zona)
}

function drawZone(json) {
    const canvas = document.getElementById("sea");
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(json.init.points[0].x / configJson.screen.scale + 400, 400 - json.init.points[0].y / configJson.screen.scale);
    for (let i = 1; i < json.init.points.length; i++) {
        ctx.lineTo(json.init.points[i].x / configJson.screen.scale + 400, 400 - json.init.points[i].y / configJson.screen.scale);
    }
    ctx.closePath();
    ctx.fillStyle = json.init.color;
    ctx.fill();
    ctx.strokeStyle = json.init.color || '#000'; // Цвет по умолчанию черный
    ctx.lineWidth = 2; // Толщина линии
    
    ctx.stroke();
}

function drawShip(json) {
    const canvas = document.getElementById("sea");
    const ctx = canvas.getContext('2d');
    const x = json.store.x / configJson.screen.scale + 400;
    const y = 400 - json.store.y / configJson.screen.scale;
    ctx.strokeStyle = json.init.color;
    ctx.strokeRect(x , y, 2, 2)
}

const canvas = document.getElementById("sea");
canvas.width = "800"
canvas.height = "800"
