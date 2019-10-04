//
//  HdWalletBridge.m
//  Moonlet
//
//  Created by George Burduhos on 01/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HdWallet, NSObject)




RCT_EXTERN_METHOD(generateWallet: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loadWallets: (NSArray)mnemonics resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAccounts: (NSInteger)walletIndex blockchain:(NSString)name accountIndexes:(NSArray)indexes resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)


@end
 