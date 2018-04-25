const fs = require('fs');

function writeJsonToFile(options, filename) {
    fs.open(filename, 'w+', '0644', function (err, fd) {
        if (err) throw err;
        fs.write(fd, JSON.stringify(options), function (err, written, string) {
            if (err) throw err;
            fs.close(fd, function (err) {
                if (err) throw err;
            });
        });
    });
}

function renderHtml(html) {
    document.write(html);
}

module.exports = {writeJsonToFile, renderHtml};