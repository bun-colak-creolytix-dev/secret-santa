import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
	icon: LucideIcon;
	label: string;
}

export function FeatureCard({ icon: Icon, label }: FeatureCardProps) {
	return (
		<Card className="bg-card border-border py-2">
			<CardContent className="p-3 text-center">
				<div className="flex flex-col items-center gap-2">
					<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
						<Icon className="w-4 h-4 text-secondary-foreground" />
					</div>
					<p className="text-sm font-medium text-foreground">{label}</p>
				</div>
			</CardContent>
		</Card>
	);
}

