import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class SimpleS3Bucket extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, bucketName: string) {
    super(scope, id);

    // const envSuffix = scope.node.tryGetContext('envSuffix'); // Use environment suffix like 'prod' or 'dev'

    // Create the S3 bucket with a dynamic name
    this.bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: `${bucketName}-${process.env.STAGE}`,  // Add environment suffix to bucket name
      versioned: true,
    });
  }
}


