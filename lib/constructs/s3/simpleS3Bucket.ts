import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class SimpleS3Bucket extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, bucketName: string) {  // Accept bucketName as a parameter
    super(scope, id);

    // Create an S3 bucket with a dynamic name
    this.bucket = new s3.Bucket(this, id, {   // Use 'id' as the logical ID
      versioned: false,
      bucketName: bucketName  // Use the dynamic bucketName provided
    });
  }
}
