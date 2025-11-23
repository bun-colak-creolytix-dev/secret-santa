import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/participants";
import type { Participant } from "@/types/room";

interface ParticipantCardProps {
	participant: Participant;
	variant?: "simple" | "detailed";
}

export function ParticipantCard({
	participant,
	variant = "simple",
}: ParticipantCardProps) {
	if (variant === "simple") {
		return (
			<div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
				<Avatar className="size-10 bg-primary/10">
					<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
						{getInitials(participant.name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">{participant.name}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
			<div className="flex items-start gap-3">
				<Avatar className="size-12 bg-primary/10 shrink-0">
					<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
						{getInitials(participant.name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 min-w-0">
					<p className="font-semibold text-lg">{participant.name}</p>
					<p className="text-sm text-muted-foreground break-all">
						{participant.email}
					</p>
					{participant.note && (
						<div className="mt-2 p-2 bg-background/50 rounded text-sm">
							<p className="text-muted-foreground font-medium">
								Gift preferences:
							</p>
							<p className="mt-1 whitespace-pre-wrap">{participant.note}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
