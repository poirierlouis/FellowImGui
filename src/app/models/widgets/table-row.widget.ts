import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FIGTableWidget} from "./table.widget";
import {FIGTableColumnWidget} from "./table-column.widget";

export enum FIGTableRowFlags {
  Headers = 1
}

export interface FIGTableRowOptions {
}

export class FIGTableRowWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
  ];

  constructor(options?: FIGTableRowOptions) {
    super(FIGWidgetType.tableRow, true);
  }

  public get name(): string {
    return 'Table Row';
  }

  public override isChildAccepted(type: FIGWidgetType): boolean {
    return type === FIGWidgetType.tableColumn;
  }

  public override onCreated(): void {
    super.onCreated();
    const table: FIGTableWidget = this.parent as FIGTableWidget;

    for (let i: number = 0; i < table.columns; i++) {
      const column: FIGTableColumnWidget = new FIGTableColumnWidget();

      this.children.push(column);
      column.parent = this;
    }
  }

  public override draw(): void {
    ImGui.TableNextRow();
    for (const tableColumn of this.children) {
      tableColumn.draw();
      this.growFocusRect();
    }
    super.drawFocus();
  }
}
