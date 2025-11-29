import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Gift, Loader2, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import { FeatureCard } from "@/components/feature-card";
import { RoomFormField } from "@/components/room-form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
		<div className="flex-1 p-4">
			<div className="max-w-7xl mx-auto py-12">
				<div className="grid lg:grid-cols-2 gap-12 items-start">
					{/* Left Column - Promotional Content */}
					<div className="space-y-8 animate-in fade-in duration-700">
						<div className="space-y-4">
							<Badge variant="default" className="mb-4">
								<span className="flex items-center gap-2">
									<Gift className="w-3 h-3" /> The easiest way to exchange
									gifts
								</span>
							</Badge>
							<h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
								<span className="text-foreground">Organize your</span>
								<br />
								<span className="text-primary">Secret Santa</span>
								<br />
								<span className="text-foreground">in seconds.</span>
							</h1>
							<p className="text-lg text-muted-foreground max-w-lg">
								Create a room, invite friends, and let our elves handle the
								random assignments. No login required for participants.
							</p>
						</div>

						{/* Feature Cards */}
						<div className="grid grid-cols-3 gap-3 pt-4">
							<FeatureCard icon={Users} label="Create Group" />
							<FeatureCard icon={Mail} label="Invite Friends" />
							<FeatureCard icon={Gift} label="Draw Names" />
						</div>
					</div>

					{/* Right Column - Form Card */}
					<div className="lg:sticky lg:top-24">
						<Card className="border-border shadow-lg bg-card animate-in slide-in-from-bottom-4 duration-500">
							<div className="px-6 pt-2 pb-2 border-l-4 border-l-primary">
								<CardTitle className="text-primary text-xl font-bold">
									Start a New Exchange
								</CardTitle>
								<CardDescription className="mt-2">
									Enter the details below to create your Secret Santa room.
								</CardDescription>
							</div>

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
												label="Group Name"
												type="text"
												placeholder="e.g. Office Holiday Party 2025"
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
												if (!value?.includes("@")) {
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
												className="w-full py-6 text-lg font-display"
												disabled={isSubmitting}
											>
												{isSubmitting ? (
													<>
														<Loader2 className="w-5 h-5 animate-spin mr-2" />
														Creating...
													</>
												) : (
													<>
														Create Room
														<ArrowRight className="w-5 h-5 ml-2" />
													</>
												)}
											</Button>
										)}
									</form.Subscribe>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
