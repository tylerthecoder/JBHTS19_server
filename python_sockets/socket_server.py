import socketio
import asyncio
import aiohttp

sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print("Connected")
    sio.emit('setAsPython')


@sio.on('deviceUpdate')
def on_message(data):
    print('message received with ', data)


@sio.on('disconnect')
def on_disconnect():
    print('disconnected from server')


def main():
    sio.connect('http://ec2-18-232-100-162.compute-1.amazonaws.com:3000')
    sio.wait()

#asyncio.get_event_loop().run_until_complete(main())
main()
