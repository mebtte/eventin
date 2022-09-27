export type Listener<
  EventType extends string,
  EventTypeMapData extends {
    [key in EventType]: unknown;
  },
  E extends EventType
> = (data: EventTypeMapData[E]) => void;
