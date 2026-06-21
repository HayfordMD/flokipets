import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const senderEmail = process.env.SENDER_EMAIL || 'mdhayford@flokipets.com';
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'mdhayford@flokipets.com';

    const sendSignupEmailLambda = new lambdaNodejs.NodejsFunction(this, 'SendSignupEmailLambda', {
      entry: path.join(__dirname, 'functions', 'send-signup-email.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        SENDER_EMAIL: senderEmail,
        RECIPIENT_EMAIL: recipientEmail,
      },
    });

    sendSignupEmailLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    }));

    const functionUrl = sendSignupEmailLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ['*'],
      }
    });

    new cdk.CfnOutput(this, 'SendSignupEmailUrl', {
      value: functionUrl.url,
      description: 'The URL for the send-signup-email Lambda function',
    });
  }
}
