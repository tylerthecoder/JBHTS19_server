#!/bin/sh
echo "Starting python servers..."
sudo python3 read_serial.py & 
sudo python3 socket_server.py & 
