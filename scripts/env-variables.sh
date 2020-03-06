#!/bin/bash

echo $NODE_ENV


if [ $NODE_ENV == "development" ]
then
    cp "./src/env/beta.env" "./.env"
else
    cp "./src/env/release.env" "./.env"
fi