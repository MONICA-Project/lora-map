#!/bin/bash

HOMEDIR=$HOME
ROOT="$HOMEDIR/deb"
OUTPUT="../bin/Release/netcoreapp3.0"

DEBNAME="loramap"
CSPROJFILE="Lora-Map.csproj"

EXEC="$ROOT/usr/local/bin/$DEBNAME"
CONFIG="$ROOT/etc/$DEBNAME"
SYSTEMD="$ROOT/lib/systemd/system"
LOGROTATE="$ROOT/etc/logrotate.d"

echo "Catch all paths together for $DEBNAME."

DEBIAN="$ROOT/DEBIAN"
VMAJOR=$(grep -e "<Version>" ../$CSPROJFILE | cut -d'>' -f 2 | cut -d'<' -f 1 | cut -d'.' -f 1)
VMINOR=$(grep -e "<Version>" ../$CSPROJFILE | cut -d'>' -f 2 | cut -d'<' -f 1 | cut -d'.' -f 2)
VBUILD=$(grep -e "<Version>" ../$CSPROJFILE | cut -d'>' -f 2 | cut -d'<' -f 1 | cut -d'.' -f 3)
ARCHT=$1

echo "Versionsumber parsed: $VMAJOR.$VMINOR-$VBUILD."

mkdir -p $EXEC
mkdir -p $CONFIG
mkdir -p $DEBIAN
mkdir -p $SYSTEMD
mkdir -p $LOGROTATE

echo "Created directorys."

cp control $DEBIAN/control
cp preinst $DEBIAN
cp postinst $DEBIAN
cp prerm $DEBIAN
sed -i s/Version:\ x\.x-x/"Version: $VMAJOR.$VMINOR-$VBUILD"/ $DEBIAN/control
sed -i s/Architecture:\ any/"Architecture: $ARCHT"/ $DEBIAN/control
chmod 755 $DEBIAN -R

echo "Copy deb control files."

cp "service-$DEBNAME" "$SYSTEMD/$DEBNAME.service"
chmod 644 $SYSTEMD/"$DEBNAME.service"

echo "Copy $DEBNAME.service to $SYSTEMD."

cp $OUTPUT/*.runtimeconfig.json $EXEC/
find $OUTPUT -name \*.dll -exec cp {} $EXEC/ \;
chmod 644 $EXEC/*
chmod 755 $EXEC

echo "Copy programm files to $EXEC."

cp $OUTPUT/resources $EXEC -r
sed -i s/"<div id=\"version\">vx.x.x"/"<div id=\"version\">$VMAJOR.$VMINOR.$VBUILD"/ $EXEC/resources/index.html

echo "Change Versionnumber in index.html"

cp $OUTPUT/config-example/* $CONFIG
chmod 644 $CONFIG/*
chmod 755 $CONFIG

echo "Copy example-conf to $CONFIG."

cp "logrotate-$DEBNAME" "$LOGROTATE/$DEBNAME.conf"
chmod 644 $LOGROTATE/*

echo "Copy $DEBNAME.conf to $LOGROTATE."

dpkg-deb --build $ROOT

echo "Build deb packet."


TARGETFILE="$DEBNAME""_$VMAJOR.$VMINOR-$VBUILD.deb"
mv $HOMEDIR/deb.deb "../../../Builds/$ARCHT-$TARGETFILE"

echo "Move $ARCHT-$TARGETFILE to Builds."

rm $HOMEDIR/deb -r

echo "Remove $HOMEDIR/deb."

echo "##[set-output name=debuilderfile;]$TARGETFILE"
echo "##[set-output name=builddaterelease;]$(date +"%F_%H%M%S")"