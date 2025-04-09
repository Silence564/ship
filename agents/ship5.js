module.exports = {
    "init": {
        "x": 2000, // м
        "y": -2000, // м
        "angle": 270, // градусов относительно оси y
        "v": 10, // метров в секунду
        "length": 250, // длина в метрах
        "color": "brown",
        "frequency": 1
    },
    "update": function (active, store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        //if(store.time >= 50 && store.time < 80 || store.time >= 110 && store.time < 160)
          //  store.angle += 1; // Поворачиваем в заданные интервалы времени
        active.main(store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
