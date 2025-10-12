import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
  // TODO: Add your own account association
    accountAssociation: {
    "header": "eyJmaWQiOjMyODg1NSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweERCOTczZjliNWI0MDhFMkZFNjNFQ2UzNjBEYjFjODU5YjQ5NDFFRTcifQ",
    "payload": "eyJkb21haW4iOiJmYXJjYXN0ZXItbWluaWFwcC10ZW1wbGF0ZS1lYm9uLnZlcmNlbC5hcHAifQ",
    "signature": "1bH6yx1yjJgF2olNGcmhAgsbS229TmERlvHsktnOqA88aDMQAPm+WSFEgqfIFtcRFIUsewD5Of72EVNKufxX3Bs="
  },
    frame: {
      version: "1",
      name: "Trankil Farcaster MiniApp",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      screenshotUrls: [],
      tags: ["Base", "farcaster", "miniapp", "template"],
      primaryCategory: "developer-tools",
      buttonTitle: "Launch Template",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
