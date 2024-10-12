import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MainDatabase extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    // Create a DynamoDB table with 'videoId' as the partition key
    this.table = new dynamodb.Table(this, 'MainTable', {
      tableName: tableName,
      partitionKey: { name: 'videoId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // First deploy only this GSI
    this.table.addGlobalSecondaryIndex({
      indexName: 'TagsIndex',
      partitionKey: { name: 'tags', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // GSI for 'serie'
    this.table.addGlobalSecondaryIndex({
      indexName: 'SerieIndex',
      partitionKey: { name: 'serie', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
    });

      // GSI for 'lastModified'
      this.table.addGlobalSecondaryIndex({
        indexName: 'LastModifiedIndex',
        partitionKey: { name: 'lastModified', type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
      });

    //     // GSI for 'duration'
    //     this.table.addGlobalSecondaryIndex({
    //       indexName: 'DurationIndex',
    //       partitionKey: { name: 'duration', type: dynamodb.AttributeType.NUMBER },
    //       projectionType: dynamodb.ProjectionType.ALL,  // Projects all attributes
    //     });
  }
}
