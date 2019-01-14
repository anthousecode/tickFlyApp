import {BrowserModule} from "@angular/platform-browser";
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";

import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {PostPage} from "../pages/post/post";
import {HttpModule} from "@angular/http";
import {HttpService} from "../services/http.service";
import {FormsModule} from "@angular/forms";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {FollowersPage} from "../pages/followers/followers";
import {FollowedPage} from "../pages/followed/followed";
import {BlackListPage} from "../pages/black-list/black-list";
import {EditUserPage} from "../pages/edit-user/edit-user";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Camera} from "@ionic-native/camera";
import {CategoryListPage} from "../pages/category-list/category-list";
import {CategoryPage} from "../pages/category/category";
import {CreatePostPage} from "../pages/create-post/create-post";
import {GooglePlus} from "@ionic-native/google-plus";
import {ComponentsModule} from "../components/components.module";
import {CategoryPageModule} from "../pages/category/category.module";
import {CategoryListPageModule} from "../pages/category-list/category-list.module";
import {ChangePasswordPageModule} from "../pages/change-password/change-password.module";
import {CreatePostPageModule} from "../pages/create-post/create-post.module";
import {EditUserPageModule} from "../pages/edit-user/edit-user.module";
import {FollowedPageModule} from "../pages/followed/followed.module";
import {FollowersPageModule} from "../pages/followers/followers.module";
import {BlackListPageModule} from "../pages/black-list/black-list.module";
import {LoginPageModule} from "../pages/login/login.module";
import {PostPageModule} from "../pages/post/post.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {UserProfilePageModule} from "../pages/user-profile/user-profile.module";
import {SearchPageModule} from "../pages/search/search.module";
import {SharingFollowersListPageModule} from "../pages/sharing-followers-list/sharing-followers-list.module";
import {ChatsProvider} from "../providers/chats/chats";
import {ChatListPage} from "../pages/chat-list/chat-list";
import {ChatListPageModule} from "../pages/chat-list/chat-list.module";
import {ChatPageModule} from "../pages/chat/chat.module";
import {ChatPage} from "../pages/chat/chat";
import {ChatNewRecipientPage} from "../pages/chat-new-recipient/chat-new-recipient";
import {ChatNewRecipientPageModule} from "../pages/chat-new-recipient/chat-new-recipient.module";
import {ShopPageModule} from "../pages/shop/shop.module";
import {ShopPage} from "../pages/shop/shop";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";
import {SocketService} from "../services/socket.service";
import {PaymentSystemPageModule} from "../pages/payment-system/payment-system.module";
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import {ResetPasswordPageModule} from "../pages/reset-password/reset-password.module";
import {CreatePostSecondStepPage} from "../pages/create-post-second-step/create-post-second-step";
import {CreatePostSecondStepPageModule} from "../pages/create-post-second-step/create-post-second-step.module";

import { FileTransfer } from "@ionic-native/file-transfer";
import { DocumentViewer } from "@ionic-native/document-viewer";

// const config: SocketIoConfig = {url: "http://localhost:3001/", options: {}};
const config: SocketIoConfig = {url: "http://18.219.82.49:3001/", options: {}};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // LoginPage,
    // RegisterPage,
    // PostPage,
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    // MatCheckboxModule,
    CategoryPageModule,
    CategoryListPageModule,
    ChangePasswordPageModule,
    CreatePostPageModule,
    EditUserPageModule,
    FollowedPageModule,
    BlackListPageModule,
    RegisterPageModule,
    FollowersPageModule,
    PostPageModule,
    ComponentsModule,
    LoginPageModule,
    LoginPageModule,
    PostPageModule,
    RegisterPageModule,
    UserProfilePageModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false,
    }),
    SocketIoModule.forRoot(config),

    HttpModule,
    FormsModule,
    SearchPageModule,
    SharingFollowersListPageModule,
    ChatListPageModule,
    ChatPageModule,
    ChatNewRecipientPageModule,
    ShopPageModule,
    PaymentSystemPageModule,
    ResetPasswordPageModule,
    CreatePostSecondStepPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    PostPage,
    UserProfilePage,
    FollowersPage,
    FollowedPage,
    BlackListPage,
    EditUserPage,
    ChangePasswordPage,
    CategoryListPage,
    CategoryPage,
    CreatePostPage,
    ChatListPage,
    ChatPage,
    ChatNewRecipientPage,
    ShopPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService,
    GooglePlus,
    File,
    Transfer,
    Camera,
    FilePath,
    ChatsProvider,
    SocketService,
    FileTransfer,
    DocumentViewer
  ]
})
export class AppModule {
}
