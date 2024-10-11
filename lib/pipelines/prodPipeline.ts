import * as pipelines from 'aws-cdk-lib/pipelines';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SecretValue } from 'aws-cdk-lib';
import { NoporBackendStage } from '../NoporBackendStage';

export class ProdPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = 'prod';

    // Set up the pipeline with GitHub source and access token from Secrets Manager
    const pipeline = new pipelines.CodePipeline(this, 'ProdPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('roncojon/nopor-backend', 'master', {
          authentication: SecretValue.secretsManager('GitHubTokenForPipeline')  // Reference the secret by name
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      }),
    });

    // Add stages for production
    pipeline.addStage(new NoporBackendStage(this, 'ProdStage',stage, {
      env: { account: '183631301414', region: 'us-west-1' }
    }));
  }
}
