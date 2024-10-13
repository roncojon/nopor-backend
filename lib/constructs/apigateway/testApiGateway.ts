import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { TestLambdaFunction } from '../lambdas/test/testLambdaConstruct';
import { PresignedUrlLambdaStack } from '../lambdas/createNoporData/returnPresignedUrlS3Lambda';
// import { PresignedUrlLambdaStack } from './presignedUrlLambdaStack'; // Import your Presigned URL Lambda Stack

export class MyApiGateway extends Construct {
  constructor(scope: Construct, id: string, apiName: string) {
    super(scope, id);

    // Existing Lambda function for the /items endpoint
    const myLambda = new TestLambdaFunction(this, 'LambdaNoporv2Instance0', 'createNoporv2');

    // Create API Gateway Rest API with a unique name
    const api = new apigateway.RestApi(this, apiName, {
      restApiName: apiName,
      description: 'API Gateway for NoporLand',
    });

    // Define the /items resource and GET method
    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items - linked to the existing Lambda

    // Add CORS configuration for /items
    items.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins
      allowMethods: ['GET'],  // Allow only GET method
    });

    // New Lambda function for the /get-presigned-url endpoint
    const presignedUrlLambdaStack = new PresignedUrlLambdaStack(this, 'PresignedUrlLambdaStack');

    // Define a new resource for /get-presigned-url
    const getPresignedUrlResource = api.root.addResource('get-presigned-url');

    // Add POST method to /get-presigned-url, linked to the new Lambda
    getPresignedUrlResource.addMethod('POST', new apigateway.LambdaIntegration(presignedUrlLambdaStack.lambdaFunction));

    // Add CORS configuration for /get-presigned-url
    getPresignedUrlResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins
      allowMethods: ['POST'],  // Allow only POST method
    });
  }
}
