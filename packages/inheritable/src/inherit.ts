import type { Prettify } from './types';

import { isPrimitiveType } from './utils';

export function inherit<T extends {}, E extends {} = {}>(
  parent: T,
  child?: Prettify<T & E> | E
): Prettify<T & E> {
  if (isPrimitiveType(parent)) {
    if (arguments.length === 1) {
      // @ts-ignore
      return parent;
    } else {
      // @ts-ignore
      return child;
    }
  }

  const target = child ? child : Array.isArray(parent) ? [] : {};

  if (Array.isArray(parent)) {
    // @ts-ignore
    target.length = parent.length;
  }

  const proxy = new Proxy(target, {
    get(target, propKey, receiver) {
      if (Reflect.has(target, propKey)) {
        return Reflect.get(target, propKey, receiver);
      } else {
        const parentValue = Reflect.get(parent, propKey, receiver);
        if (isPrimitiveType(parentValue)) {
          return parentValue;
        } else {
          const inheritedValue = inherit(parentValue as any);
          // @ts-ignore
          target[propKey] = inheritedValue;
          return inheritedValue;
        }
      }
    },
    set(target, propKey, value, _receiver) {
      // @ts-ignore
      return (target[propKey] = value);
    },
    has(target, propKey) {
      if (Reflect.has(target, propKey)) {
        return true;
      } else {
        return Reflect.has(parent, propKey);
      }
    },
    ownKeys(target) {
      const keys1 = Reflect.ownKeys(target);
      const keys2 = Reflect.ownKeys(parent);
      const result = [...new Set([...keys1, ...keys2])];
      return result;
    },
    getOwnPropertyDescriptor(target, propKey) {
      if (Reflect.has(target, propKey)) {
        return Reflect.getOwnPropertyDescriptor(target, propKey);
      } else {
        return Reflect.getOwnPropertyDescriptor(parent, propKey);
      }
    }
  });

  return proxy as T & E;
}
