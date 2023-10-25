import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';

@Injectable()
export class MiddlewareInterceptor implements HttpInterceptor {

  constructor(private _authService :AuthService,
    private _fuseConfirmationService:FuseConfirmationService) {}
    _defaultConfig: FuseConfirmationConfig = {
      title      : 'Session expired!!',
      message    : 'Please Login again ',
      icon       : {
          show : true,
          name : 'heroicons_outline:exclamation',
          color: 'warn'
      },
      actions    : {
          confirm: {
              show : true,
              label: 'Ok'
          },
          cancel: {
              show:false
          }
      
      },
      dismissible: false
  };

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = localStorage.getItem('accessToken');
  //   if (token) {
  //     const authReq = request.clone({
  //       headers: request.headers.set('Authorization', `Bearer ${token}`)
  //     });
  //     return next.handle(authReq);
  //   }
  //   return next.handle(request);
  // }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
      // Clone the request object
      let newReq = req.clone();

      // Request
      //
      // If the access token didn't expire, add the Authorization header.
      // We won't add the Authorization header if the access token expired.
      // This will force the server to return a "401 Unauthorized" response
      // for the protected API routes which our response interceptor will
      // catch and delete the access token from the local storage while logging
      // the user out from the app.
      if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
      {
          newReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
          });
      }

      // Response
      return next.handle(newReq).pipe(
          catchError((error) => {

              // Catch "403 Forbidden" responses
              if ( error instanceof HttpErrorResponse && error.status === 403 )
               {
                  const dialogRef = this._fuseConfirmationService.open(this._defaultConfig);

                  // Subscribe to afterClosed from the dialog reference
                  dialogRef.afterClosed().subscribe((result) => {
                   //Sign out
                  this._authService.signOut();

                  // Reload the app
                  location.reload();
                  });
                
              }
              return throwError(error);
          })
      );
  }
}
