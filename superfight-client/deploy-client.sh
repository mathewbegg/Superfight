#!/bin/bash
distributionID=E3T25SF5J2KQF8
sourceDirectory=./dist/superfight-client
destinationDirectory=s3://superfight.mathewbegg.com

ECHO =================================
ECHO Intalling Dependencies
ECHO =================================
npm install

ECHO =================================
ECHO Building Project
ECHO =================================
ng build --prod

ECHO =================================
ECHO Syncing to s3
ECHO =================================
aws s3 sync $sourceDirectory $destinationDirectory --delete

ECHO =================================
ECHO Invalidating Index.html in Cloudfront Distribution
ECHO =================================
aws cloudfront create-invalidation --distribution-id $distributionID --paths //index.html