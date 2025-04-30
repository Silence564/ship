const assert = require("assert");
const RotateStrategy_R = require('../strategy/rotate_strategy_R');
const RotateStrategy_L = require('../strategy/rotate_strategy_L');
const Agent = require('../strategy/agent');
const BrakeStrategy = require('../strategy/brake_strategy');
const LinearMovementStrategy = require('../strategy/linear_movement_strategy');
const Utils = require('../rti/utils');
const RTI = require('../rti/index');
const Decision = require('../rti/decision');
const Maneuvering = require('../rti/maneuvering');
const Active = require('../rti/active');
  
describe('Decision', () => { //для проверки компонента desicion
  let decision;
  let rti;
  beforeEach(() => {
    decision = new Decision();
    rti = new RTI();
  });

  it('should make correct decisions', () => {
    const agent1 = { v: 10, angle: 90 };
    const obs = { v: 5, course: 90 };
    const agent2 = { v: 5, angle: 90 };

    const agent11 = { v: 15, angle: 50};
    const obs1 = { v: 10, course: 50};
    const agent21 = { v: 10, angle: 50};

    const agent12 = { v: 10, angle: 0, length: 50 };
    const obs2 = { v: 15, course: 180 };
    const agent22 = { v: 15, length: 100 };

    const agent13 = { v: 10, angle: 0 };
    const obs3 = { v: 10 };
    const agent23 = { v: 10 };

    assert.equal(decision.purpose(agent11, obs1, agent21), 0);
    assert.equal(decision.purpose(agent13, obs3, agent23), 2);
    assert.equal(decision.purpose(agent12, obs2, agent22), 3);
    assert.equal(decision.purpose(agent1, obs, agent2), 0);
  });
  it('should choose avoidance action when encountering static object', () => {
      const agent1 = {v:10, angle: 0};
      const obs = {v: 0};
      const agent2 = {v: 0};
      const result1 = decision.purpose(agent1, obs, agent2)
      assert.equal(result1, 4);
  });

});

describe('Maneuvering', () => {
    it('should detect unsafe zone violation', () => {
        const maneuvering = new Maneuvering();
        const data = { distance: 500, trueBearing: 95, angle: 80 };
        const result = maneuvering.controle_check_line(data, 'Ship A', 'Reef Zone');
        assert.equal(result, 0); 
    });
      
    it('should allow safe passage outside dangerous area', () => {
        const maneuvering = new Maneuvering();
        const data = { distance: 1500 }; 
        const result = maneuvering.controle_check_line(data, 'Ship A', 'Reef Zone');
        assert.equal(result, 1); 
    });
    it('should prevent intrusion into safety zone', () => {
        const maneuvering = new Maneuvering();
        const data = { distance: 500,  name: 'Ship B'  }; 
        const result = maneuvering.controle_check(data, 'Ship A');
        assert.equal(result, 0); 
      });
    it('should allow safe operation beyond threshold', () => {
        const maneuvering = new Maneuvering();
        const data = { distance: 1500, name: 'Ship B' }; 
        const result = maneuvering.controle_check(data, 'Ship A');
        assert.equal(result, 1); 
    });

      it('should compute positive velocity difference for same-direction approach', () => {
        const maneuvering = new Maneuvering();
        const agent = { v: 10 };
        const obs = { v: 5 };
        const vel = maneuvering.relativeVelocity(0, agent, obs);
        assert(vel > 0); 
      });
      
      it('should consider different scenarios for relative velocities', () => {
        const maneuvering = new Maneuvering();
        const agent = { v: 10 };
        const obs = { v: 15 };
        const velParallel = maneuvering.relativeVelocity(0, agent, obs); 
        const velOpposite = maneuvering.relativeVelocity(1, agent, obs); 
        assert(velParallel > velOpposite); 
      });
});
describe('Testing Relative Course Calculation', () => {
  it('should calculate relative course correctly', () => {
    const maneuvering = new Maneuvering();
    const agent1 = { x: 100, y: 100, v: 10, angle: 0 };
    const agent2 = { x: 200, y: 200, v: 15, angle: 90, name: 'agent2' };
    const obs = { distance: 150 };
    const Bearing = [['agent2', {'0': 89, '1': 90, '2': 100}],['agent3', {'0': 150, '1': 100, '2': 90}]];
    const Distance = [['agent2', {'0': 150, '1': 100, '2': 90}], ['agent3', {'0': 150, '1': 100, '2': 90}]];

    const result = maneuvering.relativeCourse(agent1, agent2, obs, Bearing, Distance);
    assert.equal(result[1], 0); 
    assert(Number.isFinite(result[0])); // Курсовая величина должна быть числом
  });
  it('should handle extremely large values', () => {
    const maneuvering = new Maneuvering();
    const agent1 = { x: 100, y: 100, v: 10, angle: 0 };
    const agent2 = { x: 200, y: 200, v: 15, angle: 90, name: 'agent2' };
    const obs = { distance: Infinity };
    const Bearing = [['agent2', {'0': Infinity, '1': Infinity, '2': Infinity}],['agent3', {'0': 150, '1': 100, '2': 90}]];
    const Distance = [['agent2', {'0': Infinity, '1': Infinity, '2': Infinity}], ['agent3', {'0': 150, '1': 100, '2': 90}]];
  
    const result = maneuvering.relativeCourse(agent1, agent2, obs, Bearing, Distance);
  
    assert.equal(result[1], 0); 
    assert(Number.isNaN(result[0])); // При бесконечности возникает NaN
  });
  it('should compute relative course fully with non-zero inputs', () => {
    const maneuvering = new Maneuvering();
    const agent1 = { x: 100, y: 100, v: 10, angle: 0 };
    const agent2 = { x: 200, y: 200, v: 15, angle: 90, name: 'agent2' };
    const obs = { distance: 150 };
    const Bearing = [['agent2', {'0': 89, '1': 90, '2': 100}],['agent3', {'0': 150, '1': 100, '2': 90}]];
    const Distance = [['agent2', {'0': 150, '1': 100, '2': 90}], ['agent3', {'0': 150, '1': 100, '2': 90}]];
    const result = maneuvering.relativeCourse(agent1, agent2, obs, Bearing, Distance);

    assert.equal(result[1], 0); 
    assert(Math.abs(result[0]) < 180); // Значение угла в правильном диапазоне
  });
  it('should compute relative course exactly with another dataset', () => {
    const maneuvering = new Maneuvering();
    const agent1 = { x: 100, y: 100, v: 10, angle: 0 };
    const agent2 = { x: 200, y: 200, v: 15, angle: 90, name: 'agent2' };
    const obs = { distance: 150 };
    const Bearing = [['agent2', {'0': 89, '1': 100, '2': 110}],['agent3', {'0': 150, '1': 100, '2': 90}]];
    const Distance = [['agent2', {'0': 150, '1': 100, '2': 90}], ['agent3', {'0': 150, '1': 100, '2': 90}]];

    const result = maneuvering.relativeCourse(agent1, agent2, obs, Bearing, Distance);

    // teta = 100 - 110 = -10
    // m = 100 / 90 = 1.11
    // up = 1.1 * sin(-10) ≈ 0.594
    // down = 1 - 1.1 * cos(-10) ≈ 1.913 , считаем в радианах
    // p_0 = atan(0.594/1.913) × 180/π ≈ 17.3
    // relativeCourse = 89 - 17.3 = 71.7

    // Проверка индекса
    assert.equal(result[1], 0);
    // Проверка курса с погрешностью
    assert(Math.abs(result[0] - 71.7) < 0.1); // допускаем небольшую погрешность около 0.1 градуса
  });
});
describe('Critical Angle Calculation', () => {
    const maneuvering = new Maneuvering();
    it('should calculate minimum safe angle considering speed differences', () => {
      const agent1 = { v: 10, relativeCourse: 6, trueBearing: 90, course: 270 };
      const agent2 = { v: 15, relativeCourse: 6, trueBearing: 90, course: 90 };
      let critAngle = maneuvering.criticalAngle(agent1, agent2);
      assert(critAngle > 0); // Угол положительный
  
      // угол увеличивается при большей разнице скоростей
      const agentFast = { v: 20, relativeCourse: 0, trueBearing: 90, course: 150 };
      let fastCritAngle = maneuvering.criticalAngle(agent1, agentFast);
      assert(fastCritAngle < critAngle); 
  
      // Случай равных скоростей
      const equalSpeedAgent = { v: 10, relativeCourse: 6, trueBearing: 90, course: 90 };
      let equalCritAngle = maneuvering.criticalAngle(agent1, equalSpeedAgent);
      assert(equalCritAngle == 90);
  
      // Крайний случай: малая скорость
      const lowSpeedAgent = { v: 9, relativeCourse: 6, trueBearing: 90, course: 90 };
      let lowCritAngle = maneuvering.criticalAngle(agent1, lowSpeedAgent);
      assert(lowCritAngle < critAngle/2);
  
      // Противоположные направления
      const oppositeDirectionAgent = { v: 15, relativeCourse: 6, trueBearing: 270, course: 270 };
      let oppCritAngle = maneuvering.criticalAngle(agent2, oppositeDirectionAgent);
      assert(oppCritAngle > critAngle); // При противоположных направлениях угол больше
  
      // Проверка на особые случаи: одинаковые курсы
      const sameCourseAgent = { v: 15, relativeCourse: 6, trueBearing: 270, course:90};
      let sameCourseCritAngle = maneuvering.criticalAngle(agent1, sameCourseAgent);

      assert(sameCourseCritAngle > 0);
  
      // Большой угол расхождения курсов
      const bigDifferenceCourseAgent = { v: 15, relativeCourse: 6, trueBearing: 180, course: 0 };
      let bigDiffCritAngle = maneuvering.criticalAngle(agent1, bigDifferenceCourseAgent);
      assert(bigDiffCritAngle >= critAngle);
});
});

describe('Testing CourseNew Functionality', () => {
    const maneuvering = new Maneuvering();
  
    it('should generate alternative routes in hazardous areas', () => {
      const agent = { x: 100, y: 100, v: 10, angle: 0 };
      const env = { angle: 45, distance: 500 };
      const alternatives = maneuvering.CourseNew(agent, env);
      assert(Array.isArray(alternatives)); 
      assert(alternatives.length > 0); 
    });
  
    it('should select optimal alternative route', () => {
      const agent = { x: 100, y: 100, v: 10, angle: 0 };
      const env = { angle: 45, distance: 500 };
      const alternatives = maneuvering.CourseNew(agent, env);
      const optimalCourse = alternatives.find(course =>
        Math.abs(course - agent.angle) === Math.min(...alternatives.map(course => Math.abs(course - agent.angle))));
      assert(optimalCourse !== agent.angle); 
      const deviations = alternatives.map(course => Math.abs(course - agent.angle));
      assert(deviations.includes(Math.min(...deviations))); 
    });
  });

  describe('Utils: distanceToPolygonANDangle', () => {
    const utils = new Utils();
  
    it('should correctly calculate distance and angle to a simple rectangular polygon', () => {
      const agent = { x: 100, y: 100, angle: 0 };
      const polygon = [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 200 },
        { x: 0, y: 200 }
      ];
  
      const result = utils.distanceToPolygonANDangle(agent, polygon);
  
      assert(typeof result.distance === 'number');
      assert(result.distance > 0); // Расстояние положительно
      assert(typeof result.angle === 'number');
      assert(result.angle >= -180 && result.angle <= 180); // Угол корректен
    });
    it('should calculate exact distance and angle to a simple rectangular polygon - 1', () => {
      const utils = new Utils();
      const agent = { x: 100, y: 100, angle: 0 };
      const polygon = [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 200, y: 200 },
        { x: 0, y: 200 }
      ];
  
      const result = utils.distanceToPolygonANDangle(agent, polygon);
      // Проверка точного расстояния
      assert.equal(result.distance, 100); 
  
      // Проверка точного угла
      assert.equal(result.angle, -180); 
    });
  });

