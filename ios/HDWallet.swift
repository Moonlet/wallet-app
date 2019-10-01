//
//  HDWallet.swift
//  Moonlet
//
//  Created by George Burduhos on 01/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(HDWallet) class HDWallet: NSObject {

  @objc(addEvent:location:)
  func addEvent(name: String, location: String) -> Void {
    // Date is ready to use!
    print ("name", name, location)
  }

  @objc
  func constantsToExport() -> [String: Any]! {
    return ["someKey": "someValue"]
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  

}
