import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class MyLambdaFunction extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, lambdaName: string) {
    super(scope, id);

    // this.lambdaFunction = new lambda.Function(this, lambdaName, {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/createNoporLambdav2')), // Path to your lambda folder
    //   // code: lambda.Code.fromAsset(path.join(__dirname, '../../lambdas/createNoporLambdav2')),
    //   handler: 'index.handler', // File name and exported function name
    // });
    this.lambdaFunction = new NodejsFunction(this, 'MyLambdaFunction', {
      entry: path.join(__dirname, './lambdas/createNoporLambdav2/index.js'), // or index.ts for TypeScript
      // entry: path.join(__dirname, '../../lambdas/createNoporLambdav2/index.js'), // or index.ts for TypeScript
      handler: 'handler', // the exported handler function
      runtime: lambda.Runtime.NODEJS_18_X,
    });
  }
}
