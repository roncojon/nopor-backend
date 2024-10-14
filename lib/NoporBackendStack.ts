import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SimpleS3Bucket } from './constructs/s3/simpleS3Bucket';
import { MainDatabase } from './constructs/dynamodb/MainDatabase';
import { MyApiGateway } from './constructs/apigateway/testApiGateway';
import { CreatePreviewAndThumbnail } from './constructs/lambdas/createNoporData/createPreviewAndThumbnail';
import { SeriesDatabase } from './constructs/dynamodb/SeriesDatabase';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NoporBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const STAGE = process.env.STAGE || "dev";
    const BUCKET_NAME = process.env.BUCKET_NAME || "nopor-bucket-0-dev";
    // The code that defines your stack goes here
    // Use the S3 construct
    new SimpleS3Bucket(this, 'S3BucketInstance0', `nopor-bucket-0-${STAGE}`);

     // DynamoDB table
     new MainDatabase(this, 'DynamoDbTableInstance0', `MainDatabase-${STAGE}`);  // Create DynamoDB table with the name 'MainDatabase'
     new SeriesDatabase(this, 'DynamoDbTableInstance1', `SerieDatabase-${STAGE}`);  // Create DynamoDB table with the name 'MainDatabase'
     
      // Deploy the API Gateway with Lambda
    new MyApiGateway(this, `ApiGatewayInstance0`, `NoporApiGateway-${STAGE}`, BUCKET_NAME);
    
    new CreatePreviewAndThumbnail(this, 'CreateNoporDataLambdaInstance0' )
    // example resource
    // const queue = new sqs.Queue(this, 'NoporBackendQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
