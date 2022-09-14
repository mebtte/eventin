# eventin [![version](https://img.shields.io/npm/v/eventin)](https://www.npmjs.com/package/eventin) [![license](https://img.shields.io/npm/l/eventin)](https://github.com/mebtte/react-lrc/blob/master/LICENSE) [![](https://img.shields.io/bundlephobia/minzip/eventin)](https://bundlephobia.com/result?p=eventin)

Type-constrainted event emitter.

## Install & Usage

```sh
npm install eventin
```

```ts
import Eventin from 'eventin';

enum EventType {
  OPEN = 'open',
  CLOSE = 'close',
  TOGGLE = 'toggle',
}

const e = new Eventin<
  EventType,
  {
    [EventType.OPEN]: { id: string };
    [EventType.CLOSE]: { source: number };
    [EventType.TOGGLE]: boolean;
  }
>();

const unlisten = e.listen(EventType.OPEN, ({ id }) => console.log(id));
const unlisten = e.listen(EventType.OPEN, ({ source }) => console.log(source)); // it will throw typescript error

e.emit(EventType.OPEN, { id: 'eventin' });
e.emit(EventType.OPEN, 123); // it will throw typescript error

/** listen once */
const unlisten = e.listen(EventType.OPEN, ({ id }) => console.log(id), {
  once: true,
});

/** trigger listener synchronously */
e.emit(EventType.OPEN, { id: 'eventin' }, { sync: true });

/** unlistenAll */
e.unlistenAll(EventType.OPEN);
e.unlistenAll();
```

## License

[MIT](./LICENSE)
