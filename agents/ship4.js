module.exports = {
    "init": {
        "x": 0, // м
        "y": -2000, // м
        "angle": 90, // градусов относительно оси y
        "v": 6, // метров в секунду
        "length": 200, // длина в метрах
        "color": "purple",
        "frequency": 1
    },
    "update": function (active, store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        //if(store.time >= 50 && store.time < 80 || store.time >= 110 && store.time < 160)
          //  store.angle += 1; // Поворачиваем в заданные интервалы времени
        active.main(store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
