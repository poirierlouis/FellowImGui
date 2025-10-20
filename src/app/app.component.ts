import {NgOptimizedImage} from "@angular/common";
import {Component, inject, type OnInit} from "@angular/core";
import {MatIconButton} from "@angular/material/button";
import {MatChip} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatToolbar} from "@angular/material/toolbar";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterOutlet} from "@angular/router";
import {IconService} from "./services/icon.service";

@Component({
  selector: "fig-app",
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, MatTooltip, MatChip, NgOptimizedImage],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  private readonly iconService = inject(IconService);
  private readonly toast = inject(MatSnackBar);

  constructor() {
    this.iconService.load();
  }

  public ngOnInit(): void {
    this.toast.open(
      "FellowImGui is currently in alpha release. " + "You can report issues and enhancements on GitHub.",
      undefined,
      {duration: 5000},
    );
  }

  public openGitHub(): void {
    window.open("https://github.com/poirierlouis/FellowImGui", "_blank");
  }
}
