import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class TestLambdaFunction extends Construct {
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
      entry: path.join(__dirname, 'index.ts'), // or index.ts for TypeScript
      // entry: path.join(__dirname, '../../lambdas/createNoporLambdav2/index.js'), // or index.ts for TypeScript
      handler: 'handler', // the exported handler function
      runtime: lambda.Runtime.NODEJS_20_X,
    });
  }
}

// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as path from 'path';

// export class MyLambdaFunction extends Construct {
//   public readonly lambdaFunction: lambda.Function;

//   constructor(scope: Construct, id: string, lambdaName: string) {
//     super(scope, id);

//     this.lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
//       runtime: lambda.Runtime.NODEJS_18_X, // or NODEJS_20_X depending on your Node version
//       code: lambda.Code.fromAsset(path.join(__dirname, '../createNoporData/assets/createNoporFfmpegV2.zip')), // Path to your zipped Lambda
//       handler: 'index.handler', // The handler function inside the zip file
//       memorySize: 3000, // Increase if video processing needs more memory
//       timeout: cdk.Duration.minutes(10), // Adjust timeout for longer video processing tasks
//       environment: {
//         FFMPEG_PATH: '/var/task/ffmpeg', // Path where the FFmpeg binary will reside inside Lambda
//       },
//     });
//   }
// }
