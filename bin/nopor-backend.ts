#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DevPipelineStack2 } from '../lib/pipelines/devPipeline';
import { ProdPipelineStack } from '../lib/pipelines/prodPipeline';

const app = new cdk.App();

// Instantiate the production pipeline
new ProdPipelineStack(app, 'ProdPipelineStack', {
  env: { account: '183631301414', region: 'us-west-1' }
});

// Instantiate the development pipeline
new DevPipelineStack2(app, 'DevPipelineStack2', {
  env: { account: '183631301414', region: 'us-west-1' }
});
