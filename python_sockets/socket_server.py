import socketio
import gps
sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print("Connected")
    sio.emit('setAsPython')


@sio.on('deviceUpdate')
def on_message(data):
    print('message received with ', data)
    deviceId = data['deviceId']*10
    deviceState = data['deviceState']
    gps.writeSerial(str(deviceId+deviceState))


@sio.on('disconnect')
def on_disconnect():
    print('disconnected from server')


def main():
    sio.connect('http://ec2-18-232-100-162.compute-1.amazonaws.com:3000')
    sio.wait()

# coords = gps.readGPS()
coords = ['36.066124','-94.173745']
rate = gps.getRate(coords[0], coords[1])
gps.sendGPS(coords[0], coords[1], rate)
main()
