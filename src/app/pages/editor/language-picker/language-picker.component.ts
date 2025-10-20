import {Component, inject} from "@angular/core";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatTooltip} from "@angular/material/tooltip";
import type {FIGFormatterLanguage} from "../../../formatters/formatter";
import {FormatterService} from "../../../services/formatter.service";

interface LanguageItem {
  readonly value: FIGFormatterLanguage;
  readonly label: string;
  readonly link: string;
}

@Component({
  selector: "fig-language-picker",
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger, MatTooltip],
  templateUrl: "./language-picker.component.html",
  styleUrl: "./language-picker.component.css",
})
export class LanguagePickerComponent {
  private readonly formatterService = inject(FormatterService);

  readonly languages: LanguageItem[] = [
    {value: "Lua - sol2", label: "Lua · sol2", link: "https://github.com/MSeys/sol2_ImGui_Bindings"},
  ];

  public isSelected(language: FIGFormatterLanguage): boolean {
    return this.formatterService.currentLanguage === language;
  }

  public selectLanguage(language: LanguageItem): void {
    this.formatterService.changeLanguage(language.value);
  }

  public followLink(link: string): void {
    window.open(link, "_blank");
  }
}
