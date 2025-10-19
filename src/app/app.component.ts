import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {IconService} from "./services/icon.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatChip} from "@angular/material/chips";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'fig-app',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, MatTooltip, MatChip, NgOptimizedImage],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private readonly iconService = inject(IconService);
  private readonly toast = inject(MatSnackBar);

  constructor() {
    this.iconService.load();
  }

  public ngOnInit(): void {
    this.toast.open('FellowImGui is currently in alpha release. ' +
      'You can report issues and enhancements on GitHub.', undefined, {duration: 5000});
  }

  public openGitHub(): void {
    window.open('https://github.com/poirierlouis/FellowImGui', '_blank');
  }
}
