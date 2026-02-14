// [職責] 事件發布/訂閱引擎 (The Bus)
import type {
  SpaceEventName,
  SpaceEventHandler,
  PublishFn,
  SubscribeFn,
  SpaceEventPayloadMap,
} from "./space-events";

// A map where keys are event names (strings) and values are arrays of handler functions (Observers).
type HandlerRegistry = Map<
  SpaceEventName,
  SpaceEventHandler<any>[]
>;

/**
 * The Subject in the Observer pattern. It maintains a list of Observers (handlers)
 * and notifies them when an event occurs.
 */
export class SpaceEventBus {
  private handlers: HandlerRegistry;

  constructor() {
    this.handlers = new Map();
  }

  publish: PublishFn = <T extends SpaceEventName>(
    type: T,
    payload: SpaceEventPayloadMap[T]
  ) => {
    const eventHandlers = this.handlers.get(type);
    if (eventHandlers) {
      const handlersCopy = [...eventHandlers];
      handlersCopy.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error);
        }
      });
    }
  };

  emit: PublishFn = this.publish;

  subscribe: SubscribeFn = <T extends SpaceEventName>(
    type: T,
    handler: (payload: SpaceEventPayloadMap[T]) => void
  ) => {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }

    const handlerList = this.handlers.get(type)!;
    handlerList.push(handler);

    return () => {
      const index = handlerList.indexOf(handler);
      if (index > -1) {
        handlerList.splice(index, 1);
      }
    };
  };

  on: SubscribeFn = this.subscribe;
}
