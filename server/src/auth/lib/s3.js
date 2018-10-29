'use strict';

import fs from 'fs-extra';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const upload = (filepath, key) => {
  let config = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(filepath),
  };
  console.log('this is S3', s3);
  console.log('right before actual upload call');
  return s3.upload(config)
    .promise()
    .then(res => {
      console.log('URL:', res.Location);
      return fs.remove(filepath)
        .then(() => res.Location);
    })
    .catch(err => {
      console.error('ERROR!:', err);
      return fs.remove(filepath)
        .then(() => Promise.reject(err));
    });
};

export default { upload };