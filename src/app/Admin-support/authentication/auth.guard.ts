import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { NavigationsService } from 'src/app/student-support/service/navigations.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private navigationsService: NavigationsService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const pageTitle = this.getPageTitleFromPath(state.url);

    if (this.authService.isLoggedIn()) {
      // Check if the user has access to the requested page
      if (pageTitle && (this.navigationsService.hasReadPermission(pageTitle) || this.navigationsService.hasWritePermission(pageTitle))) {
        return true; // Allow access if permissions are present
      } else {
        // Redirect to not authorized page or home if no permissions
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      // Redirect to login if not logged in
      this.router.navigate(['/login']);
      return false;
    }
  }

  private getPageTitleFromPath(path: string): string | null {
    const page = this.navigationsService.getPages().find(p => p.path === path || p.children?.some(child => child.path === path));
    if (page) {
      return page.title;
    }
    const childPage = page?.children?.find(child => child.path === path);
    return childPage ? childPage.title : null;
  }
}
