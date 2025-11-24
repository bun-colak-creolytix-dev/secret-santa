import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { RoomFormField } from "@/components/room-form-field";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { joinRoom } from "@/functions/rooms";
import { saveRoomParticipation } from "@/hooks/useLocalStorageRooms";
import { VALIDATION_MESSAGES } from "@/lib/constants";
import type { UserParticipation } from "@/types/room";

interface JoinRoomFormProps {
	roomId: string;
	onJoinSuccess: (participation: UserParticipation) => void;
}

export function JoinRoomForm({ roomId, onJoinSuccess }: JoinRoomFormProps) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			note: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await joinRoom({
					data: {
						roomId,
						name: value.name,
						email: value.email,
						note: value.note,
					},
				});

				// Save to localStorage
				saveRoomParticipation({
					roomId,
					email: value.email,
					name: value.name,
				});

				// Clear the form
				form.reset();

				// Invalidate the loader to refetch the room data
				router.invalidate();

				// Update state to show joined view
				const participation: UserParticipation = {
					name: value.name,
					email: value.email,
					note: value.note || null,
				};
				onJoinSuccess(participation);

				toast.success("🎉 Successfully joined the exchange!");
			} catch (error) {
				console.error("Failed to join room:", error);
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to join room. Please try again.",
				);
			}
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl">✨ Enter the Circle</CardTitle>
				<CardDescription>
					Join the exchange and share your wishlist with your Secret Santa
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field
						name="name"
						validators={{
							onChange: ({ value }) => {
								if (!value || value.length < 2) {
									return VALIDATION_MESSAGES.NAME_MIN_LENGTH;
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<RoomFormField
								field={field}
								label="Your Name"
								type="text"
								placeholder="e.g., Rudolph"
							/>
						)}
					</form.Field>

					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) => {
								if (!value || !value.includes("@")) {
									return VALIDATION_MESSAGES.EMAIL_INVALID;
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<RoomFormField
								field={field}
								label="Your Email"
								type="email"
								placeholder="e.g., rudolph@northpole.com"
							/>
						)}
					</form.Field>

					<form.Field name="note">
						{(field) => (
							<RoomFormField
								field={field}
								label="Dear Santa (Gift Ideas & Notes)"
								type="textarea"
								placeholder="e.g., I love books, coffee, and cozy socks! Please avoid anything with peanuts."
								rows={4}
								helperText="Share your interests, hobbies, or gift preferences to help your Secret Santa!"
							/>
						)}
					</form.Field>

					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<Button
								type="submit"
								className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Joining..." : "🎁 Join the Exchange"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</CardContent>
		</Card>
	);
}
