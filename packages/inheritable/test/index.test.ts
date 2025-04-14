import { describe, it, expect } from 'vitest';

import { inherit } from '../src/index';

describe('inherit', () => {
  it('chain', () => {
    const o1 = { a: 1 };
    const o2 = inherit(o1, {} as { b?: number });
    const o3 = inherit(o2, {} as { c?: number });
    const o4 = inherit(o3, {} as { d?: number });

    o2.b = 2;
    expect(o2.a).toMatchInlineSnapshot(`1`);
    expect(o2.b).toMatchInlineSnapshot(`2`);

    o1.a = 3;
    expect(o2.a).toMatchInlineSnapshot(`3`);

    o2.b = 4;
    expect(o2.b).toMatchInlineSnapshot(`4`);

    expect(Object.getOwnPropertyNames(o2)).toMatchInlineSnapshot(`
      [
        "b",
        "a",
      ]
    `);
    expect(Object.keys(o2)).toMatchInlineSnapshot(`
      [
        "b",
        "a",
      ]
    `);
    expect(o2).toMatchInlineSnapshot(`
      {
        "a": 3,
        "b": 4,
      }
    `);

    o3.c = 5;

    expect(o3).toMatchInlineSnapshot(`
      {
        "a": 3,
        "b": 4,
        "c": 5,
      }
    `);

    o4.d = 6;
    expect(o4).toMatchInlineSnapshot(`
      {
        "a": 3,
        "b": 4,
        "c": 5,
        "d": 6,
      }
    `);

    o1.a = 10;
    expect([o1, o2, o3, o4]).toMatchInlineSnapshot(`
      [
        {
          "a": 10,
        },
        {
          "a": 10,
          "b": 4,
        },
        {
          "a": 10,
          "b": 4,
          "c": 5,
        },
        {
          "a": 10,
          "b": 4,
          "c": 5,
          "d": 6,
        },
      ]
    `);

    delete o2.b;
    expect([o1, o2, o3, o4]).toMatchInlineSnapshot(`
      [
        {
          "a": 10,
        },
        {
          "a": 10,
        },
        {
          "a": 10,
          "c": 5,
        },
        {
          "a": 10,
          "c": 5,
          "d": 6,
        },
      ]
    `);
  });

  it('array', () => {
    const o1: [number, { a: number }] = [1, { a: 1 }];
    const o2 = inherit(o1);

    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        [
          1,
          {
            "a": 1,
          },
        ],
        [
          1,
          {
            "a": 1,
          },
        ],
      ]
    `);

    o1[0] = 2;
    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        [
          2,
          {
            "a": 1,
          },
        ],
        [
          2,
          {
            "a": 1,
          },
        ],
      ]
    `);

    o1[1].a = 3;
    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        [
          2,
          {
            "a": 3,
          },
        ],
        [
          2,
          {
            "a": 3,
          },
        ],
      ]
    `);

    o1.push(5);
    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        [
          2,
          {
            "a": 3,
          },
          5,
        ],
        [
          2,
          {
            "a": 3,
          },
        ],
      ]
    `);
  });

  it('nest object', () => {
    const o1 = { a: { b: { c: 1, d: [1] } } };
    const o2 = inherit(o1);

    o2.a.b.c = 2;
    o2.a.b.d.push(3);

    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        {
          "a": {
            "b": {
              "c": 1,
              "d": [
                1,
              ],
            },
          },
        },
        {
          "a": {
            "b": {
              "c": 2,
              "d": [
                1,
                3,
              ],
            },
          },
        },
      ]
    `);

    o1.a.b.c = 5;
    o1.a.b.d.push(4);
    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        {
          "a": {
            "b": {
              "c": 5,
              "d": [
                1,
                4,
              ],
            },
          },
        },
        {
          "a": {
            "b": {
              "c": 2,
              "d": [
                1,
                3,
              ],
            },
          },
        },
      ]
    `);

    // @ts-ignore
    o1.a.b.e = 5;
    expect([o1, o2]).toMatchInlineSnapshot(`
      [
        {
          "a": {
            "b": {
              "c": 5,
              "d": [
                1,
                4,
              ],
              "e": 5,
            },
          },
        },
        {
          "a": {
            "b": {
              "c": 2,
              "d": [
                1,
                3,
              ],
              "e": 5,
            },
          },
        },
      ]
    `);
  });

  it('child', () => {
    const o1 = { a: 1 };
    const o2 = inherit(o1, { b: 2 });

    o1.a = 0;
    expect(o2.a).toMatchInlineSnapshot(`0`);
    expect(o2.b).toMatchInlineSnapshot(`2`);
  });
});
