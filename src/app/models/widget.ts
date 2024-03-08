import {v4 as uuidv4} from "uuid";

export enum FIGWidgetType {
  window,
  text,
  button
}

export abstract class FIGWidget {

  public readonly uuid: string;

  protected constructor(public readonly type: FIGWidgetType,
                        public readonly icon: string) {
    this.uuid = uuidv4();
  }

  public abstract get name(): string;

  public abstract render(): void;
}
