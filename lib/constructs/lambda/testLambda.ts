import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class MyLambdaFunction extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Hello from Lambda!' }),
          };
        };
      `),
      handler: 'index.handler',
    });
  }
}
