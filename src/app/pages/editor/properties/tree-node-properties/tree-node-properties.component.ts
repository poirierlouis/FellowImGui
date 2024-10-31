import {Component, DestroyRef} from '@angular/core';
import {AbstractPropertiesComponent} from "../abstract-properties.component";
import {FIGTreeNodeWidget} from "../../../../models/widgets/tree-node.widget";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";

@Component({
  selector: 'fig-tree-node-properties',
  standalone: true,
  imports: [
    FlagsFieldComponent,
    StringFieldComponent
  ],
  templateUrl: './tree-node-properties.component.html',
  styleUrl: './tree-node-properties.component.css'
})
export class TreeNodePropertiesComponent extends AbstractPropertiesComponent<FIGTreeNodeWidget> {

  constructor(dr: DestroyRef) {
    super(dr);
  }

}
