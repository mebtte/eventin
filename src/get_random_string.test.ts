import getRandomString from './get_random_string';

test('get random string', () => {
  const output = getRandomString();
  expect(typeof output).toBe('string');
  expect(output.length).toBe(6);
});
