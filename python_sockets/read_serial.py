import time
import serial
from gps import getRate, sendGPS, createDevice

serialport = None
while not serialport:
    try:
        serialport = serial.Serial("/dev/ttyACM1", 9600, timeout=0.5)
        #print(serialport)
    except serial.serialutil.SerialException:
        continue

time.sleep(2)
serialport.write('12'.encode(encoding="ascii"))

lat_lng = []
while True:    
    if ( serialport.inWaiting() > 0): 
        if not lat_lng:
            msg = serialport.readline().decode(encoding="ascii")
            lat_lng = msg.split()
            rate = getRate(lat_lng[0], lat_lng[1])
            sendGPS(lat_lng[0], lat_lng[1], str(rate))

        else:
            discovered = serialport.readline().decode(encoding='ascii')
            createDevice()
    

# for all of values in coordinates, trim and convert to integers