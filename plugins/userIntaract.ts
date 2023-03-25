const a = null;
export default  a;
// import { defineNuxtPlugin } from "#app";

// export default class UIcontroler {
//     constructor(){
//         console.log("From Constructor");
//         this.isUserInteracting = true;
//         this.onPointerDownX = 0;
//         this.onPointerDownY = 0;
//         this.onPointerDownLon = 0;
//         this.onPointerDownLat = 0;

//         this.lon = 0;
//         this.lat = 0;
//     }

//     onDocumentTouchStart( event ) {
//         console.log("touch");
//         this.isUserInteracting = true;

//         this.onPointerDownX = event.changedTouches[0].clientX;
//         this.onPointerDownY = event.changedTouches[0].clientY;

//         this.onPointerDownLon = this.lon;
//         this.onPointerDownLat = this.lat;
//     }

//     onDocumentTouchMove( event ) {
//         if ( event.touches.length > 1 ) {
//             event.preventDefault();
//         }

//         if( this.isUserInteracting === true ) {
//             this.lon = ( this.onPointerDownX - event.changedTouches[0].clientX ) * 0.2 + this.onPointerDownLon;
//             this.lat = ( event.changedTouches[0].clientY - this.onPointerDownY ) * 0.2 + this.onPointerDownLat;
//             console.log(this.onPointerDownLat);
//         }
//     }

//     serup(){
//         console.log('serup');
//         return 'hoge';
//     }

// }

// export default defineNuxtPlugin(() => {
//     return {
//         provide: {
//             uic: new UIcontroler
//         }
//     }
// })