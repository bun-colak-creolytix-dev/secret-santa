import {
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { DrawNamesSection } from "@/components/draw-names-section";
import { ParticipantList } from "@/components/participant-list";
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
			<div className="flex-1 flex items-center justify-center p-4 bg-accent/20">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl text-destructive">
							⚠️ Access Denied
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

	const participantUrl = `${location.url.split("/x")[0]}`;

	const handleShare = () => {
		shareLink(participantUrl, "🔗 Participant link copied to clipboard!");
	};

	return (
		<div className="flex-1 p-4 bg-accent/20">
			<div className="max-w-4xl mx-auto py-8 space-y-6">
				{/* Participants List Card */}
				<ParticipantList
					participants={loaderData.participants}
					variant="detailed"
					title="👥 Participants"
					description={
						loaderData.participants.length === 0
							? "No participants yet - share the link below!"
							: `${loaderData.participants.length} ${
									loaderData.participants.length === 1 ? "person" : "people"
								} participating`
					}
					emptyMessage="🎄 Waiting for participants to join..."
					emptySubMessage="Share the link below to invite others!"
				/>

				{/* Participant Link Display */}
				<Card className="border-primary/20 bg-primary/5">
					<CardHeader>
						<CardTitle className="text-lg">Participant Link</CardTitle>
						<CardDescription>
							Share this link with people you want to invite
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col sm:flex-row gap-2">
							<input
								type="text"
								value={participantUrl}
								readOnly
								className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
								onClick={(e) => e.currentTarget.select()}
							/>
							<Button
								onClick={handleShare}
								disabled={isSharing}
								variant="outline"
								className="shrink-0"
							>
								<Share2 className="size-4 mr-2" />
								{isSharing ? "Copying..." : "Copy Link"}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Action Button or Status */}
				<DrawNamesSection
					roomId={id}
					adminKey={adminKey}
					participantCount={loaderData.participants.length}
					isDrawn={loaderData.room.isDrawn}
				/>
			</div>
		</div>
	);
}
