const {client, options} = require('./utils/common');

let filter = options.filter;

function getKeysAndBindEvent(cursor, filter = filter) {
    let content = $(".content");
    client.scan(cursor, 'MATCH', filter, 'COUNT', '20', function (err, result) {
        if (err) {
            throw err;
        }
        cursor = result[0];
        let values = result[1];
        values.map(function (val) {
            $('.nav-left').append('<div><a class="key-list" href="javascript:;" data-key="' + val + '">' + val + '</a><div>');
        });
        if (parseInt(cursor) !== 0) {
            $('.nav-left').append('<div><a class="load-more" href="javascript:;" data-current-cursor="' + cursor + '">加载更多...</a><div>');
            $('.nav-left .load-more').on('click', function () {
                $(this).parent().remove();
                getKeysAndBindEvent(cursor);
            });
        }
        $('.key-list').off('click').on('click', function () {
            content.html('');
            let key = $(this).data('key');
            client.type(key, function (err, type) {
                if (err) {
                    throw err;
                }
                switch (type.toLowerCase()) {
                    case 'string':
                        client.get(key, function (err, value) {
                            content.append('<div>' + $('<div></div>').text(value).html() + '</div>');
                        });
                        break;
                    case 'hash':
                        client.hgetall(key, function (err, value) {
                            if (err) throw err;
                            for (let obj in value) {
                                content.append('<div>' + obj + ':' + $('<div></div>').text(value[obj]).html() + '</div>');
                            }
                        });
                        break;
                    case 'list':
                        client.lrange(key, 0, -1, function (err, values) {
                            if (err) throw err;
                            values.map(function (v, k) {
                                content.append('<div>' + k + ':' + v + '</div>');
                            });
                        });
                        break;
                    case 'set':
                    case 'zset':
                        client.smembers(key, function (err, values) {
                            if (err) throw err;
                            values.map(function (v, k) {
                                content.append('<div>' + k + ':' + v + '</div>');
                            });
                        });
                        break;
                    default:
                        content.append('<div>Nothing to show.</div>');
                        break;
                }
            });
        });
    });
}

getKeysAndBindEvent(0);