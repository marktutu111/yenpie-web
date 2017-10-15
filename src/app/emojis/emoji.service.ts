
import * as emojis from "emojis-list";
declare let emojione: any;


export class Emojis {


            emojis$: Array<any>[] = [];    
            constructor () {};


            get () {

                    emojis.forEach(element => {

                            let el = emojione.toImage(element, {"size": 72});
                            this.emojis$.push(el);
                            
                    });

            }



}