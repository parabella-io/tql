import { describe, test, expect } from 'vitest';

import { selectFields } from '../../src/query/select-fields.js';

describe('selectFields', () => {
  test('should select only explicit fields and implicit id', () => {
    const data = {
      id: '1',
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
      hobbies: [
        { name: 'Reading', level: 1 },
        { name: 'Writing', level: 2 },
      ],
    };
    const select = {
      name: true,
      hobbies: true,
    };
    const result = selectFields(data, select);
    expect(result).toEqual({
      id: '1',
      name: 'John Doe',
      hobbies: [
        { name: 'Reading', level: 1 },
        { name: 'Writing', level: 2 },
      ],
    });
  });

  test('should select nested object fields', () => {
    const data = {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
      },
    };

    const select = {
      name: true,
      address: {
        street: true,
        state: true,
      },
    };

    expect(selectFields(data, select)).toEqual({
      name: 'John Doe',
      address: {
        street: '123 Main St',
        state: 'CA',
      },
    });
  });

  test('should select nested fields inside an array of objects', () => {
    const data = {
      hobbies: [
        { name: 'Reading', level: 1, meta: { years: 2 } },
        { name: 'Writing', level: 2, meta: { years: 5 } },
      ],
    };

    const select = {
      hobbies: {
        name: true,
        meta: { years: true },
      },
    };

    expect(selectFields(data, select)).toEqual({
      hobbies: [
        { name: 'Reading', meta: { years: 2 } },
        { name: 'Writing', meta: { years: 5 } },
      ],
    });
  });

  test('should return full nested object/array when nested select is true', () => {
    const data = {
      address: { street: '123 Main St', city: 'Anytown' },
      hobbies: [{ name: 'Reading', level: 1 }],
    };

    const select = {
      address: true,
      hobbies: true,
    };

    expect(selectFields(data, select)).toEqual(data);
  });

  test('should should always return id even if not selected', () => {
    const data = {
      id: '1',
      address: { street: '123 Main St', city: 'Anytown' },
      hobbies: [{ name: 'Reading', level: 1 }],
    };

    const select = {
      address: true,
      hobbies: true,
    };

    expect(selectFields(data, select)).toEqual({
      ...data,
      id: '1',
    });
  });
});
