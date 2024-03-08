import {Component} from '@angular/core';
import {CanvasComponent} from "./canvas/canvas.component";
import {MatList, MatListItem, MatListItemIcon} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {TreeComponent} from "./tree/tree.component";
import {FIGContainer} from "../../models/container";
import {FIGWindowWidget} from "../../models/window.widget";
import {FIGTextWidget} from "../../models/text.widget";
import {FIGButtonWidget} from "../../models/button.widget";

@Component({
  selector: 'fig-editor',
  standalone: true,
  imports: [
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    TreeComponent,
    CanvasComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  root: FIGContainer[] = [];

  constructor() {
    this.root.push(new FIGWindowWidget('Fellow · ImGui'));
    this.root.push(new FIGWindowWidget('Bienvenue · ImGui'));
    this.root.push(new FIGWindowWidget('Paramount · ImGui'));
    this.root[0].children.push(new FIGTextWidget('Hello'));
    this.root[0].children.push(new FIGTextWidget('World'));
    this.root[0].children.push(new FIGButtonWidget('Click me'));
    this.root[1].children.push(new FIGTextWidget('Bonjour'));
    this.root[1].children.push(new FIGTextWidget('Monde'));
    this.root[1].children.push(new FIGButtonWidget('Clique moi'));
    this.root[2].children.push(new FIGTextWidget('Hello'));
    this.root[2].children.push(new FIGTextWidget('World'));
    this.root[2].children.push(new FIGButtonWidget('Click me'));
  }

}
