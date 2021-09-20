#!/bin/bash


chmod 777 Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBDescriptor.swift

chmod 777 Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBCharacteristic.swift

chmod 777 Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RestoredState.swift

chmod 777 Pods/RCT-Folly/folly/portability/Time.h

echo "Patching  Files...";


if ! grep -q "descriptor.characteristic!" Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBDescriptor.swift; then
  awk '{sub("descriptor.characteristic", "descriptor.characteristic!")}1' Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBDescriptor.swift > tmp.swift && mv tmp.swift Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBDescriptor.swift
fi

if ! grep -q "characteristic.service!" Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBCharacteristic.swift; then
 awk '{sub("characteristic.service", "characteristic.service!")}1' Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBCharacteristic.swift > tmp1.swift && mv tmp1.swift Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RxCBCharacteristic.swift
fi

if ! grep -q "service.peripheral!" Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RestoredState.swift; then
 awk '{sub("service.peripheral", "service.peripheral!")}1' Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RestoredState.swift > tmp2.swift && mv tmp2.swift Pods/MultiplatformBleAdapter/iOS/RxBluetoothKit/RestoredState.swift
fi

awk '{sub("typedef uint8_t clockid_t;", "")}1' Pods/RCT-Folly/folly/portability/Time.h > tmp.h && mv tmp.h Pods/RCT-Folly/folly/portability/Time.h

echo "Done."




