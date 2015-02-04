Hotel Backend application
=========================

This is the backend application for the appcelerator exercise, using Express.js
as a backend framework.

## Requirements

Install Node.js (`npm`) by downloading it from the
[official page](http://nodejs.org/).

## How to run

While standing in the root folder of the project, install dependencies by runing

    $ npm install

Then, to run the project as a service in your local machine, run:

    $ DEBUG=hotelBackend:* ./bin/www

To change the app's listening port, edit line 15 of `bin/www`.

    var port = normalizePort(process.env.PORT || '3000');

The default value is port `3000`.