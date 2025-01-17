#!/bin/bash

circom_version=v2.1.3

if ! [ -x "$(command -v circom)" ]; then
    git clone https://github.com/iden3/circom.git
    cd circom
    git checkout $circom_version
    cargo build --release
    cargo install --path circom
fi
