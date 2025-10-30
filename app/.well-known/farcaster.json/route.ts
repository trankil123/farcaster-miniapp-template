import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
  // TODO: Add your own account association
    accountAssociation: {
    "header": "eyJmaWQiOjg4NzE3OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGJBMkE1MkFBYkY2N2JhMzljRDlCYkU3ODVCZTk1Qzc5NGRmNWVGQWIifQ",
    "payload": "eyJkb21haW4iOiJmYXJjYXN0ZXItbWluaWFwcC10ZW1wbGF0ZS1zYWdlLnZlcmNlbC5hcHAifQ",
    "signature": "bZjJKF4S1YesIPkGdwsLNWtQu1+MKVJD9suMpWxIFphtAmrWXm687SlonKdagl9WOdM5INB3EYtD6VYvJtqHrhw="
  },
    frame: {
      version: "1",
      name: "Farcaster MiniApp",
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
