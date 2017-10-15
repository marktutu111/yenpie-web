import { Component, OnInit, OnDestroy } from '@angular/core';
import { Profile$vice } from "../services/profile.service";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";



@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.css']
})




export class ProfileMainComponent implements OnInit, OnDestroy {

                nickname$: string = "";
                age$: string = "";
                profession$: string = "";

                mdphoto$: any = '';
                mdDescription$: string = '';
                mdDate$: string = '';

                subscription: Subscription;
                mdSubscription: Subscription;


                constructor (private profile$vice: Profile$vice, private sanitizer: DomSanitizer) {}


                ngOnInit () {

                        this.subscription = this.profile$vice.profile$.subscribe(($profile: any) => {  
                                this.nickname$ = $profile.nickname;
                                this.age$ = $profile.age;
                                this.profession$ = $profile.profession;
                        });


                        this.mdSubscription = this.profile$vice.mood$.subscribe(($mood: any) => {

                                        this.mdphoto$ = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $mood.photo);
                                        this.mdDescription$ = $mood.description;
                                        this.mdDate$ = moment(new Date($mood.date)).fromNow();

                        })


                        if (this.profile$vice.profileCache) {
                                
                                        this.profession$ = this.profile$vice.profileCache.profession;
                                        this.age$ = this.profile$vice.profileCache.age;
                                        this.nickname$ = this.profile$vice.profileCache.nickname;

                        }


                        if (this.profile$vice.moodCache) {
                                        this.mdphoto$ = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.profile$vice.moodCache.photo);
                                        this.mdDescription$ = this.profile$vice.moodCache.description;
                                        this.mdDate$ = moment(new Date(this.profile$vice.moodCache.date)).fromNow();
                        }
                        

                }



                ngOnDestroy () {

                        try {
                          
                            this.subscription.unsubscribe();
                            this.mdSubscription.unsubscribe();

                        } catch (error) {
                          
                        }

                }



}
