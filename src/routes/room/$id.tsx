import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { JoinRoomForm } from "@/components/join-room-form";
import { ParticipantList } from "@/components/participant-list";
import { ParticipationStatus } from "@/components/participation-status";
import { Button } from "@/components/ui/button";
import { getRoomWithParticipants } from "@/functions/rooms";
import { useRoomParticipation } from "@/hooks/useRoomParticipation";
import { useShareLink } from "@/hooks/useShareLink";

export const Route = createFileRoute("/room/$id")({
	component: RoomPage,
	loader: async ({ params }) => {
		const data = await getRoomWithParticipants({
			data: { roomId: params.id },
		});
		return data;
	},
});

function RoomPage() {
	const { id } = Route.useParams();
	const loaderData = Route.useLoaderData();
	const { isSharing, shareLink } = useShareLink();
	const { hasJoined, userParticipation, setHasJoined, setUserParticipation } =
		useRoomParticipation({
			roomId: id,
			participants: loaderData.participants,
		});

	const handleShare = () => {
		shareLink(window.location.href);
	};

	const matches = useMatches();
	const hasChildRoute = matches.some((match) => match.id.includes("/x/"));

	// If a child route is active (admin page), just render the Outlet
	if (hasChildRoute) {
		return <Outlet />;
	}

	return (
		<div className="min-h-screen p-4 bg-accent/20">
			<div className="max-w-4xl mx-auto py-8 space-y-6">
				{/* Header */}
				<div className="text-center space-y-2">
					<h1 className="text-4xl md:text-5xl font-bold text-primary">
						🎅 {loaderData.room.name} 🎄
					</h1>
					<p className="text-muted-foreground">
						Organized by {loaderData.room.organizerEmail}
					</p>
				</div>

				{/* Join Form Card or Already Joined Message */}
				{hasJoined && userParticipation ? (
					<ParticipationStatus participation={userParticipation} />
				) : (
					<JoinRoomForm
						roomId={id}
						onJoinSuccess={(participation) => {
							setHasJoined(true);
							setUserParticipation(participation);
						}}
					/>
				)}

				{/* Participants List Card */}
				<ParticipantList participants={loaderData.participants} />

				{/* Action Button */}
				<Button
					onClick={handleShare}
					disabled={isSharing}
					variant="outline"
					className="w-full py-6 text-lg font-semibold"
				>
					<Share2 className="size-5 mr-2" />
					{isSharing ? "Copying..." : "Share Invite Link"}
				</Button>
			</div>
		</div>
	);
}
