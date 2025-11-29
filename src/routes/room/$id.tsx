import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Calendar, Lock, Share2, Unlock, User } from "lucide-react";
import { JoinRoomForm } from "@/components/join-room-form";
import { ParticipantList } from "@/components/participant-list";
import { ParticipationStatus } from "@/components/participation-status";
import { Badge } from "@/components/ui/badge";
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

	const formattedDate = loaderData.room.createdAt
		? new Date(loaderData.room.createdAt).toLocaleDateString()
		: new Date().toLocaleDateString();

	return (
		<div className="flex-1 p-4">
			<div className="max-w-5xl mx-auto py-8 space-y-8">
				{/* Header Section */}
				<header className="text-center space-y-4">
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

				{/* Two-Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-7 space-y-6">
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

						{/* Share Button - Desktop: Below form, Mobile: After participants */}
						<div className="hidden lg:block">
							<Button
								onClick={handleShare}
								disabled={isSharing}
								className="w-full py-6 text-lg font-semibold"
							>
								<Share2 className="size-5 mr-2" />
								{isSharing ? "Copying..." : "Share Invite Link"}
							</Button>
						</div>
					</div>

					{/* Right Column - Participants Sidebar */}
					<div className="lg:col-span-5">
						<ParticipantList
							participants={loaderData.participants}
							showBadge
						/>
					</div>
				</div>

				{/* Share Button - Mobile Only */}
				<div className="lg:hidden">
					<Button
						onClick={handleShare}
						disabled={isSharing}
						className="w-full py-6 text-lg font-semibold"
					>
						<Share2 className="size-5 mr-2" />
						{isSharing ? "Copying..." : "Share Invite Link"}
					</Button>
				</div>
			</div>
		</div>
	);
}
