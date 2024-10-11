import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MainDatabase extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    // Create a DynamoDB table with 'videoId' as the partition key in on-demand mode
    this.table = new dynamodb.Table(this, 'MainTable', {
      tableName: `${tableName}-${process.env.STAGE}`,
      partitionKey: { name: 'videoId', type: dynamodb.AttributeType.STRING },  // videoId as partition key
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Switch to on-demand mode
    });

    // Adding Global Secondary Indexes (GSIs)

    // GSI for 'tags' (workaround: assuming 'tags' is stored as a comma-separated string)
    this.table.addGlobalSecondaryIndex({
      indexName: 'TagsIndex',
      partitionKey: { name: 'tags', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
    });

    // // GSI for 'series'
    // this.table.addGlobalSecondaryIndex({
    //   indexName: 'SeriesIndex',
    //   partitionKey: { name: 'series', type: dynamodb.AttributeType.STRING },
    //   projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
    // });

    // // GSI for 'lastModified'
    // this.table.addGlobalSecondaryIndex({
    //   indexName: 'LastModifiedIndex',
    //   partitionKey: { name: 'lastModified', type: dynamodb.AttributeType.STRING },
    //   projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
    // });
  }
}
