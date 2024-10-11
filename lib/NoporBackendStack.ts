import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SimpleS3Bucket } from './constructs/s3/simpleS3Bucket';
import { MainDatabase } from './constructs/dynamodb/simpleDinamoDbTable';
import { MyApiGateway } from './constructs/apigateway/testApiGateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NoporBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const STAGE = process.env.STAGE || "dev";

    // The code that defines your stack goes here
    // Use the S3 construct
    new SimpleS3Bucket(this, 'S3BucketInstance0', `nopor-bucket-0-${STAGE}`);

     // DynamoDB table
     new MainDatabase(this, 'DynamoDbTableInstance0', `MainDatabase-${STAGE}`);  // Create DynamoDB table with the name 'MainDatabase'
     
      // Deploy the API Gateway with Lambda
    new MyApiGateway(this, `ApiGatewayInstance0`, `NoporApiGateway-${STAGE}`);
    
    // example resource
    // const queue = new sqs.Queue(this, 'NoporBackendQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
