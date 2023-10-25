import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MiddlewareInterceptor } from "./interceptor/middleware.interceptor";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { GraphQLModule } from './graphql.module';
import { PdfViewerModule } from "ng2-pdf-viewer";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: "enabled",
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    PdfViewerModule,
    MatIconModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),
    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),

    // Core module of your application
    CoreModule,

    // Layout module of your application
    LayoutModule,

    // 3rd party modules that require global configuration via forRoot
    MarkdownModule.forRoot({}),

    GraphQLModule,

    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MiddlewareInterceptor, multi: true }
  ],
})
export class AppModule {}
