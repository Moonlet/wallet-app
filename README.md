# Moonlet Wallet

[![Coverage Status](https://codecov.io/gh/moonlet/wallet-app/branch/master/graphs/badge.svg?branch=master)](https://codecov.io/gh/Moonlet/wallet-app/)

# Project Setup

## Windows

Make sure you download and install NodeJS with the version between 12.X and 14.X, we recommend 14.17.2. The latest versions are not supported.

Once you've cloned the repo locally on your machine, open a command line/power shell in that folder and run ```yarn``` to install the packages for the app.

Next up you need to set the environment variables for Android on your local machine, you can find the instructions on how to do that [here](https://levelup.gitconnected.com/android-react-native-window-setup-how-to-setup-android-environment-for-react-native-app-588aaa13c3a6).

For starting the project you'll need to have an emulator running locally ( e.g. Android Studio ). Once the emulator is running execute ```yarn android``` in a command line.

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
* Run ```yarn android```

You should be able to run the project without getting an error. 
