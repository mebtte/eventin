import getRandomString from './get_random_string';
import { Listener } from './constants';

interface ListenerItem<
  EventType extends string,
  EventTypeMapData extends {
    [key in EventType]: unknown;
  }
> {
  id: string;
  once: boolean;
  listener: Listener<EventType, EventTypeMapData, EventType>;
}

class Eventin<
  EventType extends string,
  EventTypeMapData extends {
    [key in EventType]: unknown;
  }
> {
  private eventTypeMapListeners: Map<
    string,
    ListenerItem<EventType, EventTypeMapData>[]
  >;

  constructor() {
    this.eventTypeMapListeners = new Map<
      string,
      ListenerItem<EventType, EventTypeMapData>[]
    >();
  }

  emit<E extends EventType>(
    eventType: E,
    data: EventTypeMapData[E],
    {
      sync = false,
    }: {
      sync?: boolean;
    } = {}
  ) {
    const execute = () => {
      const listeners = this.eventTypeMapListeners.get(eventType) || [];
      listeners.forEach(({ once, listener }) => {
        listener(data);
        if (once) {
          this.unlisten(eventType, listener, {
            once: true,
          });
        }
      });
    };
    if (sync) {
      execute();
    } else {
      Promise.resolve().then(() => execute());
    }
  }

  listen<E extends EventType>(
    eventType: E,
    listener: Listener<EventType, EventTypeMapData, E>,
    {
      once = false,
    }: {
      once?: boolean;
    } = {}
  ) {
    const listeners = [
      ...(this.eventTypeMapListeners.get(eventType) || []),
      {
        id: getRandomString(),
        once,
        listener,
      },
    ];
    this.eventTypeMapListeners.set(eventType, listeners);
    return () =>
      this.unlisten(eventType, listener, {
        once,
      });
  }

  unlisten<E extends EventType>(
    eventType: E,
    listener: Listener<EventType, EventTypeMapData, E>,
    {
      once = false,
    }: {
      once?: boolean;
    } = {}
  ) {
    const listeners = this.eventTypeMapListeners.get(eventType) || [];
    const hitListener = listeners.find(
      (l) => l.once === once && l.listener === listener
    );
    if (hitListener) {
      const filteredListeners = listeners.filter(
        (l) => l.id !== hitListener.id
      );
      this.eventTypeMapListeners.set(eventType, filteredListeners);
    }
  }

  unlistenAll<E extends EventType>(eventType?: E) {
    if (eventType) {
      this.eventTypeMapListeners.set(eventType, []);
    } else {
      this.eventTypeMapListeners = new Map<
        string,
        ListenerItem<EventType, EventTypeMapData>[]
      >();
    }
  }
}

export default Eventin;
