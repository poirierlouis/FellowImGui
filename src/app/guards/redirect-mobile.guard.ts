import {isMobile} from "../mobile";
import {inject} from "@angular/core";
import {Router, UrlTree} from "@angular/router";

export function redirectMobileGuard(): UrlTree | boolean {
  if (!isMobile()) {
    return true;
  }
  const router: Router = inject(Router);

  return router.createUrlTree([]);
}
