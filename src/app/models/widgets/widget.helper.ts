import {SizeField} from "../fields/size.field";
import {Size, Vector2} from "../math";

export class FIGWidgetHelper {

  public static computeSize(field: SizeField): Vector2 | undefined {
    if (!field.value) {
      return undefined;
    }
    const size: Size = {...field.value ?? {width: 0, height: 0}};

    if (field.acceptRelative && field.isPercentage) {
      const region: Vector2 = ImGui.GetContentRegionAvail();

      size.width *= region.x;
      size.height *= region.y;
    }
    // NOTE: currently use absolute values as a workaround...
    return {x: Math.abs(size.width), y: Math.abs(size.height)};
  }

}
