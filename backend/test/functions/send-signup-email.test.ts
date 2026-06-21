import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { handler } from "../../lib/functions/send-signup-email";

const sesMock = mockClient(SESClient);

describe("SendSignupEmail Lambda", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    sesMock.reset();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should send an email when configuration is valid", async () => {
    process.env.SENDER_EMAIL = "sender@example.com";
    process.env.RECIPIENT_EMAIL = "recipient@example.com";

    sesMock.on(SendEmailCommand).resolves({});

    const event = {
      body: JSON.stringify({
        id: "user_123",
        wallet_address: "0x123456789",
      }),
    } as any;

    const response: any = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe("Email sent successfully");

    const sesCalls = sesMock.commandCalls(SendEmailCommand);
    expect(sesCalls.length).toBe(1);
    
    const input = sesCalls[0].args[0].input as any;
    expect(input.Source).toBe("sender@example.com");
    expect(input.Destination.ToAddresses).toContain("recipient@example.com");
    expect(input.Message.Body.Text.Data).toContain("user_123");
    expect(input.Message.Body.Text.Data).toContain("0x123456789");
  });

  it("should return 500 when environment variables are missing", async () => {
    delete process.env.SENDER_EMAIL;
    delete process.env.RECIPIENT_EMAIL;

    const event = {
      body: JSON.stringify({}),
    } as any;

    const response: any = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe("Server configuration error");
  });

  it("should return 500 when SES send fails", async () => {
    process.env.SENDER_EMAIL = "sender@example.com";
    process.env.RECIPIENT_EMAIL = "recipient@example.com";

    sesMock.on(SendEmailCommand).rejects(new Error("SES Error"));

    const event = {
      body: JSON.stringify({}),
    } as any;

    const response: any = await handler(event);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toBe("Failed to send email");
  });
});
