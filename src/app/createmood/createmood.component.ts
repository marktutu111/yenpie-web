import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Profile$vice } from "../services/profile.service";
import { Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { MoodService } from "../services/moods.service";




@Component({
  selector: 'app-createmood',
  templateUrl: './createmood.component.html',
  styleUrls: ['./createmood.component.css', '../edit/edit.component.css']
})






export class CreatemoodComponent implements OnInit {

              savedescription: boolean = false;
              savephoto: boolean = false;
              description: string = "";
              moodphoto: any;
              $userid: string;
              subscription: Subscription;
              moodDescription: string = "";
              moodDate: string = "";

              constructor (private fbDb: AngularFireDatabase, 
                           private profile$vice: Profile$vice,
                           private mood$vice: MoodService, 
                           private sanitizer: DomSanitizer) {}



              ngOnInit () {

                     try {

                                if (this.profile$vice.$userid) this.$userid = this.profile$vice.$userid;
                                this.subscription = this.profile$vice.profile$.subscribe(() => {this.$userid = this.profile$vice.$userid });

                             
                     } catch (err) {

                             
                     }


              };




              fileChangeEvent (fileInput: any) {


                      if (this.$userid) {

                              if (fileInput.target.files && fileInput.target.files[0]) {

                                        let reader = new FileReader();
                                        reader.onload = (e: any) => {

                                                this.moodphoto = e.target.result;
                                                let $photoString = this.moodphoto.split(',')[1];

                                                this.savephoto = true;
                                                this.fbDb.object(`/Profiles/${this.$userid}/mood`)
                                                        .update({ photo: $photoString, date: Date() })
                                                        .then(() => {

                                                              this.savephoto = false;
                                                              this.mood$vice.$userMoodNull.next({ photo: true });

                                                        })
                                        }

                                        reader.readAsDataURL(fileInput.target.files[0]);
                                        
                              }

                      }

            }




            saveDescription () {

                    if (this.$userid && this.description !== "") {

                          this.savedescription = true;
                          this.fbDb.object(`/Profiles/${this.$userid}/mood`)
                                  .update({ description: this.description, date: Date() })
                                  .then(() => {

                                          this.savedescription = false;
                                          this.moodDescription = this.description;
                                          this.description = "";
                                          this.mood$vice.$userMoodNull.next({ description: true });

                                  })

                    }

            }




            ngOnDestroy () {

                  try {

                        this.subscription.unsubscribe();

                  } catch (err) {
                    
                  }

            }








}
