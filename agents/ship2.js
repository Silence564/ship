module.exports = {
    "init": {
        "x": 1050, // м 1050
        "y": -400, // м -400
        "angle": 330, // градусов относительно оси y 330
        "v": 8, // метров в секунду 8
        "length": 200, // длина в метрах
        "color": "black",
        "frequency": 1
    },
    "update": function (active, store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        //if(store.time >= 50 && store.time < 80 || store.time >= 110 && store.time < 160)
          //  store.angle += 1; // Поворачиваем в заданные интервалы времени
        active.main(store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
