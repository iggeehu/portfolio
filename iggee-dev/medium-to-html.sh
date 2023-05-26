#!/bin/bash
# A sample Bash script, by Ryan
echo Hello World!

md=`node medium_converter.js $1`
node html_converter.mjs $md