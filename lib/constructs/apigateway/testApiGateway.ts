import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { MyLambdaFunction } from '../lambda/testLambda';

export class MyApiGateway extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the Lambda function
    const myLambda = new MyLambdaFunction(this, 'MyLambdaFunction');

    // Create API Gateway Rest API
    const api = new apigateway.LambdaRestApi(this, 'MyApiGateway', {
      handler: myLambda.lambdaFunction,  // Connect API Gateway to the Lambda function
      proxy: false,  // Do not use Lambda proxy integration, manage routes manually
    });

    // Define a resource and method for the API
    const items = api.root.addResource('items');
    items.addMethod('GET');  // GET /items - linked to the Lambda
    items.addCorsPreflight({
        allowOrigins: apigateway.Cors.ALL_ORIGINS,  // Allow all origins (adjust as necessary)
        allowMethods: ['GET'],  // Allow only GET method (adjust as necessary)
      });
      
  }
}
