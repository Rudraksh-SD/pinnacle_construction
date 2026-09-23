// WPGraphQL Fetch Client for Headless WordPress Integration

const GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL ||
  "https://cms.thepinnacleconstruction.in/graphql";

/**
 * Executes a WPGraphQL query against the WordPress backend.
 * @param {string} query GraphQL query string
 * @param {object} variables Query variables
 * @returns {Promise<any>} Response data
 */
export async function fetchGraphQL(query, variables = {}) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Revalidation handled dynamically or via webhook
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[WPGraphQL] HTTP error! status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json.errors) {
      console.warn("[WPGraphQL] Query errors:", json.errors);
      return null;
    }

    return json.data;
  } catch (error) {
    console.warn("[WPGraphQL] Fetch exception:", error.message);
    return null;
  }
}
