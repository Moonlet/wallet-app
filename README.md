# Moonlet Wallet

## iOS Certificates

If iOS certificates have expired, go to https://gitlab.com/moonlet/moonlet-ios-certificates and delete all all `certs` and `profiles`. Also go to Apple Developer Portal, then `Profiles` and delete both `match AppStore` files.

Then go to `ios` and run `fastlane match appstore`.

If you are on a new device, you need to find the secret for `MATCH_PASSWORD`.

# Project Setup

## Windows

Once you've cloned the repo locally on your machine, open a command line/power shell in that folder and run ```yarn``` or ```npm install``` to install the packages for the app.

Next up you need to set the environment variables for Android on your local machine, you can find the instructions on how to do that [here](https://levelup.gitconnected.com/android-react-native-window-setup-how-to-setup-android-environment-for-react-native-app-588aaa13c3a6).

For starting the project you'll need to have an emulator running locally ( e.g. Android Studio ). Once the emulator is running execute ```npm run android``` or ```yarn android``` in a command line.

If you're getting the following error:

```
The syntax of the command is incorrect
error Command failed with exit code 1.
```
Follow these instructions:

* Install Git on your local machine
* Run GitBash inside the project folder
* Run ```which bash```, you should get something like: ```/usr/bin/bash```
* After that run ```npm config set script-shell /usr/bin/bash```
* Run ```npm run android``` or ```yarn android```

You should be able to run the project without getting an error. 
