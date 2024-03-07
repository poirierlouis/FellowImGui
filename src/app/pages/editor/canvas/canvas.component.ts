import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'fig-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit, OnDestroy {
  @Input()
  instructions: string = 'ImGui.Text("Hello world!")';

  @ViewChild('imgui')
  canvas!: ElementRef;

  private isRendering: boolean = true;

  constructor(private readonly el: ElementRef) {
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

  private render(delta: number): void {
    ImGui_Impl.NewFrame(delta);
    ImGui.NewFrame();

    ImGui.SetNextWindowPos(new ImGui.ImVec2(48, 48), ImGui.Cond.FirstUseEver);
    ImGui.SetNextWindowSize(new ImGui.ImVec2(480, 360), ImGui.Cond.FirstUseEver);
    ImGui.Begin('Fellow · ImGui');
    try {
      eval(this.instructions);
    } catch (e) {
      ImGui.TextColored(new ImGui.ImVec4(1.0, 0.0, 0.0, 1.0), "error: ");
      ImGui.SameLine();
      // @ts-ignore
      ImGui.Text(e.message);
    }
    ImGui.End();
    ImGui.EndFrame();
    ImGui.Render();
    const gl = ImGui_Impl.gl;
    const clearColor = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);

    gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl && gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
    gl && gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
    if (!this.isRendering) {
      return;
    }
    window.requestAnimationFrame(this.render.bind(this));
  }

}
