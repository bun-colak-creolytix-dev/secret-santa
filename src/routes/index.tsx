import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { createRoom } from "@/functions/rooms";
import { saveRoomParticipation } from "@/hooks/useLocalStorageRooms";
import { VALIDATION_MESSAGES } from "@/lib/constants";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: {
			name: "",
			organizerName: "",
			organizerEmail: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const room = await createRoom({
					data: {
						name: value.name,
						organizerName: value.organizerName,
						organizerEmail: value.organizerEmail,
					},
				});

				// Save creator's participation to localStorage
				saveRoomParticipation({
					roomId: room.id,
					email: value.organizerEmail,
					name: value.organizerName,
				});

				// Navigate to the admin page with the admin key
				await navigate({ to: `/room/${room.id}/x/${room.adminKey}` });
				toast.success("🎉 Room created successfully!");
			} catch (error) {
				console.error("Failed to create room:", error);
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to create room. Please try again.",
				);
			}
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-2 border-l-secondary bg-secondary/5">
					<CardTitle className="text-4xl md:text-5xl text-primary">
						🎅 Secret Santa 🎄
					</CardTitle>
					<CardDescription>
						Create a group, invite friends, and let the elves handle the
						matching.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value || value.length < 3) {
										return VALIDATION_MESSAGES.ROOM_NAME_MIN_LENGTH;
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<RoomFormField
									field={field}
									label="Room Name"
									type="text"
									placeholder="e.g., Acme Design Team"
								/>
							)}
						</form.Field>

						<form.Field
							name="organizerName"
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
									placeholder="e.g., Santa Claus"
								/>
							)}
						</form.Field>

						<form.Field
							name="organizerEmail"
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
									placeholder="e.g., santa@northpole.com"
								/>
							)}
						</form.Field>

						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Creating..." : "🎄 Create Holiday Room"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
