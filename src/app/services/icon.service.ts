import {inject, Injectable} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {FIGWidgetFactory} from "../models/widgets/widget.factory";

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly iconRegistry = inject(MatIconRegistry);

  private readonly widgetIcons: string[] = FIGWidgetFactory.icons;
  private readonly uiIcons: string[] = [
    'logo-github',

    'code', 'license', 'logo-lua'
  ];

  public load(): void {
    for (const icon of this.widgetIcons) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/widget-${icon}.svg`)
      );
    }
    for (const icon of this.uiIcons) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/${icon}.svg`)
      );
    }
  }

}
