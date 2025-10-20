import {Component} from "@angular/core";
import type {FIGTreeNodeWidget} from "../../../../models/widgets/tree-node.widget";
import {FlagsFieldComponent} from "../../fields/flags-field/flags-field.component";
import {StringFieldComponent} from "../../fields/string-field/string-field.component";
import {AbstractPropertiesComponent} from "../abstract-properties.component";

@Component({
  selector: "fig-tree-node-properties",
  imports: [FlagsFieldComponent, StringFieldComponent],
  templateUrl: "./tree-node-properties.component.html",
  styleUrl: "./tree-node-properties.component.css",
})
export class TreeNodePropertiesComponent extends AbstractPropertiesComponent<FIGTreeNodeWidget> {}
