#!/bin/bash
#
# This script rsyncs code on local machines to the webserver.
# This project will not work properly unless you setup your ssh config file
#
# Config
REMOTEUSER=nico;
# Use rsync to bring all files from this project
rsync -avr --progress /mnt/c/Users/David\ Zou/Projects/react-hell/. $REMOTEUSER@machine.chuuni.me:~/repos/react-hell --exclude .git --exclude .idea --exclude /node_modules;
