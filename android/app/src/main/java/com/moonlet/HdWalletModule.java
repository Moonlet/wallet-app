package com.moonlet;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class HdWalletModule extends ReactContextBaseJavaModule {

    public HdWalletModule(ReactApplicationContext reactContext) {
        super(reactContext); // required by React Native
    }

    @Override
    public String getName() {
        return "HdWalletModule";
    }

    @ReactMethod
    public void generateWallet() {
        
    }


}