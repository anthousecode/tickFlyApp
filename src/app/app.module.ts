import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, ComponentFactoryResolver } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage, ModalContentPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {PostPage} from "../pages/post/post";
import {HttpModule} from "@angular/http";
import {HttpService} from "../services/http.service";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    PostPage,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(appRoutes, { enableTracing: true }),
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    PostPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService
  ]
})
export class AppModule {}
