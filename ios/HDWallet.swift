//
//  HdWallet.swift
//  Moonlet
//
//  Created by George Burduhos on 01/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation



@objc(HdWallet) class HdWallet: NSObject {

@objc
func generateWallet(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve( ["index": 1, "menmonic": "mnnn" ])
}


@objc
func loadWallets(_ mnemonics: NSArray, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
   resolve( ["index": 1, "menmonic": mnemonics ]);
}

@objc
func getAccounts(_ walletIndex: NSInteger, blockchain name: NSString, accountIndexes indexes: NSArray,  resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve( [["address": name, "publicKey": indexes ]])
}


  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  

}
