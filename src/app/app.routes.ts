import {Routes} from '@angular/router';
import {redirectMobileGuard} from "./guards/redirect-mobile.guard";

export const routes: Routes = [
  {path: '', redirectTo: 'readme', pathMatch: 'full'},
  {path: 'readme', loadComponent: () => import('./pages/readme/readme.component').then(c => c.ReadmeComponent)},
  {
    path: 'editor',
    loadComponent: () => import('./pages/editor/editor.component').then(c => c.EditorComponent),
    canActivate: [redirectMobileGuard],
  },
];
