module.exports = {
    "init": {
        "x": 0, // м
        "y": 0, // м
        "angle": 90, // градусов относительно оси y
        "v": 10, // метров в секунду 10
        "length": 150, // длина в метрах
        "color": "blue",
        "frequency": 1
    },
    "update": function (active, store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        active.main(store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
