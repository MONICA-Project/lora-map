#!/bin/bash

HOMEDIR=$HOME
ROOT="$HOMEDIR/deb"
OUTPUT="../bin/Release"

EXEC="$ROOT/usr/local/bin/loramap"
CONFIG="$ROOT/etc/loramap"
SYSTEMD="$ROOT/lib/systemd/system"
LOGROTATE="$ROOT/etc/logrotate.d"

DEBIAN="$ROOT/DEBIAN"
VMAJOR=$(grep -e "^\[assembly: AssemblyVersion(\"" ../Properties/AssemblyInfo.cs | cut -d'"' -f 2 | cut -d'.' -f 1)
VMINOR=$(grep -e "^\[assembly: AssemblyVersion(\"" ../Properties/AssemblyInfo.cs | cut -d'"' -f 2 | cut -d'.' -f 2)
VBUILD=$(grep -e "^\[assembly: AssemblyVersion(\"" ../Properties/AssemblyInfo.cs | cut -d'"' -f 2 | cut -d'.' -f 3)
ARCHT=$1

mkdir -p $EXEC
mkdir -p $CONFIG
mkdir -p $DEBIAN
mkdir -p $SYSTEMD
mkdir -p $LOGROTATE

cp control $DEBIAN
cp preinst $DEBIAN
cp postinst $DEBIAN
cp prerm $DEBIAN
sed -i s/Version:\ x\.x-x/"Version: $VMAJOR.$VMINOR-$VBUILD"/ $DEBIAN/control
sed -i s/Architecture:\ any/"Architecture: $ARCHT"/ $DEBIAN/control
chmod 755 $DEBIAN -R

cp loramap.service $SYSTEMD
chmod 644 $SYSTEMD/loramap.service

cp $OUTPUT/*.exe $EXEC/
#cp $OUTPUT/gpio.2.44 $EXEC/
#cp $OUTPUT/libwiringPi.so.2.44 $EXEC/
find $OUTPUT -name \*.dll -exec cp {} $EXEC/ \;
chmod 644 $EXEC/*
chmod 755 $EXEC

cp $OUTPUT/resources $EXEC -r
sed -i s/"<div id=\"version\">vx.x.x"/"<div id=\"version\">$VMAJOR.$VMINOR.$VBUILD"/ $EXEC/resources/index.html

cp $OUTPUT/config-example/* $CONFIG
chmod 644 $CONFIG/*
chmod 755 $CONFIG

cp loramap-logrotate $LOGROTATE/loramap
chmod 644 $LOGROTATE/*

dpkg-deb --build $ROOT
mv $HOMEDIR/deb.deb ../../../Builds/"$ARCHT-loramap_$VMAJOR.$VMINOR-$VBUILD.deb"
rm $HOMEDIR/deb -r