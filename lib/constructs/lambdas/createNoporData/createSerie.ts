import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';  // Import DynamoDB

export class CreateSerie extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, bucketName: string) {
    super(scope, id);

    // Reference the DynamoDB table
    const seriesTable = dynamodb.Table.fromTableName(this, 'SeriesTable', "SeriesTable-" + process.env.STAGE || 'SeriesTable-dev');

    // Create Lambda function for handling the upload
    this.lambdaFunction = new lambda.Function(this, 'UploadSeriesLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',  // Adjust if your handler is in a different file
      // code: lambda.Code.fromAsset('lambda'),  // Directory where your lambda code lives
      code: lambda.Code.fromAsset(path.join(__dirname, '../createNoporData/assets/createSerie.zip')), // Path to your zipped Lambda
      environment: {
        BUCKET_NAME: bucketName,
        SERIE_TABLE_NAME: process.env.SERIE_TABLE_NAME || 'SerieDatabase-dev',
      },
      memorySize: 1024,
      timeout: cdk.Duration.minutes(3),
    });
    seriesTable.grantReadWriteData(this.lambdaFunction);
  }
}
