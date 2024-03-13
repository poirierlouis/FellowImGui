import {Injectable} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {WidgetFactory} from "../models/widgets/widget.factory";

@Injectable({
  providedIn: 'root'
})
export class IconService {

  private readonly widgets: string[] = WidgetFactory.icons;

  constructor(private readonly sanitizer: DomSanitizer,
              private readonly iconRegistry: MatIconRegistry) {

  }

  public load(): void {
    for (const icon of this.widgets) {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`./assets/icons/widget-${icon}.svg`)
      );
    }
  }

}
