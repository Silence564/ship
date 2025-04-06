const assert = require("assert");
const utils = require("../rti/utils");

let a1 = {x:0, y:0, v:1, angle:0}
let a2 = {x:0, y:1, v:1, angle:0}
assert.ok(utils.observation(a1, a2).angle == 0)
assert.ok(utils.observation(a2, a1).angle == 180)
assert.ok(utils.observation(a1, a2).distance == 1)
assert.ok(utils.observation(a2, a1).distance == 1)

a2.angle = 90
assert.ok(utils.observation(a1, a2).angle == 0)
assert.ok(utils.observation(a2, a1).angle == 90)

a2.angle = 180
assert.ok(utils.observation(a1, a2).angle == 0)
assert.ok(utils.observation(a2, a1).angle == 0)

a2.angle = 270
assert.ok(utils.observation(a1, a2).angle == 0)
assert.ok(utils.observation(a2, a1).angle == -90)

a2 = {x:1, y:0, v:1, angle:0}
assert.ok(utils.observation(a1, a2).angle == 90)
assert.ok(utils.observation(a2, a1).angle == -90)
assert.ok(utils.observation(a1, a2).distance == 1)
assert.ok(utils.observation(a2, a1).distance == 1)

a2.angle = 90
assert.ok(utils.observation(a1, a2).angle == 90)
assert.ok(utils.observation(a2, a1).angle == -180)

a2.angle = 180
assert.ok(utils.observation(a1, a2).angle == 90)
assert.ok(utils.observation(a2, a1).angle == 90)

a2.angle = 270
assert.ok(utils.observation(a1, a2).angle == 90)
assert.ok(utils.observation(a2, a1).angle == 0)

a2 = {x:0, y:-1, v:1, angle:0}
assert.ok(utils.observation(a1, a2).angle == 180)
assert.ok(utils.observation(a2, a1).angle == 0)
assert.ok(utils.observation(a1, a2).distance == 1)
assert.ok(utils.observation(a2, a1).distance == 1)

a2.angle = 90
assert.ok(utils.observation(a1, a2).angle == 180)
assert.ok(utils.observation(a2, a1).angle == -90)

a2.angle = 180
assert.ok(utils.observation(a1, a2).angle == 180)
assert.ok(utils.observation(a2, a1).angle == -180)

a2.angle = 270
assert.ok(utils.observation(a1, a2).angle == 180)
assert.ok(utils.observation(a2, a1).angle == 90)

a2 = {x:-1, y:0, v:1, angle:0}
assert.ok(utils.observation(a1, a2).angle == -90)
assert.ok(utils.observation(a2, a1).angle == 90)
assert.ok(utils.observation(a1, a2).distance == 1)
assert.ok(utils.observation(a2, a1).distance == 1)

a2.angle = 90
assert.ok(utils.observation(a1, a2).angle == -90)
assert.ok(utils.observation(a2, a1).angle == 0)

a2.angle = 180
assert.ok(utils.observation(a1, a2).angle == -90)
assert.ok(utils.observation(a2, a1).angle == -90)

a2.angle = 270
assert.ok(utils.observation(a1, a2).angle == -90)
assert.ok(utils.observation(a2, a1).angle == -180)

a2 = {x:1, y:1, v:1, angle:0}
assert.ok(utils.observation(a1, a2).angle == 45)
assert.ok(utils.observation(a2, a1).angle == -135)

a2.angle = 90
assert.ok(utils.observation(a1, a2).angle == 45)
assert.ok(utils.observation(a2, a1).angle == 135)

assert.ok(utils.observation(a1, a1).angle == 0)
assert.ok(utils.observation(a1, a1).distance == 0)
