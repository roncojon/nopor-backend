import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam'; // Import IAM for permissions
import { TestLambdaFunction } from '../lambdas/test/testLambdaConstruct';
import { PresignedUrlLambdaStack } from '../lambdas/createNoporData/returnPresignedUrlS3Lambda';

export class MyApiGateway extends Construct {
  constructor(scope: Construct, id: string, apiName: string, bucketName: string) {  
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
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,  // Allow default headers
    });

    // New Lambda function for the /get-presigned-url endpoint
    const presignedUrlLambdaStack = new PresignedUrlLambdaStack(this, 'PresignedUrlLambdaStack');

    // Add IAM permissions to the Lambda role to allow S3 access
    presignedUrlLambdaStack.lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`arn:aws:s3:::${bucketName}/MainVideos/*`],  // Replace bucketName with your actual bucket name
    }));

    // Define a new resource for /get-presigned-url
    const getPresignedUrlResource = api.root.addResource('get-presigned-url');

    // Add POST method to /get-presigned-url, linked to the new Lambda
    getPresignedUrlResource.addMethod('POST', new apigateway.LambdaIntegration(presignedUrlLambdaStack.lambdaFunction));

    // Add CORS configuration for /get-presigned-url
    getPresignedUrlResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins
      allowMethods: ['POST', 'OPTIONS'],  // Allow POST and preflight OPTIONS method
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,  // Allow default headers
      allowCredentials: true,  // If you need credentials (e.g., cookies, tokens) to be passed
    });
  }
}
