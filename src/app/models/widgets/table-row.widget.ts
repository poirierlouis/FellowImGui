import {FIGWidgetType} from "./widget";
import {FIGContainer} from "./container";
import {FIGSerializeProperty} from "../../parsers/document.parser";
import {FIGTableWidget} from "./table.widget";
import {FIGTableColumnWidget} from "./table-column.widget";
import {FIGTextWidget} from "./text.widget";

export enum FIGTableRowFlags {
  Headers = 1
}

export interface FIGTableRowOptions {
  readonly header?: boolean;
}

export class FIGTableRowWidget extends FIGContainer {
  public static readonly serializers: FIGSerializeProperty[] = [
    {name: 'header', optional: true, default: false}
  ];

  header: boolean;

  constructor(options?: FIGTableRowOptions) {
    super(FIGWidgetType.tableRow, true);
    this.header = options?.header ?? false;
  }

  public readonly name = 'Table Row';

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
    const columns: FIGTableColumnWidget[] = this.children.map((child) => child as FIGTableColumnWidget);

    if (this.header) {
      for (const column of columns) {
        const header: FIGTextWidget | undefined = column.findByType(FIGWidgetType.text);

        if (header) {
          ImGui.TableSetupColumn(header.text);
        }
      }
      ImGui.TableHeadersRow();
    } else {
      ImGui.TableNextRow();
      for (const column of columns) {
        column.draw();
        this.growFocusRect();
      }
    }
    this.drawFocus();
    this.scrollTo();
  }
}
