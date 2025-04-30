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
    "update": function (active, store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        active.main(store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}
