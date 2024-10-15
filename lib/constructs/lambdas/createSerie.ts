import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class CreateSerie extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, bucketName: string) {
    super(scope, id);

    // Create Lambda function for handling the upload
    this.lambdaFunction = new lambda.Function(this, 'UploadSeriesLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'uploadSeries.handler',  // Adjust if your handler is in a different file
      code: lambda.Code.fromAsset('lambda'),  // Directory where your lambda code lives
      environment: {
        BUCKET_NAME: bucketName,
        TABLE_NAME: 'SerieDatabase',  // Adjust to the actual table name
      },
      memorySize: 1024,
      timeout: cdk.Duration.seconds(300),
    });
  }
}
