import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';

export class CreateNoporDataLambda extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Define your S3 bucket (assuming it's already created in the CDK or imported)
    const bucket = s3.Bucket.fromBucketName(
      this,
      'MyBucket',
      process.env.BUCKET_NAME || 'nopor-bucket-0-dev' // Replace with your actual bucket name
    );

    // Create the Lambda function
    this.lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X, // or NODEJS_20_X depending on your Node version
      code: lambda.Code.fromAsset(path.join(__dirname, '../createNoporData/assets/createNoporFfmpegV2.zip')), // Path to your zipped Lambda
      handler: 'index.handler', // The handler function inside the zip
      environment: {
        FFMPEG_PATH: '/var/task/ffmpeg', // Path where the FFmpeg binary will reside inside Lambda
      },
      memorySize: 3000, // Increase memory size if necessary for video processing
      timeout: cdk.Duration.minutes(10), // Increase timeout if necessary for video processing
    });

    // Add S3 event notification to trigger Lambda on object creation in MainVideos/
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT, // Trigger on object creation
      new s3n.LambdaDestination(this.lambdaFunction),
      { prefix: 'MainVideos/' } // Only trigger on objects within the MainVideos/ folder
    );
  }
}
