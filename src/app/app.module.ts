import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from "./config";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/Http";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { routes } from "./routes";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { MoodsComponent } from './moods/moods.component';
import { ChatComponent } from './chat/chat.component';
import { MemoriesComponent } from './memories/memories.component';
import { FriendsService } from "./services/friends.service";
import { ChatviewComponent } from './chatview/chatview.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestsDropdownMenuComponent } from './requests-dropdown-menu/requests-dropdown-menu.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { MoodService } from "./services/moods.service";
import { MemoryComponent } from './memory/memory.component';
import { AllComponent } from './all/all.component';
import { Memories } from "./services/memories.service";
import { EditComponent } from './edit/edit.component';
import { CreatemoodComponent } from './createmood/createmood.component';
import { Profile$vice } from "./services/profile.service";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PushService } from "./services/push.service";
import { CallService } from "./services/webrtc.service";
import { CallviewComponent } from './callview/callview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { EmojisComponent } from './emojis/emojis.component';
import { IncomingCallComponent } from './incoming-call/incoming-call.component';



@NgModule({
      declarations: [
          AppComponent,
          LoginComponent,
          SignupComponent,
          WelcomeComponent,
          ResetPasswordComponent,
          LandingComponent,
          HomeComponent,
          MoodsComponent,
          ChatComponent,
          MemoriesComponent,
          ChatviewComponent,
          ProfileComponent,
          RequestsDropdownMenuComponent,
          FooterComponent,
          SettingsComponent,
          SearchViewComponent,
          MemoryComponent,
          AllComponent,
          EditComponent,
          CreatemoodComponent,
          CallviewComponent,
          ProfileMainComponent,
          EmojisComponent,
          IncomingCallComponent
      ],
      imports: [
          BrowserModule,
          FormsModule,
          AngularFireModule.initializeApp(firebaseConfig.firebase),
          AngularFireAuthModule,
          HttpModule,
          AngularFireDatabaseModule,
          SimpleNotificationsModule.forRoot(),
          RouterModule.forRoot(routes),
          BrowserAnimationsModule
      ],
      providers: [FriendsService, MoodService, Memories, Profile$vice, PushService, CallService],
      bootstrap: [AppComponent]
})




export class AppModule { }
