import { CheckCircle2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { UserParticipation } from "@/types/room";

interface ParticipationStatusProps {
	participation: UserParticipation;
}

export function ParticipationStatus({
	participation,
}: ParticipationStatusProps) {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<div className="flex items-center gap-2">
					<CheckCircle2 className="size-6 text-secondary" />
					<CardTitle className="text-2xl">
						✨ You're Already Participating!
					</CardTitle>
				</div>
				<CardDescription className="text-secondary">
					You've successfully joined this Secret Santa exchange
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label className="text-muted-foreground">Your Name</Label>
						<p className="font-medium text-lg">{participation.name}</p>
					</div>

					<div className="space-y-2">
						<Label className="text-muted-foreground">Your Email</Label>
						<p className="font-medium">{participation.email}</p>
					</div>

					{participation.note && (
						<div className="space-y-2">
							<Label className="text-muted-foreground">
								Your Gift Preferences
							</Label>
							<div className="p-3 bg-background/50 rounded-md">
								<p className="whitespace-pre-wrap">{participation.note}</p>
							</div>
						</div>
					)}

					<div className="pt-2 text-sm text-secondary-foreground">
						🎄 Sit tight! You'll be notified when names are drawn.
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
