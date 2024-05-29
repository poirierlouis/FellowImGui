import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFabButton} from "@angular/material/button";

@Component({
  selector: 'fig-readme',
  standalone: true,
  imports: [
    MatIcon,
    MatFabButton
  ],
  templateUrl: './readme.component.html',
  styleUrl: './readme.component.css'
})
export class ReadmeComponent {

}
