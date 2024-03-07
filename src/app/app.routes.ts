import {Routes} from '@angular/router';
import {ReadmeComponent} from "./pages/readme/readme.component";
import {EditorComponent} from "./pages/editor/editor.component";

export const routes: Routes = [
  {path: '', component: EditorComponent},
  {path: 'readme', component: ReadmeComponent},
  {path: 'editor', component: EditorComponent},
];
