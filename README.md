J'ai fait ça à l'arrache, juste pour essayer, c'est vraiment ultra provisoir.

## Keywords:


PostGis
GeoJSON
NodeJS

Client:
VanillaJS
Leaflet + Leaflet.draw
(https://github.com/Leaflet/Leaflet.draw)
D3.JS

## Run it locally


### Running the client

**Method 1**

```
python -m SimpleHTTPServer
```

Then you should be able to visit http://localhost:8000

** Method 2**

Just open **'index.html'** with your Web-browser (Chrome, Firefox, ..)


### Running the server

**Don't forget to run the server !

```
$ cd Server
```

First modify **'config.js'** with your own DB credentials
Or you can also create a .env at Server's root with the fields (DB_HOST, DB_USER, DB_PATH, DB_PORT, DB_NAME)

Then

```
$ npm install
```

And finally

```
$ npm start
```
