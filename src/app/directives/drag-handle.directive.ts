import {Directive, HostBinding} from "@angular/core";

@Directive({
  selector: '[figDragHandle]',
  standalone: true
})
export class DragHandleDirective {

  @HostBinding('draggable')
  draggable?: boolean;

}
