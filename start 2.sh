#!/usr/bin/bash

# Default to UTC if no TIMEZONE env variable is set
echo "Setting time zone to Europe/London"
# This only works on Debian-based images
echo Europe/London > /etc/timezone dpkg-reconfigure tzdata
