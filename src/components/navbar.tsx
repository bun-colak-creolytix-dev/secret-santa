import { Link } from "@tanstack/react-router";
import logo from "../logo.svg";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				<Link
					to="/"
					className="flex items-center gap-2 hover:opacity-80 transition-opacity"
				>
					<img
						src="/android-chrome-192x192.png"
						alt="Secret Santa"
						className="h-8 w-8"
					/>
					<span className="text-lg font-semibold text-foreground">
						Secret Santa
					</span>
				</Link>
				<ThemeToggle />
			</div>
		</nav>
	);
}

