import {
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { Calendar, Link2, Lock, Share2, Shield, Unlock, User } from "lucide-react";
import { DrawNamesSection } from "@/components/draw-names-section";
import { ParticipantList } from "@/components/participant-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getAdminRoom } from "@/functions/rooms";
import { useShareLink } from "@/hooks/useShareLink";

export const Route = createFileRoute("/room/$id/x/$adminKey")({
	component: AdminRoomPage,
	loader: async ({ params }) => {
		try {
			const data = await getAdminRoom({
				data: { roomId: params.id, adminKey: params.adminKey },
			});

			return data;
		} catch {
			// If admin key is invalid, return null to show error state
			return null;
		}
	},
});

function AdminRoomPage() {
	const { id, adminKey } = Route.useParams();
	const location = useLocation();
	const loaderData = Route.useLoaderData();
	const navigate = useNavigate();
	const { isSharing, shareLink } = useShareLink();

	// If loader returned null, the admin key is invalid
	if (!loaderData) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl text-destructive">
							Access Denied
						</CardTitle>
						<CardDescription>
							The admin link you're trying to access is invalid or has expired.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => navigate({ to: `/room/${id}` })}
							className="w-full"
						>
							Go to Participant View
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const participantUrl = `${location.url.split("/x/")[0]}`;

	const handleShare = () => {
		shareLink(participantUrl, "Participant link copied to clipboard!");
	};

	const formattedDate = loaderData.room.createdAt
		? new Date(loaderData.room.createdAt).toLocaleDateString()
		: new Date().toLocaleDateString();

	return (
		<div className="flex-1 p-4">
			<div className="max-w-5xl mx-auto py-8 space-y-8">
				<header className="text-center space-y-4">
					<div className="flex items-center justify-center gap-2">
						<Badge
							variant="outline"
							className="px-4 py-1.5 text-sm font-medium border-primary/40"
						>
							{loaderData.room.isDrawn ? (
								<>
									<Lock className="size-3.5 mr-1.5" />
									Names Drawn
								</>
							) : (
								<>
									<Unlock className="size-3.5 mr-1.5" />
									Open for Signup
								</>
							)}
						</Badge>
						<Badge
							variant="secondary"
							className="px-4 py-1.5 text-sm font-medium"
						>
							<Shield className="size-3.5 mr-1.5" />
							Admin View
						</Badge>
					</div>

					<h1 className="text-4xl md:text-5xl font-bold text-foreground font-display">
						{loaderData.room.name}
					</h1>

					<div className="flex items-center justify-center gap-6 text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<User className="size-4" />
							by{" "}
							<span className="font-medium text-foreground">
								{loaderData.room.organizerName || loaderData.room.organizerEmail}
							</span>
						</span>
						<span className="flex items-center gap-1.5">
							<Calendar className="size-4" />
							{formattedDate}
						</span>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-7 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg flex items-center gap-2">
									<Link2 className="size-5" />
									Participant Link
								</CardTitle>
								<CardDescription>
									Share this link with people you want to invite
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col sm:flex-row gap-3">
									<input
										type="text"
										value={participantUrl}
										readOnly
										className="flex-1 px-3 py-2 bg-muted text-foreground border border-input rounded-md text-sm font-mono"
										onClick={(e) => e.currentTarget.select()}
									/>
									<Button
										onClick={handleShare}
										disabled={isSharing}
										className="shrink-0"
									>
										<Share2 className="size-4 mr-2" />
										{isSharing ? "Copying..." : "Copy Link"}
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Draw Names Section */}
						<DrawNamesSection
							roomId={id}
							adminKey={adminKey}
							participantCount={loaderData.participants.length}
							isDrawn={loaderData.room.isDrawn}
						/>
					</div>

					{/* Right Column - Participants Sidebar */}
					<div className="lg:col-span-5">
						<ParticipantList
							participants={loaderData.participants}
							variant="detailed"
							title="Participants"
							showBadge
							emptyMessage="Waiting for participants to join..."
							emptySubMessage="Share the link to invite others!"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
