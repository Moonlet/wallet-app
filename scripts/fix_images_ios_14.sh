#!/bin/bash

echo "Fixing Image iOS 14";
HUYDEV="_currentFrame.CGImage;"
HUYFIX="_currentFrame.CGImage ;} else { [super displayLayer:layer];"
sed -ie "s/${HUYDEV}/${HUYFIX}/" node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m
echo "Done."
