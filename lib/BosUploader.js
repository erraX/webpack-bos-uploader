var Promise = require('promise');
var bce = require('baidubce-sdk');

function BosUploaderPlugin (options) {
    this.options = options;
}

BosUploaderPlugin.prototype.apply = function(compiler) {
    var me = this;

    compiler.plugin('after-emit', function (compilation, callback) {
        var assets = compilation.assets;
        var hash = compilation.hash;
        var options = me.options;
        var bucket = options.bucket;
        var prefix = options.prefix;
        var path = prefix[prefix.length - 1] === '/' ? prefix : prefix + '/';

        var promises = Object.keys(assets)
            .filter(function (fileName) {
                return assets[fileName].emitted;
            })
            .map(function (fileName) {
                var asset = assets[fileName];
                var key = path + fileName;
                var promise = new Promise(function (resolve, reject) {
                    var begin = Date.now();
                    me.putObject2BOS(
                        me.options.bucket,
                        key,
                        asset.existsAt
                    )
                    .then(resolve({
                        duration: (Date.now() - begin) + 'ms',
                        file: key
                    }))
                    .catch(reject);
                });

                return promise;
            });

        Promise
            .all(promises)
            .then(function (res) {
                res.map(function (item) {
                    console.log(item.file + ' ' + item.duration);
                });
                callback();
            })
            .catch(function (err) {
                callback(err);
            });
    });
};

BosUploaderPlugin.prototype.putObject2BOS = function (bucketName, key, fileName) {
    var bosClientConfig = {
        credentials: {
            ak: this.options.ak,
            sk: this.options.sk
        },
        endpoint: this.options.endpoint
    };

    var client = new bce.BosClient(bosClientConfig);
    return client.putObjectFromFile(bucketName, key, fileName);
};

module.exports = BosUploaderPlugin;