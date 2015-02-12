/*eslint no-process-exit: 0*/
'use strict';

var path = require('path');
var Server = require('norman-app-server').Server;
var configFile = path.join(__dirname, 'config.json');

var k, n, admin = null;
for (k = 2, n = process.argv.length; k < n; ++k) {
    if ((process.argv[k] === '--config') && (k < n - 1)) {
        configFile = process.argv[k + 1];
    }
    if (process.argv[k] === '--create-admin') {
        if (k < n - 2) {
            admin = {
                name: process.argv[k + 1],
                email: process.argv[k + 2],
                password: process.argv[k + 3] || null
            };
        }
        else {
            console.log('Insufficient create-admin parameters. Please provide name and email.');
            process.exit(1);
        }
    }
}

Server.start(configFile).then(function () {
    // Create Admin user (required for Admin section)
    if (admin) {
        require('norman-auth-server').createAdmin(admin, function (err) {
            if (err) {
                if (err.errors && err.errors.email) err = err.errors.email.message;
                return console.error('\nERROR: ' + err + '\n');
            }

            console.log('\nAdmin created!\n');
        });
    }
});
