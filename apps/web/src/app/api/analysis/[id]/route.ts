import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/analysis/[id]">,
) {
  const { id } = await ctx.params;
  console.log("");
  return NextResponse.json({ Hola: id });
}
