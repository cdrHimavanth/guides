import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  

  @Input('hasRole') set appShowBasedOnText(allowedConditions: string[]) {
    // Assuming you have a way to determine the current user's permissions
    // You can replace this with your authentication or permission logic
    const currentUserConditions = ['READ', 'EDIT']; // Replace with actual user conditions

    const userRoles = ["VIEW_DASHBOARD", "VIEW_POSITIONS", "VIEW_HR_REPORTS", "VIEW_CANDIDATE", "VIEW_BID_INFO"]

    const admin = ["ALL"]

    const manager = ["EDIT_POSITIONS", "VIEW_HR_REPORTS", "VIEW_CANDIDATE", "VIEW_BID_INFO", "EDIT_BID_INFO", "POS_UPLOAD", "ADMIN_ACCESS"]

    const hr = ["VIEW_POSITIONS"]

    if (allowedConditions.some(cond => admin.includes(cond))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    if(allowedConditions.some(cond => manager.includes(cond))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
     else {
      this.viewContainer.clear();
    }
  }

}
