const dummy = require('../utils/list_helper').dummy

test('dummy returns one', () => {
  expect(dummy([])).toBe(1)
})