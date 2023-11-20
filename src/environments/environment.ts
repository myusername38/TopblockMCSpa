// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/topblockmc-591df/us-central1/api",
  websocketUrl: "ws://play.TopblockMc.com:8164/v1/ws/console",
  firebaseConfig: {
    apiKey: "AIzaSyCetVK3yRxGylWHRrWPL6gUWN06dAKB9hw",
    authDomain: "topblockmc-591df.firebaseapp.com",
    databaseURL: "https://topblockmc-591df.firebaseio.com",
    projectId: "topblockmc-591df",
    storageBucket: "topblockmc-591df.appspot.com",
    messagingSenderId: "475400394545",
    appId: "1:475400394545:web:d12fed3040645ea10f8210",
    measurementId: "G-YK2TBS5PZK",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
