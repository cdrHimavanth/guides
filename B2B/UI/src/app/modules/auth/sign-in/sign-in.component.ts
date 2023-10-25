import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseAlertType } from "@fuse/components/alert";
import { AuthService } from "app/core/auth/auth.service";

@Component({
  selector: "auth-sign-in",
  templateUrl: "./sign-in.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild("signInNgForm") signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  signInForm: UntypedFormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    
    // Create the form
    this.signInForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required],
      rememberMe: [""],
    });

    if(localStorage.getItem("rememberMe")){
      this.signInForm.setValue({
        username: localStorage.getItem("username"),
        password: "",
        rememberMe: localStorage.getItem("rememberMe")
      })
      // this.signInForm.value.rememberMe = localStorage.getItem("rememberMe")
      // this.signInForm.value.username= localStorage.getItem("username")
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    // console.log(this.signInForm.value)
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value).subscribe(
      (data) => {
        
        if ((data.data !== null)) {
          if(this.signInForm.value.rememberMe){
            localStorage.setItem('username', this.signInForm.value.username);
            localStorage.setItem('rememberMe',this.signInForm.value.rememberMe)
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("rememberMe");
          }
          
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            // this._router.navigateByUrl("/signed-in-redirect");
            this._router.navigateByUrl(redirectURL);
        } else {
            // this._router.navigateByUrl("/signed-in-redirect");
            this._router.navigateByUrl("/signed-in-redirect");
          // Re-enable the form
          this.signInForm.enable();

          // Reset the form
          this.signInNgForm.resetForm();

          // Set the alert
          this.alert = {
            type: "error",
            message: data.message,
          };

          // Show the alert
          this.showAlert = true;
          
        }

        // this._router.navigateByUrl(redirectURL);
      }
    );
  }
}
