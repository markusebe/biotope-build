import test from 'ava';
import config from './../config';
import { pumpFromString } from './helpers/pump';
import uglifyTasks from './../pumps/uglify';

test('simple variable', t => {
  const input = 'var test = "123";';
  const expected = 'var test="123";';
  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('whitespace', t => {
  const input = 'var   test    =     true';
  const expected = 'var test=!0;';
  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('variables', t => {
  const input = 'var t = function(test) { console.log(test) };';
  const expected = 'var t=function(o){console.log(o)};';
  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('license comments', t => {
  const input = '/** @preserve Some comment */ var test = "foo";';
  const expected = '/** @preserve Some comment */var test="foo";';

  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('license multiline comments', t => {
  const input = '/** \n test \n @preserve Multiline comment\n */ var test = "foo";';
  const expected = '/** \n test \n @preserve Multiline comment\n */var test="foo";';

  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('removed comment 1', t => {
  const input = '/* normal comment */ var test = "foo";';
  const expected = 'var test="foo";';

  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('removed comment 2', t => {
  const input = '/*! important but removed comment */ var test = "foo";';
  const expected = 'var test="foo";';

  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump).then(output => {
    const contents = output.contents.toString();
    t.is(contents, expected, 'Sass compiled as expected');
  });
});

test('invalid code should fail', t => {
  const input = 'foo => bar';
  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump)
    .then(() => {
      t.fail();
    })
    .catch(() => {
      t.pass();
    });
});

test('es6 code should fail', t => {
  const input = 'const foo = 123;';
  const uglifyPump = uglifyTasks.defaultPump(config);

  return pumpFromString(input, 'style.scss', uglifyPump)
    .then(() => {
      t.fail();
    })
    .catch(() => {
      t.pass();
    });
});
