import { NextResponse } from "next/server";
import { exec } from "child_process";

const DEPLOY_SECRET = process.env.DEPLOY_SECRET;

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");

  if (!DEPLOY_SECRET || auth !== `Bearer ${DEPLOY_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Kick off deploy in the background and return 202 immediately
  exec(
    "bash /opt/mayr-dach/scripts/deploy.sh >> /var/log/mayr-dach-deploy.log 2>&1 &",
    (error) => {
      if (error) {
        console.error("Deploy script failed to start:", error);
      }
    }
  );

  return NextResponse.json(
    { message: "Deploy triggered" },
    { status: 202 }
  );
}
