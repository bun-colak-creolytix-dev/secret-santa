import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook for sharing links to clipboard
 */
export function useShareLink() {
	const [isSharing, setIsSharing] = useState(false);

	const shareLink = async (
		url: string,
		successMessage = "🔗 Link copied to clipboard!",
	) => {
		setIsSharing(true);
		try {
			await navigator.clipboard.writeText(url);
			toast.success(successMessage);
		} catch (error) {
			console.error("Failed to copy link:", error);
			toast.error("Failed to copy link. Please try again.");
		} finally {
			setIsSharing(false);
		}
	};

	return { isSharing, shareLink };
}
