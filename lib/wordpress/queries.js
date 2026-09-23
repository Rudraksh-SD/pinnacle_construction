// WPGraphQL Queries for Headless WordPress CPTs and ACF Pro

export const GET_PROJECT_BY_SLUG_QUERY = `
  query GetProjectBySlug($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      projectTypes {
        nodes {
          slug
          name
        }
      }
      projectStatuses {
        nodes {
          slug
          name
        }
      }
      projectFields {
        featured
        badge
        description
        reraNumber
        locality
        fullAddress
        youtubeVideoId
        seoTitle
        seoDescription
        renders {
          mediaItemUrl
          altText
        }
        brochurePdf {
          mediaItemUrl
        }
        configurations {
          label
          carpetAreaSqFt
          floorPlanImage {
            mediaItemUrl
          }
        }
        landmarks {
          kind
          name
          distanceKm
        }
      }
    }
  }
`;

export const GET_ALL_PROJECTS_QUERY = `
  query GetAllProjects {
    projects(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        projectTypes {
          nodes {
            slug
          }
        }
        projectStatuses {
          nodes {
            slug
          }
        }
        projectFields {
          featured
          badge
          description
          reraNumber
          locality
          fullAddress
          youtubeVideoId
          seoTitle
          seoDescription
          renders {
            mediaItemUrl
            altText
          }
          brochurePdf {
            mediaItemUrl
          }
          configurations {
            label
            carpetAreaSqFt
            floorPlanImage {
              mediaItemUrl
            }
          }
          landmarks {
            kind
            name
            distanceKm
          }
        }
      }
    }
  }
`;

export const GET_PROJECT_SLUGS_QUERY = `
  query GetProjectSlugs {
    projects(first: 100) {
      nodes {
        slug
        modified
      }
    }
  }
`;

export const GET_TESTIMONIALS_QUERY = `
  query GetTestimonials {
    testimonials(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
        testimonialFields {
          quote
          buildingBlock
          rating
        }
      }
    }
  }
`;

export const GET_TEAM_MEMBERS_QUERY = `
  query GetTeamMembers {
    teamMembers(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        title
        teamFields {
          role
          bio
        }
      }
    }
  }
`;

export const GET_CONTACT_SETTINGS_QUERY = `
  query GetContactSettings {
    contactSettings {
      phoneNumbers {
        phoneNumber
      }
      whatsappNumber
      whatsappDefaultMessage
      contactEmail
      officeAddress
      openingHours
      googleBusinessProfileUrl
    }
  }
`;
