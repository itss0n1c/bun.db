#!/usr/bin/env bash

rm -rf dist &&
bun build --target=bun --minify lib/index.ts --outdir=dist --external quick.db &&
tsc -p .
