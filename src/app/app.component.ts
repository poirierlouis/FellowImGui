import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {IconService} from "./services/icon.service";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatChip} from "@angular/material/chips";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'fig-app',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatIcon, MatIconButton, RouterLink, MatTooltip, MatChip, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private readonly iconService: IconService,
              private readonly toast: MatSnackBar) {
    this.iconService.load();
  }

  public ngOnInit(): void {
    this.toast.open('FellowImGui is currently in pre-alpha release. ' +
      'You can report issues and enhancements on GitHub.', undefined, {duration: 5000});
  }

  public openGitHub(): void {
    window.open('https://github.com/poirierlouis/FellowImGui', '_blank');
  }
}
