# inheritable

[![CI](https://github.com/yjl9903/inheritable/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/inheritable/actions/workflows/ci.yml)

## Installation

```bash
npm i inheritable
```

## Usage

```ts
import { inherit } from 'inheritable'

const o1 = { a: 1 }
const o2 = inherit(o1, { b: 2 })

o1.a = 0
console.log(o2.a) // 0
```

## License

MIT License © 2025 [XLor](https://github.com/yjl9903)
