import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { LandingComponent } from "./landing/landing.component";
import { HomeComponent } from "./home/home.component";
import { MoodsComponent } from "./moods/moods.component";
import { ChatComponent } from "./chat/chat.component";
import { ChatviewComponent } from "./chatview/chatview.component";
import { MemoriesComponent } from "./memories/memories.component";
import { SettingsComponent } from "./settings/settings.component";
import { AllComponent } from "./all/all.component";
import { MemoryComponent } from "./memory/memory.component";
import { EditComponent } from "./edit/edit.component";
import { CreatemoodComponent } from "./createmood/createmood.component";
import { ProfileMainComponent } from "./profile-main/profile-main.component";
import { CallviewComponent } from "./callview/callview.component";




export const routes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: LandingComponent, children: [
            { path: '', component: WelcomeComponent, outlet: 'auth-outlet' },
            { path: 'login', component: LoginComponent, outlet: 'auth-outlet' },
            { path: 'signup', component: SignupComponent, outlet: 'auth-outlet' },
            { path: 'reset-password', component: ResetPasswordComponent, outlet: 'auth-outlet' }
    ]},
    { path: 'home', component: HomeComponent, children: [
            { path: '', component: MoodsComponent, outlet: '0' },
            { path: 'chats', component: ChatComponent, outlet: '0'},
            { path: 'memories', component: MemoriesComponent, outlet: '0', children: [
                    { path: '', component: AllComponent, outlet: '1' },
                    { path: 'id/:id', pathMatch: 'full', component: MemoryComponent, outlet: '1' }
            ]},
            { path: 'profile', component: SettingsComponent, outlet: '0', children: [
                    { path: '', component: ProfileMainComponent, outlet: 'p' },
                    { path: 'edit', component: EditComponent, outlet: 'p' },
                    { path: 'create-mood', component: CreatemoodComponent, outlet: 'p' }
            ]},
            { path: 'call', component: CallviewComponent, outlet: '0' }    
    ]}
]