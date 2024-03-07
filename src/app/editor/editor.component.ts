import {Component} from '@angular/core';
import {ImGuiCanvasComponent} from "../components/imgui-canvas/imgui-canvas.component";
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from "@angular/material/sidenav";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {TreeComponent} from "./tree/tree.component";

@Component({
  selector: 'fig-editor',
  standalone: true,
  imports: [
    MatList,
    MatIcon,
    MatDrawer,
    MatListItem,
    MatIconButton,
    MatDrawerContent,
    MatDrawerContainer,
    TreeComponent,
    ImGuiCanvasComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
}
