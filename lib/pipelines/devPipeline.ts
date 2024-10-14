import * as pipelines from 'aws-cdk-lib/pipelines';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SecretValue } from 'aws-cdk-lib';
import { NoporBackendStage } from '../NoporBackendStage';

export class DevPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     // Create environment variables
     const environment = {
      STAGE: 'dev',
      BUCKET_NAME: `nopor-bucket-0-dev`,
      MAIN_TABLE_NAME: 'MainTable-dev'
    };

    // Development Pipeline
    const pipeline = new pipelines.CodePipeline(this, 'DevPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('roncojon/nopor-backend', 'develop', {
            authentication: SecretValue.secretsManager('GitHubTokenForPipeline')  // Reference the secret by name
          }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ],
        env: environment
      }),
    });

    // Add the development environment stage
    pipeline.addStage(new NoporBackendStage(this, 'DevStage', {
      env: { account: '183631301414', region: 'us-west-1' }
    }));
  }
}
