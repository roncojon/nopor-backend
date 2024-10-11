import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { MyLambdaFunction } from '../lambda/testLambda';

export class MyApiGateway extends Construct {
  constructor(scope: Construct, id: string, apiName:string) {
    super(scope, id);

    // const envSuffix = scope.node.tryGetContext('envSuffix'); // Get the environment suffix

    // Create the Lambda function
    const myLambda = new MyLambdaFunction(this, 'LambdaNoporv2Instance0', 'createNoporv2');

    // Create API Gateway Rest API with a unique name per environment
    const api = new apigateway.LambdaRestApi(this, apiName, {
      handler: myLambda.lambdaFunction,  // Connect API Gateway to the Lambda function
      proxy: false,  // Do not use Lambda proxy integration, manage routes manually
      restApiName: apiName,  // Give the API Gateway a unique name based on the environment
    });

    // Define a resource and method for the API
    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items - linked to the Lambda

    // Add CORS configuration
    items.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins (adjust as necessary)
      allowMethods: ['GET'],  // Allow only GET method (adjust as necessary)
    });
  }
}
