import { useRouter } from "@tanstack/react-router";
import { Sparkles, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { drawNames } from "@/functions/rooms";

interface DrawNamesSectionProps {
	roomId: string;
	adminKey: string;
	participantCount: number;
	isDrawn: boolean;
}

export function DrawNamesSection({
	roomId,
	adminKey,
	participantCount,
	isDrawn,
}: DrawNamesSectionProps) {
	const router = useRouter();
	const [isDrawing, setIsDrawing] = useState(false);

	const handleDrawNames = async () => {
		if (participantCount < 3) {
			toast.error("At least 3 participants are required to draw names");
			return;
		}

		if (isDrawn) {
			toast.error("Names have already been drawn for this room");
			return;
		}

		setIsDrawing(true);
		try {
			const result = await drawNames({
				data: { roomId, adminKey },
			});

			toast.success(
				`🎉 ${result.message} Emails sent to ${result.participantCount} participants!`,
			);

			// Reload the page data to show updated state
			router.invalidate();
		} catch (error) {
			console.error("Failed to draw names:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to draw names";
			toast.error(`❌ ${errorMessage}`);
		} finally {
			setIsDrawing(false);
		}
	};

	if (isDrawn) {
		return (
			<Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
				<CardHeader>
					<CardTitle className="text-lg text-green-700 dark:text-green-300">
						✅ Names Have Been Drawn!
					</CardTitle>
					<CardDescription className="text-green-600 dark:text-green-400">
						All participants have been notified via email with their Secret
						Santa assignments.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-3">
			{participantCount < 3 && (
				<Alert variant="warning">
					<TriangleAlertIcon className="size-4" />
					<AlertTitle>At least 3 participants are required to draw names</AlertTitle>
					<AlertDescription>
						Currently have {participantCount}.
					</AlertDescription>
				</Alert>
			)}
			<Button
				onClick={handleDrawNames}
				disabled={isDrawing || participantCount < 3}
				className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
				size="lg"
			>
				<Sparkles className="size-5 mr-2" />
				{isDrawing ? "Drawing Names..." : "Draw Names"}
			</Button>
		</div>
	);
}
