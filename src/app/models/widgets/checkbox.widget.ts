import {FIGWidget, FIGWidgetType} from "./widget";

export class FIGCheckboxWidget extends FIGWidget {
  text: string;

  isChecked: boolean = false;

  constructor(text: string = 'Checkbox') {
    super(FIGWidgetType.checkbox, true, 'checkbox');
    this.text = text;
  }

  public get name(): string {
    return this.text;
  }

  public override draw(): void {
    const prevIsChecked: boolean = this.isChecked;

    ImGui.Checkbox(this.text, (_ = this.isChecked) => this.isChecked = _);
    super.draw();
    if (prevIsChecked !== this.isChecked) {
      this.updateSubject.next();
    }
  }
}
