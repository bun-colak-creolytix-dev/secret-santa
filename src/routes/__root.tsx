import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

const SITE_URL = "https://santa.buncolak.com";
const OG_IMAGE = "/og-image.jpg";
const SITE_NAME = "Secret Santa";
const DEFAULT_TITLE = "Secret Santa - Create Your Holiday Gift Exchange";
const DEFAULT_DESCRIPTION =
	"Create a Secret Santa gift exchange group, invite friends, and let the elves handle the matching. Organize your holiday gift exchange effortlessly!";

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: DEFAULT_TITLE,
			},
			{
				name: "description",
				content: DEFAULT_DESCRIPTION,
			},
			{
				name: "robots",
				content: "index, follow",
			},
			// Open Graph tags
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:site_name",
				content: SITE_NAME,
			},
			{
				property: "og:title",
				content: DEFAULT_TITLE,
			},
			{
				property: "og:description",
				content: DEFAULT_DESCRIPTION,
			},
			{
				property: "og:image",
				content: `${SITE_URL}${OG_IMAGE}`,
			},
			{
				property: "og:url",
				content: SITE_URL,
			},
			// Twitter Card tags
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: DEFAULT_TITLE,
			},
			{
				name: "twitter:description",
				content: DEFAULT_DESCRIPTION,
			},
			{
				name: "twitter:image",
				content: `${SITE_URL}${OG_IMAGE}`,
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "canonical",
				href: SITE_URL,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Toaster />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
