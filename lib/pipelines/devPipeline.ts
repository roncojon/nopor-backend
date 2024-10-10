// lib/pipeline-dev-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { NoporBackendStage } from '../NoporBackendStage';

export class DevPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the same CodeCommit repository
    const repo = codecommit.Repository.fromRepositoryName(this, 'Repo', 'MyCdkRepo');

    // Development Pipeline
    const pipeline = new pipelines.CodePipeline(this, 'DevPipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('roncojon/nopor-backend', 'master'),  // Use your GitHub repository
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ]
      }),
    });

    // Add the development environment stage
    pipeline.addStage(new NoporBackendStage(this, 'DevStage', {
      env: { account: '183631301414', region: 'us-west-2' }
    }));
  }
}
