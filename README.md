Device as a controller
============================

WebGL demo powered by WebSockets and device accelerometer data to control things on the web.

Clone repo and run:
```
cd websockets-device-controller && npm install && bower install
```

Run server with `node app.js`.

Navigate from the desktop browser to [`http://localhost:3000`](http://localhost:3000). From your device to [`http://localhost:3000/game/`](http://localhost:3000/game/).

Rotate device to control the ball.

<small>Powered by <a href="http://nodejs.org/">Node.js</a>, <a href="https://github.com/mrdoob/three.js/">Three.js</a> and <a href="https://github.com/chandlerprall/Physijs">Physi.js</a></small>
