# photo-mosaic-mgmt-ui
A static single page React JS UI for the [photo-mosaic API service](https://github.com/RobBaldauf/photo-mosaic): 

## Prepare config
Edit the config file [src/config/config.js](src/config/config.js) and set API_SERVER to the IP/Port of your photo-mosaic api server. 
If you enabled authentication for the api replace <API_KEY> with the API_KEY you created for the photo-mosaic API service.

## Run
Install a webserver (e.g. [node http-server](https://www.npmjs.com/package/http-server)) and copy /src to a directory that can be served as static content.

Start your webserver and open the index.html to view the UI.

(If you're planning to run this in a production environment make sure to use HTTPS and set up at least some basic authentication, since the API_KEY is stored in plain text.)

## License
[GPL-3.0 License](LICENSE)
