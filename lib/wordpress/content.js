import { fetchGraphQL } from "./client";
import {
  GET_PROJECT_BY_SLUG_QUERY,
  GET_ALL_PROJECTS_QUERY,
  GET_PROJECT_SLUGS_QUERY,
  GET_TESTIMONIALS_QUERY,
  GET_TEAM_MEMBERS_QUERY,
  GET_CONTACT_SETTINGS_QUERY,
} from "./queries";
import * as sanityContent from "@/sanity/lib/content";

/**
 * Maps WPGraphQL Project Node to Next.js Component Props Shape
 */
export function formatWpProject(wpProject) {
  if (!wpProject) return null;
  const fields = wpProject.projectFields || {};

  return {
    _id: wpProject.id || `wp-project-${wpProject.slug}`,
    name: wpProject.title || fields.name,
    slug: wpProject.slug,
    type: wpProject.projectTypes?.nodes?.[0]?.slug || fields.type || "residential",
    status: wpProject.projectStatuses?.nodes?.[0]?.slug || fields.status || "ongoing",
    featured: Boolean(fields.featured),
    badge: fields.badge && fields.badge !== "none" ? fields.badge : undefined,
    description: fields.description || "",
    reraNumber: fields.reraNumber || undefined,
    location: fields.locality || fields.location || "",
    address: fields.fullAddress || fields.address || "",
    seoTitle: fields.seoTitle || undefined,
    seoDescription: fields.seoDescription || undefined,
    landmarks: (fields.landmarks || []).map((l) => ({
      kind: l.kind,
      name: l.name,
      km: typeof l.distanceKm === "number" ? l.distanceKm : l.km,
    })),
    configurations: (fields.configurations || []).map((c) => ({
      label: c.label,
      carpetAreaSqFt: c.carpetAreaSqFt,
      floorPlanImageUrl: c.floorPlanImage?.mediaItemUrl || c.floorPlanImageUrl,
    })),
    renders: (fields.renders || []).map((r) =>
      typeof r === "string" ? r : r.mediaItemUrl
    ),
    brochureUrl: fields.brochurePdf?.mediaItemUrl || fields.brochureUrl,
    videoReelYoutubeId: fields.youtubeVideoId || fields.videoReelYoutubeId,
  };
}

/**
 * Fetch a single project by slug from WordPress WPGraphQL, falling back seamlessly if offline.
 */
export async function getProjectBySlug(slug) {
  const data = await fetchGraphQL(GET_PROJECT_BY_SLUG_QUERY, { slug });
  if (data?.project) {
    return formatWpProject(data.project);
  }
  // Fallback to existing Sanity/data source while WordPress backend is being populated
  return sanityContent.getProjectBySlug(slug);
}

/**
 * Fetch all project slugs for SSG / Sitemap
 */
export async function getProjectSlugs() {
  const data = await fetchGraphQL(GET_PROJECT_SLUGS_QUERY);
  if (data?.projects?.nodes?.length > 0) {
    return data.projects.nodes.map((node) => ({
      slug: node.slug,
      _updatedAt: node.modified || new Date().toISOString(),
    }));
  }
  return sanityContent.getProjectSlugs();
}

/**
 * Fetch all projects for catalog and homepage
 */
export async function getProjects() {
  const data = await fetchGraphQL(GET_ALL_PROJECTS_QUERY);
  if (data?.projects?.nodes?.length > 0) {
    return data.projects.nodes.map(formatWpProject);
  }
  return sanityContent.getProjects();
}

/**
 * Fetch testimonials
 */
export async function getTestimonials() {
  const data = await fetchGraphQL(GET_TESTIMONIALS_QUERY);
  if (data?.testimonials?.nodes?.length > 0) {
    return data.testimonials.nodes.map((node) => ({
      author: node.title,
      quote: node.testimonialFields?.quote || "",
      block: node.testimonialFields?.buildingBlock || "",
      rating: node.testimonialFields?.rating || 5,
    }));
  }
  return sanityContent.getTestimonials();
}

/**
 * Fetch team members
 */
export async function getTeam() {
  const data = await fetchGraphQL(GET_TEAM_MEMBERS_QUERY);
  if (data?.teamMembers?.nodes?.length > 0) {
    return data.teamMembers.nodes.map((node) => ({
      name: node.title,
      role: node.teamFields?.role || "",
      bio: node.teamFields?.bio || "",
    }));
  }
  return sanityContent.getTeam();
}

/**
 * Fetch contact settings
 */
export async function getContact() {
  const data = await fetchGraphQL(GET_CONTACT_SETTINGS_QUERY);
  if (data?.contactSettings) {
    const settings = data.contactSettings;
    const phones = (settings.phoneNumbers || []).map((p) => p.phoneNumber);
    const address = settings.officeAddress;
    return {
      phones: phones.length > 0 ? phones : ["7770020599", "9823020599"],
      whatsappNumber: settings.whatsappNumber || "917770020599",
      whatsappMessage:
        settings.whatsappDefaultMessage ||
        "Hi, I'm interested in booking a site visit with Pinnacle Construction.",
      email: settings.contactEmail || "info@thepinnacleconstruction.in",
      address:
        address ||
        "Pinnacle Construction, Wardha Road, Near Hotel Pride, Nagpur, Maharashtra 440015",
      hours: settings.openingHours || "Mon - Sat: 10:00 AM - 7:00 PM",
      googleBusinessProfileUrl: settings.googleBusinessProfileUrl || "",
      mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
        address || "Pinnacle Construction Wardha Road Nagpur"
      )}&output=embed`,
    };
  }
  return sanityContent.getContact();
}
