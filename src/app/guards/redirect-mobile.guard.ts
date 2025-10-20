import {inject} from "@angular/core";
import {Router, type UrlTree} from "@angular/router";
import {isMobile} from "../mobile";

export function redirectMobileGuard(): UrlTree | boolean {
  if (!isMobile()) {
    return true;
  }
  const router: Router = inject(Router);

  return router.createUrlTree([]);
}
