#!/bin/bash
aws s3 sync ./superfight-server s3://superfight-server --delete --exclude 'node_modules/*'
ssh -t -i "C:/Users/M_Beg/.ssh/superfight-server.pem" ec2-user@ec2-15-222-253-94.ca-central-1.compute.amazonaws.com 'aws s3 sync s3://superfight-server ./superfight-server --delete;cd ./superfight-server;npm install'