import {Color, ColorSerializers} from "./math";
import {FIGSerializeProperty} from "../parsers/document.parser";

export enum FIGCol {
  Text = 0,
  TextDisabled = 1,
  WindowBg = 2,
  ChildBg = 3,
  PopupBg = 4,
  Border = 5,
  BorderShadow = 6,
  FrameBg = 7,
  FrameBgHovered = 8,
  FrameBgActive = 9,
  TitleBg = 10,
  TitleBgActive = 11,
  TitleBgCollapsed = 12,
  MenuBarBg = 13,
  ScrollbarBg = 14,
  ScrollbarGrab = 15,
  ScrollbarGrabHovered = 16,
  ScrollbarGrabActive = 17,
  CheckMark = 18,
  SliderGrab = 19,
  SliderGrabActive = 20,
  Button = 21,
  ButtonHovered = 22,
  ButtonActive = 23,
  Header = 24,
  HeaderHovered = 25,
  HeaderActive = 26,
  Separator = 27,
  SeparatorHovered = 28,
  SeparatorActive = 29,
  ResizeGrip = 30,
  ResizeGripHovered = 31,
  ResizeGripActive = 32,
  Tab = 33,
  TabHovered = 34,
  TabActive = 35,
  TabUnfocused = 36,
  TabUnfocusedActive = 37,
  PlotLines = 38,
  PlotLinesHovered = 39,
  PlotHistogram = 40,
  PlotHistogramHovered = 41,
  TableHeaderBg = 42,
  TableBorderStrong = 43,
  TableBorderLight = 44,
  TableRowBg = 45,
  TableRowBgAlt = 46,
  TextSelectedBg = 47,
  DragDropTarget = 48,
  NavHighlight = 49,
  NavWindowingHighlight = 50,
  NavWindowingDimBg = 51,
  ModalWindowDimBg = 52
}

export interface FIGColors {
  Text?: Color;
  TextDisabled?: Color;
  WindowBg?: Color;
  ChildBg?: Color;
  PopupBg?: Color;
  Border?: Color;
  BorderShadow?: Color;
  FrameBg?: Color;
  FrameBgHovered?: Color;
  FrameBgActive?: Color;
  TitleBg?: Color;
  TitleBgActive?: Color;
  TitleBgCollapsed?: Color;
  MenuBarBg?: Color;
  ScrollbarBg?: Color;
  ScrollbarGrab?: Color;
  ScrollbarGrabHovered?: Color;
  ScrollbarGrabActive?: Color;
  CheckMark?: Color;
  SliderGrab?: Color;
  SliderGrabActive?: Color;
  Button?: Color;
  ButtonHovered?: Color;
  ButtonActive?: Color;
  Header?: Color;
  HeaderHovered?: Color;
  HeaderActive?: Color;
  Separator?: Color;
  SeparatorHovered?: Color;
  SeparatorActive?: Color;
  ResizeGrip?: Color;
  ResizeGripHovered?: Color;
  ResizeGripActive?: Color;
  Tab?: Color;
  TabHovered?: Color;
  TabActive?: Color;
  TabUnfocused?: Color;
  TabUnfocusedActive?: Color;
  PlotLines?: Color;
  PlotLinesHovered?: Color;
  PlotHistogram?: Color;
  PlotHistogramHovered?: Color;
  TableHeaderBg?: Color;
  TableBorderStrong?: Color;
  TableBorderLight?: Color;
  TableRowBg?: Color;
  TableRowBgAlt?: Color;
  TextSelectedBg?: Color;
  DragDropTarget?: Color;
  NavHighlight?: Color;
  NavWindowingHighlight?: Color;
  NavWindowingDimBg?: Color;
  ModalWindowDimBg?: Color;

  [key: string]: any;
}

export const FIGColorsSerializers: FIGSerializeProperty[] = [
  {name: 'Text', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TextDisabled', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'WindowBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ChildBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'PopupBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'Border', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'BorderShadow', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'FrameBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'FrameBgHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'FrameBgActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TitleBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TitleBgActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TitleBgCollapsed', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'MenuBarBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ScrollbarBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ScrollbarGrab', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ScrollbarGrabHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ScrollbarGrabActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'CheckMark', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'SliderGrab', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'SliderGrabActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'Button', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ButtonHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ButtonActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'Header', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'HeaderHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'HeaderActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'Separator', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'SeparatorHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'SeparatorActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ResizeGrip', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ResizeGripHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ResizeGripActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'Tab', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TabHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TabActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TabUnfocused', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TabUnfocusedActive', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'PlotLines', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'PlotLinesHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'PlotHistogram', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'PlotHistogramHovered', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TableHeaderBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TableBorderStrong', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TableBorderLight', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TableRowBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TableRowBgAlt', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'TextSelectedBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'DragDropTarget', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'NavHighlight', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'NavWindowingHighlight', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'NavWindowingDimBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers},
  {name: 'ModalWindowDimBg', optional: true, default: undefined, type: 'object', innerType: ColorSerializers}
];
