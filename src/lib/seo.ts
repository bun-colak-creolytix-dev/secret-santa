/**
 * SEO utility functions for generating consistent meta tags
 */

const SITE_URL = "https://your-domain.com";
const OG_IMAGE = "/og-image.png";
const SITE_NAME = "Secret Santa";

export interface SEOConfig {
	title: string;
	description: string;
	url?: string;
	image?: string;
	type?: string;
}

/**
 * Generate meta tags for SEO, Open Graph, and Twitter Cards
 */
export function generateSEOMetaTags(config: SEOConfig) {
	const {
		title,
		description,
		url = SITE_URL,
		image = `${SITE_URL}${OG_IMAGE}`,
		type = "website",
	} = config;

	return {
		meta: [
			{
				title,
			},
			{
				name: "description",
				content: description,
			},
			{
				property: "og:type",
				content: type,
			},
			{
				property: "og:site_name",
				content: SITE_NAME,
			},
			{
				property: "og:title",
				content: title,
			},
			{
				property: "og:description",
				content: description,
			},
			{
				property: "og:image",
				content: image,
			},
			{
				property: "og:url",
				content: url,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: title,
			},
			{
				name: "twitter:description",
				content: description,
			},
			{
				name: "twitter:image",
				content: image,
			},
		],
		links: [
			{
				rel: "canonical",
				href: url,
			},
		],
	};
}

/**
 * Get the full URL for a given path
 */
export function getFullUrl(path: string): string {
	return `${SITE_URL}${path}`;
}
