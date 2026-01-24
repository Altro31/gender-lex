import envs from "@/lib/env/env-server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const handler = async (req: NextRequest) => {
  let path = req.nextUrl.pathname.replace("api/proxy", "");
  if (path.startsWith("//")) path = path.slice(1);
  const url = new URL(envs.API_URL, req.nextUrl);
  url.pathname = path;
  return fetch(url, {
    ...req,
    headers: await headers(),
  });
};

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
