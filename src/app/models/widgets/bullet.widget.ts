import {FIGWidget, FIGWidgetType} from "./widget";

export type FIGBulletOptions = object

export class FIGBulletWidget extends FIGWidget {

  constructor(_options?: FIGBulletOptions) {
    super(FIGWidgetType.bullet, true);
  }

  public readonly name = 'Bullet';

  public override draw(): void {
    ImGui.Bullet();
    this.drawFocus();
    this.scrollTo();
  }
}
