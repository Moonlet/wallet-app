#!/bin/bash

declare file="node_modules/react-native-keychain/android/src/main/java/com/oblador/keychain/cipherStorage/CipherStorageKeystoreRsaEcb.java"

echo "Patching files...";

if grep -q ".setInvalidatedByBiometricEnrollment(true)" $file 
then
echo "text found"
else 
    sed -i '' 's/return new KeyGenParameterSpec.Builder(alias, purposes)/return new KeyGenParameterSpec.Builder(alias, purposes).setInvalidatedByBiometricEnrollment(true)/' $file 
    sed -i '' 's/.setUserAuthenticationValidityDurationSeconds(1)//g' $file
fi

echo "Done."

