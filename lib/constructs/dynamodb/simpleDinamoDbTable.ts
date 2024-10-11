import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class MainDatabase extends Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    // const envSuffix = scope.node.tryGetContext('envSuffix'); // Use environment suffix

    // Create a DynamoDB table with a dynamic name
    this.table = new dynamodb.Table(this, 'MainTable', {
      tableName: `${tableName}-${process.env.STAGE}`,  // Add environment suffix to table name
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 25,
      writeCapacity: 25
    });
  }
}
