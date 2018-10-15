'use strict';

import fs from 'fs-extra';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const upload = (filepath, key) => {
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: fs.createReadStream(filepath),
  };

  return s3.upload(config)
    .promise()
    .then(res => {
      return fs.remove(filepath)
        .then(() => {
          res.Location;
        });
    })
    .catch(err => {
      return fs.remove(filepath)
        .then(() => Promise.reject(err));
    });
};

export default { upload };