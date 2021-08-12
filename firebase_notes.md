HOW TO UPLOAD FILE USING FIRESTORE STORAGE

- Install firebase using npm install --save firebase

1. Create a new project in your FIREBASE account.
2. Go to setting > project settings
3. Add a project and choose web application
4. Register the app
5. Go to Storage and click Get Started
6. Go to rules and change
   allow read, write: if request.auth != null; to
   allow read, write: if request.auth != true;
   /** this way no permission is required to upload files **/

   Click Publish

SETTING UP CONFIGURATION
After publishing your new Firebase Project the next step is setting up configuration
in your vue cli app.

1. Go to your project settings
2. Below you will find the firebaseConfig object.
3. copy to whole script tag and paste them in your main.js above the new vue instance
4. import firebase at the top if main.js
   import firebase from 'firebase/app';
   import 'firebase/storage';

5. Go to your vue component and import
   import firebase from "firebase/app";
6. Create a function on upload e.g
   upload() {
   this.uploading = true;
   var storageRef = firebase.storage().ref("/" + this.picture.name);
   var task = storageRef.put(this.picture);
   // monitor progress
   task.on(
   "state_change",
   (snapshot) => {
   if (this.uploadValue != 100) {
   this.uploadValue =
   (snapshot.bytesTransferred / snapshot.totalBytes) \* 100;
   }
   },
   (error) => {
   console.log(error.message);
   },
   () => {
   this.uploading = false;
   this.uploadValue = 0;
   alert("Profile Picture Uploaded Successfully");
   task.snapshot.ref.getDownloadURL().then((download) => {
   console.log("file download@", download);
   });
   }
   );
   },
