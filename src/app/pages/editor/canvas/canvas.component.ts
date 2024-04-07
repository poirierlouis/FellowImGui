import {Component, ElementRef, HostListener, Input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {FIGDocument} from "../../../models/document";
import {FIGFont, FIGFontDefaults, formatImGuiFontName} from "../../../models/document-fonts";
import {FIGSizes, FIGSizesSerializers, FIGThemeColors} from "../../../models/document-config";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'fig-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnDestroy {

  @ViewChild('imgui')
  canvas!: ElementRef;

  private isFirstLoad: boolean = true;
  private isRendering: boolean = false;
  private restart: boolean = false;

  private isResizing: boolean = false;
  private hasFocus: boolean = false;
  private lastFrame: any;

  private document!: FIGDocument;
  private fonts: FIGFont[] = FIGFontDefaults;

  private currentTheme?: FIGThemeColors;
  private currentFont?: string;

  constructor(private readonly el: ElementRef,
              private readonly toast: MatSnackBar,
              private readonly renderer: Renderer2) {
  }

  @Input('document')
  set _document(value: FIGDocument) {
    this.document = value;
    this.requestRestart();
  }

  @Input('isResizing')
  set _isResizing(value: boolean) {
    this.isResizing = value;
  }

  private get $host(): HTMLElement {
    return this.el.nativeElement;
  }

  private get $canvas(): HTMLCanvasElement {
    return this.canvas.nativeElement;
  }

  private get imguiFonts(): any[] {
    const io = ImGui.GetIO();
    const fonts: any[] = [];

    for (let i: number = 0; i < io.Fonts.Fonts.Size; i++) {
      const font: any = io.Fonts.Fonts[i];

      fonts.push(font);
    }
    return fonts;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resize();
  }

  @HostListener('mouseenter')
  onFocusEnter(): void {
    this.hasFocus = true;
  }

  @HostListener('mouseleave')
  onFocusLeave(): void {
    this.hasFocus = false;
  }

  ngOnDestroy(): void {
    this.isRendering = false;
  }

  public async updateConfig(): Promise<void> {
    this.updateThemeColors();
    this.updateStyles();
    await this.updateFont();
  }

  private updateThemeColors(): void {
    if (this.currentTheme === this.document.config.theme) {
      return;
    }
    if (this.document.config.theme === 'dark') {
      ImGui.StyleColorsDark();
    } else if (this.document.config.theme === 'light') {
      ImGui.StyleColorsLight();
    } else if (this.document.config.theme === 'classic') {
      ImGui.StyleColorsClassic();
    }
    this.currentTheme = this.document.config.theme;
  }

  private updateStyles(): void {
    const sizes: FIGSizes | undefined = this.document.config.sizes;
    const style: any = ImGui.GetStyle();

    for (const property of FIGSizesSerializers) {
      if (property.type === 'array' && sizes?.[property.name] !== undefined) {
        style[property.name].x = sizes![property.name][0];
        style[property.name].y = sizes![property.name][1];
      } else if (sizes?.[property.name] !== undefined) {
        style[property.name] = sizes![property.name];
      }
    }
  }

  private async updateFont(): Promise<void> {
    if (this.currentFont === this.document.config.font) {
      return;
    }
    const imguiFontName: string = this.document.config.font ?? formatImGuiFontName(FIGFontDefaults[0]);
    const imguiFont: any | undefined = this.imguiFonts.find((font: any) => font.GetDebugName() === imguiFontName);

    if (imguiFont) {
      const io = ImGui.GetIO();

      io.FontDefault = imguiFont;
      this.currentFont = this.document.config.font;
      return;
    }
    const font: FIGFont | undefined = this.document.findFontByName(imguiFontName);

    if (!font) {
      this.toast.open(`Could not find the font "${imguiFontName}".`);
      return;
    }
    this.toast.open('ImGui restarts to load a new font...');
    this.requestRestart();
  }

  private async loadFonts(): Promise<void> {
    const defaultFonts: FIGFont[] = this.fonts.slice(1).filter((font) => !font.buffer);
    const embeddedFonts: FIGFont[] = this.document.config.embeddedFonts;
    const io = ImGui.GetIO();

    io.Fonts.AddFontDefault();
    for (const font of defaultFonts) {
      await this.loadAssetFont(font);
    }
    for (const font of embeddedFonts) {
      this.loadEmbeddedFont(font);
    }
    io.Fonts.Build();
  }

  private async loadAssetFont(font: FIGFont): Promise<any> {
    const url: string = `./assets/fonts/${font.name}`;
    const config: any = new ImGui.FontConfig();

    config.Name = formatImGuiFontName(font);
    const response: Response = await fetch(url);
    const buffer: ArrayBuffer = await response.arrayBuffer();

    return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(buffer, font.size, config, null);
  }

  private loadEmbeddedFont(font: FIGFont): any {
    const config: any = new ImGui.FontConfig();

    config.Name = formatImGuiFontName(font);
    return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(font.buffer, font.size, config, null);
  }

  private resize(): void {
    const devicePixelRatio = window.devicePixelRatio || 1.0;

    this.$canvas.width = this.$host.clientWidth * devicePixelRatio;
    this.$canvas.height = this.$host.clientHeight * devicePixelRatio;
  }

  private async startImGui(): Promise<void> {
    if (this.isRendering) {
      return;
    }
    if (this.isFirstLoad) {
      await ImGui.default();
      this.isFirstLoad = false;
    }
    ImGui.CreateContext();
    await this.loadFonts();
    await this.updateConfig();
    ImGui_Impl.Init(this.$canvas);
    this.resize();
    this.isRendering = true;
    requestAnimationFrame(this.render.bind(this));
  }

  private stopImGui(): void {
    this.isRendering = false;
    ImGui_Impl.Shutdown();
    ImGui.DestroyContext();
  }

  private requestRestart(): void {
    this.restart = true;
    this.isRendering = false;
    this.currentTheme = undefined;
    this.currentFont = undefined;
    if (this.isFirstLoad) {
      this.restart = false;
      this.startImGui();
    }
  }

  private render(timestamp: number): void {
    let frame: any;

    if (!this.isResizing) {
      ImGui_Impl.NewFrame(timestamp);
      ImGui.NewFrame();
      try {
        for (const container of this.document.root) {
          container.draw();
        }
      } catch (e) {
        ImGui.TextColored(new ImGui.ImVec4(1.0, 0.0, 0.0, 1.0), "error: ");
        ImGui.SameLine();
        // @ts-ignore
        ImGui.Text(e.message);
      }
      ImGui.EndFrame();
      ImGui.Render();
      frame = ImGui.GetDrawData();
      this.lastFrame = frame;
    } else {
      frame = this.lastFrame;
    }
    const gl = ImGui_Impl.gl;
    const clearColor = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);

    gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl && gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    gl && gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
    ImGui_Impl.RenderDrawData(frame);
    if (!this.isRendering) {
      this.stopImGui();
      if (this.restart) {
        this.startImGui();
      }
      return;
    }
    if (!this.hasFocus && document.body.style.cursor !== 'default') {
      this.renderer.setStyle(document.body, 'cursor', 'default');
    }
    requestAnimationFrame(this.render.bind(this));
  }

}
