import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { wallet_address, id } = body;

    const recipientEmail = process.env.RECIPIENT_EMAIL;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!recipientEmail || !senderEmail) {
      console.error("Missing RECIPIENT_EMAIL or SENDER_EMAIL environment variable.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    const emailParams = {
      Source: senderEmail,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Subject: {
          Data: "New FlokiPets Player Signup!",
        },
        Body: {
          Text: {
            Data: `A new player has signed up for FlokiPets.\n\nUser ID: ${id || "N/A"}\nWallet Address: ${wallet_address || "Not provided"}\n`,
          },
        },
      },
    };

    const command = new SendEmailCommand(emailParams);
    await sesClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
