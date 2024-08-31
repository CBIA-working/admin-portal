import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NavigationsService } from 'src/app/student-support/service/navigations.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private pageName: string = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private navigationsService: NavigationsService
  ) {}

  @Input()
  set appHasPermission(pageName: string) {
    this.pageName = pageName;
    this.updateView();
  }

  private updateView(): void {
    if (this.navigationsService.hasWritePermission(this.pageName)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
