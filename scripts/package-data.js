const fs = require('fs');

module.exports = (callback) => {
    fs.readFile(
        'package.json',
        (err, json) => {
            if (err) {
                callback('{}');
            }

            callback(JSON.parse(json.toString()));
        }
    );
}
