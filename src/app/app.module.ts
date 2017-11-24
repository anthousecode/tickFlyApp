import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, ComponentFactoryResolver } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage, ModalContentPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {PostPage} from "../pages/post/post";
import {HttpModule} from "@angular/http";
import {HttpService} from "../services/http.service";
import {FormsModule} from "@angular/forms";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {PostPreviewComponent} from "../components/post-preview/post-preview";
import {FollowersPage} from "../pages/followers/followers";
import {FollowedPage} from "../pages/followed/followed";
import {EditUserPage} from "../pages/edit-user/edit-user";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {CategoryListPage} from "../pages/category-list/category-list";
import {CategoryPage} from "../pages/category/category";
import {CreatePostPage} from "../pages/create-post/create-post";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    PostPage,
    ModalContentPage,
    UserProfilePage,
    PostPreviewComponent,
    FollowersPage,
    FollowedPage,
    EditUserPage,
    ChangePasswordPage,
    CategoryListPage,
    CategoryPage,
    CreatePostPage
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
    LoginPage,
    RegisterPage,
    PostPage,
    ModalContentPage,
    UserProfilePage,
    FollowersPage,
    FollowedPage,
    EditUserPage,
    ChangePasswordPage,
    CategoryListPage,
    CategoryPage,
    CreatePostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService,
    File,
    Transfer,
    Camera,
    FilePath
  ]
})
export class AppModule {}
