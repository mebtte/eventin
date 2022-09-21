import Eventin from '.';

enum EventType {
  OPEN = 'open',
}
type EventTypeMapData = {
  [EventType.OPEN]: { id: string };
};

test('listen and emit', () => {
  const e = new Eventin<EventType, EventTypeMapData>();
  const id = 'eventin';

  return new Promise((resolve) => {
    e.listen(EventType.OPEN, (data) => resolve(data));

    setTimeout(() => e.emit(EventType.OPEN, { id }), 0);
  }).then((data) => expect(data).toEqual({ id }));
});

test('emit synchronously', () => {
  const e = new Eventin<EventType, EventTypeMapData>();
  const id = 'eventin';
  let receivedData: { id: string } | null = null;

  e.listen(EventType.OPEN, (data) => {
    receivedData = data;
  });
  e.emit(EventType.OPEN, { id }, { sync: true });

  expect(receivedData).toEqual({ id });
});

describe('unlisten', () => {
  test('unlisten by return value', () => {
    const e = new Eventin<EventType, EventTypeMapData>();
    const id = 'eventin';

    return Promise.race([
      new Promise((resolve) => {
        const unlisten = e.listen(EventType.OPEN, (data) => resolve(data));
        unlisten();

        setTimeout(() => e.emit(EventType.OPEN, { id }), 0);
      }),
      new Promise((resolve) => setTimeout(() => resolve(id), 1000)),
    ]).then((data) => expect(data).toBe(id));
  });
  test('unlisten by class method', () => {
    const e = new Eventin<EventType, EventTypeMapData>();
    const id = 'eventin';

    return Promise.race([
      new Promise((resolve) => {
        const listener = (data) => resolve(data);
        e.listen(EventType.OPEN, listener);
        e.unlisten(EventType.OPEN, listener);

        setTimeout(() => e.emit(EventType.OPEN, { id }), 0);
      }),
      new Promise((resolve) => setTimeout(() => resolve(id), 1000)),
    ]).then((data) => expect(data).toBe(id));
  });
});

test('unlistenAll', () => {
  const e = new Eventin<EventType, EventTypeMapData>();
  const id = 'eventin';

  return Promise.race([
    new Promise((resolve) => {
      e.listen(EventType.OPEN, (data) => resolve(expect(data).toEqual({ id })));
      e.unlistenAll();

      setTimeout(() => e.emit(EventType.OPEN, { id }), 0);
    }),
    new Promise((resolve) => setTimeout(() => resolve(id), 1000)),
  ]).then((data) => expect(data).toBe(id));
});

test('unlistenAll with event type', () => {
  const e = new Eventin<EventType, EventTypeMapData>();
  const id = 'eventin';

  return Promise.race([
    new Promise((resolve) => {
      e.listen(EventType.OPEN, (data) => resolve(expect(data).toEqual({ id })));
      e.unlistenAll(EventType.OPEN);

      setTimeout(() => e.emit(EventType.OPEN, { id }), 0);
    }),
    new Promise((resolve) => setTimeout(() => resolve(id), 1000)),
  ]).then((data) => expect(data).toBe(id));
});
