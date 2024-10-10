#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevPipelineStack } from '../lib/pipelines/devPipeline';
import { ProdPipelineStack } from '../lib/pipelines/prodPipeline';

const app = new cdk.App();

// Instantiate the production pipeline
new ProdPipelineStack(app, 'ProdPipelineStack', {
  env: { account: '183631301414', region: 'us-west-2' }
});

// Instantiate the development pipeline
new DevPipelineStack(app, 'DevPipelineStack', {
  env: { account: '183631301414', region: 'us-west-2' }
});
