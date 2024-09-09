import {FIGFormField} from "../pages/editor/config/config.component";

export interface FIGSizes {
  // Main
  WindowPadding?: number[];
  FramePadding?: number[];
  CellPadding?: number[];
  ItemSpacing?: number[];
  ItemInnerSpacing?: number[];
  TouchExtraPadding?: number[];
  IndentSpacing?: number;
  ScrollbarSize?: number;
  GrabMinSize?: number;
  // Borders
  WindowBorderSize?: number;
  ChildBorderSize?: number;
  PopupBorderSize?: number;
  FrameBorderSize?: number;
  TabBorderSize?: number;
  // Rounding
  WindowRounding?: number;
  ChildRounding?: number;
  FrameRounding?: number;
  PopupRounding?: number;
  ScrollbarRounding?: number;
  GrabRounding?: number;
  LogSliderDeadzone?: number;
  TabRounding?: number;
  // Alignment
  WindowTitleAlign?: number[];
  WindowMenuButtonPosition?: number; // -1, 0, 1
  ColorButtonPosition?: number; // 0, 1
  ButtonTextAlign?: number[];
  SelectableTextAlign?: number[];
  DisplaySafeAreaPadding?: number[];

  [key: string]: number | number[] | undefined;
}

export const FIGSizesSerializers: FIGFormField[] = [
  // Main
  {name: 'WindowPadding', type: 'array', optional: true, default: [8, 8], min: 0, max: 20, step: 1},
  {name: 'FramePadding', type: 'array', optional: true, default: [4, 3], min: 0, max: 20, step: 1},
  {name: 'CellPadding', type: 'array', optional: true, default: [4, 2], min: 0, max: 20, step: 1},
  {name: 'ItemSpacing', type: 'array', optional: true, default: [8, 4], min: 0, max: 20, step: 1},
  {name: 'ItemInnerSpacing', type: 'array', optional: true, default: [4, 4], min: 0, max: 20, step: 1},
  {name: 'TouchExtraPadding', type: 'array', optional: true, default: [0, 0], min: 0, max: 10, step: 1},
  {name: 'IndentSpacing', optional: true, default: 21, min: 0, max: 30, step: 1},
  {name: 'ScrollbarSize', optional: true, default: 14, min: 1, max: 20, step: 1},
  {name: 'GrabMinSize', optional: true, default: 10, min: 1, max: 20, step: 1},

  // Borders
  {name: 'WindowBorderSize', optional: true, default: 1, min: 0, max: 1, step: 1},
  {name: 'ChildBorderSize', optional: true, default: 1, min: 0, max: 1, step: 1},
  {name: 'PopupBorderSize', optional: true, default: 1, min: 0, max: 1, step: 1},
  {name: 'FrameBorderSize', optional: true, default: 0, min: 0, max: 1, step: 1},
  {name: 'TabBorderSize', optional: true, default: 0, min: 0, max: 1, step: 1},

  // Rounding
  {name: 'WindowRounding', optional: true, default: 0, min: 0, max: 12, step: 1},
  {name: 'ChildRounding', optional: true, default: 0, min: 0, max: 12, step: 1},
  {name: 'FrameRounding', optional: true, default: 0, min: 0, max: 12, step: 1},
  {name: 'PopupRounding', optional: true, default: 0, min: 0, max: 12, step: 1},
  {name: 'ScrollbarRounding', optional: true, default: 9, min: 0, max: 12, step: 1},
  {name: 'GrabRounding', optional: true, default: 0, min: 0, max: 12, step: 1},
  {name: 'LogSliderDeadzone', optional: true, default: 4, min: 0, max: 12, step: 1},
  {name: 'TabRounding', optional: true, default: 4, min: 0, max: 12, step: 1},

  // Alignment
  {name: 'WindowTitleAlign', type: 'array', optional: true, default: [0, 0.5], min: 0.0, max: 1.0, step: 0.01},
  {
    name: 'WindowMenuButtonPosition',
    optional: true,
    default: 0,
    fieldType: 'select',
    options: [{label: 'None', value: -1}, {label: 'Left', value: 0}, {label: 'Right', value: 1}]
  },
  {
    name: 'ColorButtonPosition',
    optional: true,
    default: 1,
    fieldType: 'select',
    options: [{label: 'Left', value: 0}, {label: 'Right', value: 1}]
  },
  {name: 'ButtonTextAlign', type: 'array', optional: true, default: [0.5, 0.5], min: 0.0, max: 1.0, step: 0.01},
  {name: 'SelectableTextAlign', type: 'array', optional: true, default: [0, 0], min: 0.0, max: 1.0, step: 0.01},
  {name: 'DisplaySafeAreaPadding', type: 'array', optional: true, default: [3, 3], min: 0, max: 30, step: 1}
];
