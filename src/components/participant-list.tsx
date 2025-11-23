import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ParticipantCard } from "@/components/participant-card";
import type { Participant } from "@/types/room";

interface ParticipantListProps {
	participants: Participant[];
	variant?: "simple" | "detailed";
	title?: string;
	description?: string;
	emptyMessage?: string;
	emptySubMessage?: string;
}

export function ParticipantList({
	participants,
	variant = "simple",
	title = "👥 Who's Joining",
	description,
	emptyMessage = "🎄 Waiting for the first elf to join...",
	emptySubMessage = "Share the link below to invite others!",
}: ParticipantListProps) {
	const defaultDescription =
		participants.length === 0
			? "Be the first to join!"
			: `${participants.length} ${
					participants.length === 1 ? "person has" : "people have"
				} joined so far`;

	return (
		<Card>
			<CardHeader className="bg-accent/5">
				<CardTitle className="text-2xl">{title}</CardTitle>
				<CardDescription>{description || defaultDescription}</CardDescription>
			</CardHeader>

			<CardContent>
				{participants.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						<p className="text-lg">{emptyMessage}</p>
						<p className="text-sm mt-2">{emptySubMessage}</p>
					</div>
				) : (
					<div
						className={`${
							variant === "simple" ? "space-y-3" : "space-y-4"
						} max-h-96 overflow-y-auto`}
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
