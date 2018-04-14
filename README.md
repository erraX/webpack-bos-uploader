# webpack-bos-uploader
Upload assets to bos.

## Installation
``` javascript
npm i --save webpack-bos-uploader
```

## Usage
``` javascript

// webpack config
const WebpackBosUploader = require('webpack-bos-uploader');

module.exports = {
    // ...
    plugins: [
        new WebpackBosUploader({
            ak: 'xxxx',
            sk: 'xxxxx',
            endpoint: 'http://xx.bcebos.com',
            bucker: 'bucket',
            prefix: 'test'
        })
    ]
};
```