#!/bin/sh

EXPECTED_ARGS=1
REPO=https://github.com/lhj1982/fcapp-server.git
BRANCH=master

if [ $# -ne $EXPECTED_ARGS ]
then
	echo "Usage: `basename $0` {local/live}"
	exit 1
fi

if [ "$1" = "local" ]; then
	echo local
else
if [ "$1" = "live" ]; then
	REV=`git rev-parse HEAD`
	echo Deploy fcapp-server - ${REV} from ${BRANCH} to live
	
	TMP=`mktemp -d`
	cd $TMP
	echo clone project...
	git clone -b $BRANCH $REPO fcapp-server || exit 1
    
    #cp vdragon-api/app/config/app-template.php simpleshop/app/config/app.php
    echo build project
    cd fcapp-server
    echo generating dependencies
    #pm install --production || exit 7
    
	echo Login to fcapp-server NU7RFqPqVYX2pWwZ
    echo remove all migrations and seed files on remote
    rm -rf data/*
    rm -rf dist/logs/*
    scp -r ./ root@jbs-prod1:~/fcapp-server/ || exit 3
    echo Sync project to remote
	#rsync -vazr --exclude-from='/Users/hli36/projects/ademes/jbs/jbf-server/scripts/deploy/rsync_exclude' ./ root@jbs-prod:~/jbf-server/ || exit 3

	
	cd $TMP/..
	rm -rf $TMP || exit 4
fi
fi

exit 0
