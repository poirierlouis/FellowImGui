import {FIGWidget, FIGWidgetType} from "./widget";

export interface FIGBulletOptions {
}

export class FIGBulletWidget extends FIGWidget {

  constructor(options?: FIGBulletOptions) {
    super(FIGWidgetType.bullet, true);
  }

  public get name(): string {
    return 'Bullet';
  }

  public override draw(): void {
    ImGui.Bullet();
    this.drawFocus();
    this.scrollTo();
  }
}
