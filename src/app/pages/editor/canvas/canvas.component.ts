import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FIGDocument} from "../../../models/document";

@Component({
  selector: 'fig-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit, OnDestroy {

  @ViewChild('imgui')
  canvas!: ElementRef;

  private isRendering: boolean = true;
  private isResizing: boolean = false;
  private lastFrame: any;

  private document!: FIGDocument;

  constructor(private readonly el: ElementRef) {
  }

  @Input('document')
  set _document(value: FIGDocument) {
    this.document = value;
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

  async ngOnInit(): Promise<void> {
    await ImGui.default();

    ImGui.CreateContext();
    const io = ImGui.GetIO();

    ImGui.StyleColorsDark();
    io.Fonts.AddFontDefault();
    ImGui_Impl.Init(this.$canvas);
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resize();
  }

  ngOnDestroy(): void {
    this.isRendering = false;
    ImGui_Impl.Shutdown();
    ImGui.DestroyContext();
  }

  private resize(): void {
    const devicePixelRatio = window.devicePixelRatio || 1.0;

    this.$canvas.width = this.$host.clientWidth * devicePixelRatio;
    this.$canvas.height = this.$host.clientHeight * devicePixelRatio;
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
      return;
    }
    window.requestAnimationFrame(this.render.bind(this));
  }

}
