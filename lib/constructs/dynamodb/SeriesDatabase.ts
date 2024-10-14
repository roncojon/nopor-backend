import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface SeriesData { 
  serieId: string;
  title: string;
  releaseDate: string;
  thumbnailUrl: string;
  description: string;
  totalEpisodes: number;
  lastModified: string;
  tags: string
}

export class SeriesDatabase extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    // Create a DynamoDB table with 'videoId' as the partition key
    this.table = new dynamodb.Table(this, 'SerieTable', {
      tableName: tableName,
      partitionKey: { name: 'serieId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // First deploy only this GSI
    this.table.addGlobalSecondaryIndex({
      indexName: 'SerieTitle',
      partitionKey: { name: 'title', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    //  this.table.addGlobalSecondaryIndex({
    //   indexName: 'ReleaseDate',
    //   partitionKey: { name: 'releaseDate', type: dynamodb.AttributeType.STRING },
    //   projectionType: dynamodb.ProjectionType.ALL,
    // });

    //  this.table.addGlobalSecondaryIndex({
    //   indexName: 'LastModified',
    //   partitionKey: { name: 'lastModified', type: dynamodb.AttributeType.STRING },
    //   projectionType: dynamodb.ProjectionType.ALL,
    // });

    // this.table.addGlobalSecondaryIndex({
    //   indexName: 'Tags',
    //   partitionKey: { name: 'tags', type: dynamodb.AttributeType.STRING },
    //   projectionType: dynamodb.ProjectionType.ALL,
    // });
  }
}
