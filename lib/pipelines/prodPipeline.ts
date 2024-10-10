import * as pipelines from 'aws-cdk-lib/pipelines';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NoporBackendStage } from '../NoporBackendStage';

export class ProdPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Set up the pipeline with GitHub source
    const pipeline = new pipelines.CodePipeline(this, 'ProdPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('roncojon/nopor-backend', 'master'),  // Use your GitHub repository
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      }),
    });

    // Add stages for production
    pipeline.addStage(new NoporBackendStage(this, 'ProdStage', {
      env: { account: '183631301414', region: 'us-west-2' }
    }));
  }
}
