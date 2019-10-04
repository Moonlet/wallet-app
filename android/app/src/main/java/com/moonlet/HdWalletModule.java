package com.moonlet;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;

public class HdWalletModule extends ReactContextBaseJavaModule {

    public HdWalletModule(ReactApplicationContext reactContext) {
        super(reactContext); // required by React Native
    }

    @Override
    public String getName() {
        return "HdWallet";
    }

    @ReactMethod
    public void generateWallet(final Promise promise) {
        promise.resolve("index");
    }

    @ReactMethod
    public void loadWallets(ReadableArray mnemonics,final Promise promise) {
        promise.resolve("list of wallets");
    }

    @ReactMethod
    public void getAccounts(int walletIndex, String blockchain, ReadableArray accountIndexes, final Promise promise) {
        promise.resolve(walletIndex);
    }

   
}