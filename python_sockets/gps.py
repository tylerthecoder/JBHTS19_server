import requests
import json
import serial


def getRate(lat, lon):
    apiKey = 'lZgLIACHh8UM8NQVROxPtUrbZWxoNaje3leasT70'
    r = requests.get('https://developer.nrel.gov/api/utility_rates/v3.json?lat='+lat+'&lon='+lon+'&api_key='+apiKey)
    response = r.json()
    return response['outputs']['commercial']


def sendGPS(lat, lng, rate):
    req = requests.get('http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/setLatLng?lat='+lat+'&lng='+lng+'&rate='+rate)
    print(req)


def writeSerial(instruction):    
    serl = serial.Serial('/dev/ttyACM1', 9600)
    serl.write(instruction.encode(encoding="ascii"))

def createDevice():
    r = requests.get('http://ec2-18-232-100-162.compute-1.amazonaws.com:3000/device/new')
    print(r)



    






