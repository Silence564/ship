module.exports = {
    "init": {
        "x": -2000, // м
        "y": 0, // м
        "angle": 160, // градусов относительно оси y
        "v": 7, // метров в секунду
        "length": 200, // длина в метрах
        "color": "pink",
        "frequency": 1
    },
    "update": function (active, store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        //if(store.time >= 50 && store.time < 80 || store.time >= 110 && store.time < 160)
          //  store.angle += 1; // Поворачиваем в заданные интервалы времени
        active.main(store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
