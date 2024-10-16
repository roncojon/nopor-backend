import * as cdk from 'aws-cdk-lib'; 
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam'; // Import IAM for permissions
import { TestLambdaFunction } from '../lambdas/test/testLambdaConstruct';
import { PresignedUrlLambdaStack } from '../lambdas/createNoporData/returnPresignedUrlS3Lambda';
import { CreateSerie } from '../lambdas/createNoporData/createSerie';

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

    const createSerieLambda = new CreateSerie(this, 'CreateSerieLambda', bucketName);

    // Add S3 permissions
    createSerieLambda.lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`arn:aws:s3:::${bucketName}/Series/*`],  // Replace bucketName with your actual bucket name
    }));

    // Add DynamoDB permissions (Fix for the AccessDeniedException)
    createSerieLambda.lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:PutItem'],
      resources: [`arn:aws:dynamodb:us-west-1:183631301414:table/SerieDatabase-dev`],  // DynamoDB Table ARN
    }));

    // Add a POST method for the /series endpoint
    const seriesResource = api.root.addResource('series');
    
    // Reference the lambdaFunction property inside the CreateSerie construct
    seriesResource.addMethod('POST', new apigateway.LambdaIntegration(createSerieLambda.lambdaFunction), {
      requestParameters: {
        'method.request.header.Content-Type': true,  // Ensure content-type is provided
      },
    });

    // Add CORS configuration for /series
    seriesResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins
      allowMethods: ['POST', 'OPTIONS'],  // Allow POST and preflight OPTIONS method
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,  // Allow default headers
      allowCredentials: true,  // If you need credentials (e.g., cookies, tokens) to be passed
    });
  }
}
