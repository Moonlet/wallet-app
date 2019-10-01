//
//  HDWAlletBridge.m
//  Moonlet
//
//  Created by George Burduhos on 01/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HDWallet, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location)

@end
