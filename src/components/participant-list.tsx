import { ParticipantCard } from "@/components/participant-card";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Participant } from "@/types/room";

interface ParticipantListProps {
	participants: Participant[];
	variant?: "simple" | "detailed";
	title?: string;
	description?: string;
	emptyMessage?: string;
	emptySubMessage?: string;
	showBadge?: boolean;
}

export function ParticipantList({
	participants,
	variant = "simple",
	title = "Participants",
	description,
	emptyMessage = "No participants yet. Be the first!",
	emptySubMessage = "Share the link to invite others!",
	showBadge = false,
}: ParticipantListProps) {
	const defaultDescription =
		participants.length === 0
			? "Be the first to join!"
			: `${participants.length} ${participants.length === 1 ? "person has" : "people have"
			} joined so far`;

	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle className="text-xl justify-between flex items-center gap-2 w-full">{title}{showBadge && (
					<Badge
						variant="secondary"
						className="text-sm font-semibold px-3 py-1"
					>
						{participants.length}
					</Badge>
				)}</CardTitle>
				{showBadge && (
					<CardDescription>{description || defaultDescription}</CardDescription>
				)}
			</CardHeader>

			<CardContent>
				{participants.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p className="text-base">{emptyMessage}</p>
						<p className="text-sm mt-1">{emptySubMessage}</p>
					</div>
				) : (
					<div
						className={`${variant === "simple" ? "space-y-2" : "space-y-3"
							} max-h-[400px] overflow-y-auto pr-1`}
					>
						{participants.map((participant) => (
							<ParticipantCard
								key={participant.id}
								participant={participant}
								variant={variant}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
