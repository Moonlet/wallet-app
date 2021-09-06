# Moonlet Wallet

[![Coverage Status](https://codecov.io/gh/moonlet/wallet-app/branch/master/graphs/badge.svg?branch=master)](https://codecov.io/gh/Moonlet/wallet-app/)

# Project Setup

## Android

Make sure you download and install NodeJS with the version between 12.X and 14.X, we recommend 14.17.6. The latest versions are not supported.

Once you've cloned the repo locally on your machine, open a command line/power shell in that folder and run ```yarn``` to install the packages for the app.

Next up you need to set the environment variables for Android on your local machine, you can find the instructions on their [documentation](https://levelup.gitconnected.com/android-react-native-window-setup-how-to-setup-android-environment-for-react-native-app-588aaa13c3a6).

For starting the project you'll need to have an emulator running locally ( e.g. Android Studio ). Once the emulator is running, execute ```yarn android``` in a command line.

## MacOS

### Running iOS

Before running the iOS project download and install the XCode application, you can find it in the AppStore. Next up you need to make sure that you have nodeJS (version between 12.X and 14.X, others are not supported) installed. We recommend following the steps that are described [here](https://tecadmin.net/install-nvm-macos-with-homebrew/) to do it, and on the 3rd step when you install node you can run the following command:

```nvm install 14``` - This version is the latest one that will work.

***If you already have node installed through the wizard from their website you'll have to delete it first. You can delete it by following these instructions:***
1. go to /usr/local/lib and delete any node and node_modules
2. go to /usr/local/include and delete any node and node_modules directory

Make sure you run ```source ~/.bash_profile``` in the terminal you're going to use before actually starting the project, this command will load the variables necessary for nvm. 

After that if you run ```nvm -v``` you should receive the version of the nvm that is installed, then run ```node -v```, if it returns ```14.17.6``` you should be able to start the project.

Run the following commands in the terminal:

* ```yarn``` will install the project packages
* ```yarn start``` will start the Metro module
* ```yarn ios``` will build the iOS app and start the emulator

If the app build is successfull, the app will open in the iOS emulator automatically.

### Running Android

To run the android project you'll need to have an android emulator installed on your local machine, we recommend [Android Studio](https://developer.android.com/studio).

Once you've installed Android Studio you'll need the Java SDK. Make sure you install the version 11 as it's the currently supported Java version on Android.

You can follow the steps from this [github repo](https://github.com/AdoptOpenJDK/homebrew-openjdk) and install the adoptopenjdk11 version on your machine. Once the installation is finished if you run ```jdk 11``` on the terminal you should receive:

```
openjdk version "11.0.11" 2021-04-20
OpenJDK Runtime Environment AdoptOpenJDK-11.0.11+9 (build 11.0.11+9)
OpenJDK 64-Bit Server VM AdoptOpenJDK-11.0.11+9 (build 11.0.11+9, mixed mode)
```

Before you run the project we'll need to export the Java variables, run these commands in the terminal:

```
export ANDROID_HOME=~/Library/Android/sdk
export ANDROID_SDK_ROOT=~/Library/Android/sdk
```

If everything was done correctly you should be able to start the project by running:
```yarn android```
Once the build is successfull and an android emulator is running, the app will open automatically in the emulator.

## Windows ( tips & tricks )

If you're running the project on a Windows machine and you're getting the following error:
```
The syntax of the command is incorrect
error Command failed with exit code 1.
```
Run this in the git bash terminal: 
```
npm config set script-shell ${which bash}
```
