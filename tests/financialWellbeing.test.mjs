import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADVICE, BANDS, MAINTENANCE, OPTIONS, QUESTIONS, STRENGTHS,
  answerPoints, convertScore, evaluateSurvey, scoreBand,
} from '../src/components/home/financialWellbeing.mjs';

const favourable = () => Object.fromEntries(QUESTIONS.map((q) => [q.id, q.positive ? 0 : 4]));
const unfavourable = () => Object.fromEntries(QUESTIONS.map((q) => [q.id, q.positive ? 4 : 0]));

test('all ten official items are present; only 1, 2, 4 and 8 are positively scored', () => {
  assert.deepEqual(QUESTIONS.map((q) => q.id), [1,2,3,4,5,6,7,8,9,10]);
  assert.deepEqual(QUESTIONS.filter((q) => q.positive).map((q) => q.id), [1,2,4,8]);
  for (const q of QUESTIONS) {
    const scores = [0,1,2,3,4].map((index) => answerPoints(q, index));
    assert.deepEqual(scores, q.positive ? [4,3,2,1,0] : [0,1,2,3,4]);
  }
});

test('official worksheet anchor values across every age/mode column; no linear percentage', () => {
  const groups = [['18-61','self'], ['62+','self'], ['18-61','assisted'], ['62+','assisted']];
  for (const [raw, expected] of [[0,[14,14,16,18]], [12,[40,42,42,41]], [20,[50,53,52,50]], [39,[81,88,85,81]], [40,[86,95,91,87]]]) {
    assert.deepEqual(groups.map(([age, mode]) => convertScore(raw, age, mode)), expected);
  }
  assert.notEqual(convertScore(12, '18-61', 'self'), 12 / 40 * 100);
});

test('all 164 raw/group combinations are integers, strictly increasing per group, and within scale', () => {
  for (const age of ['18-61','62+']) for (const mode of ['self','assisted']) {
    let previous = -1;
    for (let raw = 0; raw <= 40; raw++) {
      const score = convertScore(raw, age, mode);
      assert.ok(Number.isInteger(score) && score > previous && score <= 100);
      previous = score;
    }
  }
});

test('extreme and middle profiles use ten answers rather than demographics as extra points', () => {
  assert.equal(evaluateSurvey(favourable(), '18-61', 'self').raw, 40);
  assert.equal(evaluateSurvey(unfavourable(), '18-61', 'self').raw, 0);
  const neutral = Object.fromEntries(QUESTIONS.map((q) => [q.id, 2]));
  assert.equal(evaluateSurvey(neutral, '18-61', 'self').score, 50);
  assert.equal(evaluateSurvey(neutral, '62+', 'assisted').raw, 20);
});

test('blank, partial and invalid response sets cannot produce a result', () => {
  for (const answers of [undefined, {}, {1:0}, {...favourable(), 10:undefined}, {...favourable(), 1:null}, {...favourable(), 2:'0'}, {...favourable(), 3:1.5}, {...favourable(), 4:-1}, {...favourable(), 5:5}, {...favourable(), 6:NaN}]) {
    assert.throws(() => evaluateSurvey(answers, '18-61', 'self'), RangeError);
  }
  for (const raw of [-1,41,2.5,NaN,'20',null]) assert.throws(() => convertScore(raw,'18-61','self'), RangeError);
  for (const [age, mode] of [['','self'], ['under18','self'], ['62+',''], ['18-61','other']]) {
    assert.throws(() => evaluateSurvey(favourable(), age, mode), RangeError);
  }
});

test('every score belongs to exactly one published CFPB range, including all boundaries', () => {
  for (let score = 0; score <= 100; score++) {
    const matching = BANDS.filter((band) => score >= band.min && score <= band.max);
    assert.equal(matching.length, 1);
    assert.equal(scoreBand(score), matching[0]);
  }
  assert.deepEqual([29,30,37,38,49,50,57,58,67,68].map((s) => scoreBand(s).en), ['Very low','Low','Low','Medium low','Medium low','Medium high','Medium high','High','High','Very high']);
  for (const invalid of [-1,101,NaN,2.2,null]) assert.throws(() => scoreBand(invalid), RangeError);
});

test('practical suggestions follow specific answers and urgent bill pressure comes first', () => {
  const answers = {...favourable(), 1:4, 7:0, 9:1};
  const result = evaluateSurvey(answers,'18-61','self');
  assert.deepEqual(result.priorities.map((p) => p.key), ['bills','buffer','occasions']);
  assert.deepEqual(result.priorities.map((p) => p.questionId), [9,1,7]);
  assert.equal(new Set(result.priorities.map((p) => p.key)).size, result.priorities.length);
  const improved = evaluateSurvey({...answers,9:4},'18-61','self');
  assert.ok(!improved.priorities.some((p) => p.key === 'bills'));
});

test('advice uses the weakest response in a topic; strong profiles get maintenance, not invented problems', () => {
  const result = evaluateSurvey({...favourable(), 6:0},'62+','assisted');
  assert.deepEqual(result.priorities.map((p) => [p.key,p.questionId]), [['buffer',6]]);
  assert.ok(!result.strengths.includes('buffer'));
  const good = evaluateSurvey(favourable(),'18-61','self');
  assert.deepEqual(good.priorities, []);
  assert.equal(good.strengths.length, 2);
  const bad = evaluateSurvey(unfavourable(),'18-61','self');
  assert.equal(bad.priorities.length,3);
  assert.deepEqual(bad.strengths, []);
});

test('both languages cover all choices, advice and strengths without mutating answers', () => {
  const answers = Object.freeze({...favourable(),1:4});
  const result = evaluateSurvey(answers,'18-61','self');
  for (const lang of ['vi','en']) {
    assert.equal(OPTIONS[lang].length,2);
    OPTIONS[lang].forEach((options) => assert.equal(options.length,5));
    QUESTIONS.forEach((q) => assert.ok(q[lang]?.length));
    result.priorities.forEach((p) => assert.equal(ADVICE[p.key][lang].length,2));
    result.strengths.forEach((key) => assert.ok(STRENGTHS[key][lang]));
    assert.equal(MAINTENANCE[lang].length,3);
  }
  assert.equal(answers[1],4);
});
