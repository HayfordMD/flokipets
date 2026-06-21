import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Backend from '../lib/backend-stack';

test('SendSignupEmail Lambda Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'index.handler',
    Runtime: 'nodejs20.x'
  });

  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            "ses:SendEmail",
            "ses:SendRawEmail"
          ],
          Effect: "Allow",
          Resource: "*"
        }
      ]
    }
  });
});
