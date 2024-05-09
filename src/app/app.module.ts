import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { BrowserModule } from '@angular/platform-browser';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NG_ENTITY_SERVICE_CONFIG, HttpMethod } from '@datorama/akita-ng-entity-service';
import { environment } from 'src/environments/environment';
import { AppRefereshComponent } from './app-referesh/app-referesh.component';
import { BaseUrlMiddleWareService } from './shared/interceptors/base-url.middle-ware.service';
import { CommonSharedModule } from './shared/modules/common-shared.module';
import { AkitaNgRouterStoreModule } from "@datorama/akita-ng-router-store";
import { AppBreadcrumbService } from './layout/app.breadcrumb.service';

// @NgModule({
//     declarations: [
//         AppComponent
//         , NotfoundComponent
//     ],
//     imports: [
//         AppRoutingModule,
//         AppLayoutModule
//     ],
//     providers: [
//         { provide: LocationStrategy, useClass: HashLocationStrategy },
//         CountryService, CustomerService, EventService, IconService, NodeService,
//         PhotoService, ProductService
//     ],
//     bootstrap: [AppComponent]
// })

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonSharedModule,
        environment.production ? [] : AkitaNgDevtools.forRoot(),
        AkitaNgRouterStoreModule,
        CommonModule
        // ApplicationLevelModule,
    ],
    declarations: [
        AppComponent,
        AppRefereshComponent,
        NotfoundComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AppBreadcrumbService
        ,
        { provide: HTTP_INTERCEPTORS, useClass: BaseUrlMiddleWareService, multi: true },
        {
            provide: NG_ENTITY_SERVICE_CONFIG,
            useValue: {
                baseUrl: environment.baseUrl,
                httpMethods: {
                    POST: HttpMethod.POST,
                    GET: HttpMethod.GET,
                },
            },
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
