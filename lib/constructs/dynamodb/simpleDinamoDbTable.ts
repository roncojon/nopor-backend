import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MainDatabase extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    // Create a DynamoDB table with provisioned capacity
    this.table = new dynamodb.Table(this, id, {
      tableName: tableName,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }, // Define partition key
      billingMode: dynamodb.BillingMode.PROVISIONED,  // Use provisioned billing mode
      readCapacity: 25,  // Max out free tier limit for read capacity
      writeCapacity: 25  // Max out free tier limit for write capacity
    });
  }
}
