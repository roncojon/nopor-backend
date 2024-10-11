import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class MyLambdaFunction extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, lambdaName: string) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, lambdaName, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/createNoporLambdav2')), // Path to your lambda folder
      handler: 'index.handler', // File name and exported function name
    });
  }
}
