import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NoporBackendStack } from './NoporBackendStack';

export class NoporBackendStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    // Add your stack to the stage
    new NoporBackendStack(this, 'NoporBackendStack');
  }
}
