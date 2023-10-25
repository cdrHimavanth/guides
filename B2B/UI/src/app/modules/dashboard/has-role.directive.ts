import { Directive , Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {

  constructor(private templateRef : TemplateRef<any>, private viewContainerRef : ViewContainerRef  ) { 
    
  }

  @Input() set appHasRole(condition : boolean){
    if(condition){
      this.viewContainerRef.clear();
    }else{
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }





}
