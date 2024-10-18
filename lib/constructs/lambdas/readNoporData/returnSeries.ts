import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';  // Import DynamoDB

export class ReadSeriesLambdaStack extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const seriesTable = dynamodb.Table.fromTableName(this, 'SeriesTable', "SeriesTable-" + process.env.STAGE || 'SeriesTable-dev');

    // Create the Lambda function to generate the pre-signed URL
    this.lambdaFunction = new lambda.Function(this, 'PresignedUrlLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // or NODEJS_20_X depending on your Node version
      architecture: lambda.Architecture.ARM_64, // Set the architecture to arm64
      code: lambda.Code.fromAsset(path.join(__dirname, '../readNoporData/assets/returnSeries.zip')), // Path to your Lambda code
      handler: 'index.handler',
      environment: {
        STAGE: process.env.STAGE || 'dev', // Pass stage as an environment variable
        BUCKET_NAME: process.env.BUCKET_NAME || 'nopor-bucket-0-dev', // Pass the bucket name as an environment variable
      },
    });
    seriesTable.grantReadData(this.lambdaFunction);
  }
}

