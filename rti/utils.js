const randomNormal = require('random-normal'); // https://github.com/mock-end/random-normal
const seedrandom = require('seedrandom'); // https://www.npmjs.com/package/seedrandom
class utils {
    seed(value) {
        seedrandom(value, { global: true });
    } 

    randomNormal(mean=0, dev=1) {
        return randomNormal({mean: mean, dev: dev});
    }

    linearIncrement(angle, v) {
        const v0 = v;
        const angle0 = angle / 180 * Math.PI;
        return this.polarToDecart(angle0, v0)
    }
    rotate(right, store) {
        if(!store.length)
            throw new Error("Expected length in store");
        let r = store.length * 2;
        let v = store.v;
        let angle = store.angle;
        let a = v / (r * Math.PI); // угол сектора в радианах по длине дуги
        let sign = (right ? 1 : -1); // в какую сторону поворачиваем
        let dAngle = sign * a * 180 / Math.PI;
        let c = 2 * r * Math.sin(a / 2); // длина хорды
        let gamma = angle + sign * (90 - (180 - a * 180  / Math.PI) / 2); // угол между хордой и вертикалью
        if (gamma < 0)
            gamma += 360;
        if (gamma > 360)
            gamma -= 360;
        let dx = c * Math.sin(gamma / 180 * Math.PI);
        let dy = c * Math.cos(gamma / 180 * Math.PI);
        return [dAngle, dx, dy];
    }

    polarToDecart(angle, distance) {
        return [Math.sin(angle)*distance, Math.cos(angle)*distance]
    }

    decartToPolar(dx, dy) {
        return [Math.sqrt(dy*dy + dx*dx), Math.atan2(dy, dx)]
    }

    braking(v, a = 0.5){
        if (v+a < 1) return v;
        return v + a;
    }

    observation(agent1, agent2) {
        // angle = arccos(dy / distance)
        const x1 = agent1.x;
        const x2 = agent2.x;
        const dx = x2 - x1;
        const y1 = agent1.y;
        const y2 = agent2.y;
        const dy = y2 - y1;
        const distance = Math.sqrt(dy*dy + dx*dx); //евклидово расстояние
        const signDx = Math.sign(dx) == 0 ? 1 : Math.sign(dx)
        let polarAngle = signDx * this.safeArccos(dy / distance);
        const angle1 = agent1.angle;
        const polarAngleGrad = polarAngle * 180 / Math.PI;
        let angle = polarAngleGrad - angle1;
        if(isNaN(angle))
            angle = 0
        if(angle > 180)
            angle -= 360
        if(angle < -180)
            angle += 360
        return {"distance": distance, "angle": this.round5(angle), "trueBearing": this.round5(angle1+angle)};
    }
    predictFuturePosition(agent, offsetDistance = 500) {
        const angleRad = agent.angle * Math.PI / 180; // Преобразуем угол в радианы
        const dx = offsetDistance * Math.cos(angleRad);
        const dy = offsetDistance * Math.sin(angleRad);
        return { x: agent.x + dx, y: agent.y + dy };
    }
    projectOnSegment(px, py, ax, ay, bx, by) {
        const abx = bx - ax;
        const aby = by - ay;
        const t = ((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby);
        if (t < 0) return { x: ax, y: ay };
        if (t > 1) return { x: bx, y: by };
        return { x: ax + t * abx, y: ay + t * aby };
    }
    distanceToSegment(px, py, ax, ay, bx, by) {
        const apx = px - ax;
        const apy = py - ay;
        const bax = bx - ax;
        const bay = by - ay;
    
        const ab2 = bax * bax + bay * bay;
        const ap_ab = apx * bax + apy * bay;
        let t = ap_ab / ab2;
    
        if (t < 0.0) {
            t = 0.0;
        } else if (t > 1.0) {
            t = 1.0;
        }
    
        const dx = ax + t * bax - px;
        const dy = ay + t * bay - py;
    
        return Math.sqrt(dx * dx + dy * dy);
    }
    distanceToPolygonANDangle(agent, polygon) {
        let minDist = Number.POSITIVE_INFINITY;
        const predictedPosition = this.predictFuturePosition(agent);
        let closestEdge = null;
        let dx = 0;
        let dy = 0;
        for (let i = 0; i < polygon.length; ++i) {
            const a = polygon[i];
            const b = polygon[(i + 1) % polygon.length];
            const dist = this.distanceToSegment(agent.x, agent.y, a.x, a.y, b.x, b.y);
            if (dist < minDist) {
                minDist = dist;
                closestEdge = { a, b };
            }
        }
        const projPoint = this.projectOnSegment(predictedPosition.x, predictedPosition.y, closestEdge.a.x, closestEdge.a.y, closestEdge.b.x, closestEdge.b.y);
        dx = projPoint.x - predictedPosition.x;
        dy = projPoint.y - predictedPosition.y;
        const distance = minDist;
        const signDx = Math.sign(dx) == 0 ? 1 : Math.sign(dx)
        let polarAngle = signDx * this.safeArccos(dy / distance);
        const angle1 = agent.angle;
        const polarAngleGrad = polarAngle * 180 / Math.PI;
        let angle = polarAngleGrad - angle1;
        if(isNaN(angle))
            angle = 0
        if(angle > 180)
            angle -= 360
        if(angle < -180)
            angle += 360
        return {"distance": distance, "angle": this.round5(angle), "trueBearing": this.round5(angle1+angle)};
    }

    safeArccos(value) {
        if(value > 1) value = 1;
        if(value < -1) value = -1;
        const acos = Math.acos(value);
        return acos;
    }

    round5(value) {
        return Math.round(value * 100000) / 100000;
    }

    round1(value) {
        return Math.round(value * 10) / 10;
    }
}

module.exports = utils;
