import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

/**
 * Secure revalidation route for WordPress webhook & legacy Sanity webhook triggers.
 */
export async function POST(request) {
  const wpSecret = process.env.WORDPRESS_REVALIDATE_SECRET;
  const sanitySecret = process.env.SANITY_REVALIDATE_SECRET;

  const authHeader = request.headers.get("x-wp-revalidate-secret");
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get("secret");

  // 1. Check WordPress Webhook secret authentication
  if (wpSecret && (authHeader === wpSecret || secretParam === wpSecret)) {
    revalidatePath("/", "layout");
    return Response.json({ revalidated: true, source: "wordpress", timestamp: new Date().toISOString() });
  }

  // 2. Check Sanity Webhook signature authentication (legacy support)
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (sanitySecret && signature) {
    if (await isValidSignature(body, signature, sanitySecret)) {
      revalidatePath("/", "layout");
      return Response.json({ revalidated: true, source: "sanity", timestamp: new Date().toISOString() });
    }
  }

  return Response.json({ message: "Invalid authentication secret or signature" }, { status: 401 });
}
