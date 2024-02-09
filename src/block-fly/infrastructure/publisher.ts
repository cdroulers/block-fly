import { EventType } from "./events";

class Publisher {
  private listeners: { [key: string]: ((event: any) => void)[] } = {};

  public subscribe(eventType: EventType, callback: (event: any) => void): void {
    const type = EventType[eventType];

    const listenerList = this.listeners[type] || [];
    listenerList.push(callback);

    this.listeners[type] = listenerList;
  }

  public publish(eventType: EventType, event: any): void {
    const type = EventType[eventType];

    if (this.listeners[type]) {
      this.listeners[type].forEach((callback) => {
        callback(event);
      });
    }
  }
}

const publisher = new Publisher();

export default publisher;
