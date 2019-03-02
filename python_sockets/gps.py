import requests
import json
import serial

serl = serial.Serial('/dev/ttyACM0', 9600)


def getRate(lat, lon):
    apiKey = 'lZgLIACHh8UM8NQVROxPtUrbZWxoNaje3leasT70'
    r = requests.get('https://developer.nrel.gov/api/utility_rates/v3.json?lat='+lat+'&lon='+lon+'&api_key='+apiKey)
    response = r.json()
    return response['outputs']['commercial']


def sendGPS(lat, lng, rate):
    req = requests.get('http://http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/setLatLng?lat='+lat+'&lng='+lng+'&rate='+rate)
    print(req)

def readGPS():
    serl.read()

def writeSerial(instruction):
    serl.write(instruction.encode())


print(getRate('36.066124','-94.173745'))




