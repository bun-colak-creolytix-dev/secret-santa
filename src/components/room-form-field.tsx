import type { FieldApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RoomFormFieldProps {
	// biome-ignore lint/suspicious/noExplicitAny: FieldApi has too many generic types
	field: FieldApi<any, any, any, any>;
	label: string;
	type?: "text" | "email" | "textarea";
	placeholder?: string;
	helperText?: string;
	rows?: number;
}

export function RoomFormField({
	field,
	label,
	type = "text",
	placeholder,
	helperText,
	rows,
}: RoomFormFieldProps) {
	const id = field.name;

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			{type === "textarea" ? (
				<Textarea
					id={id}
					placeholder={placeholder}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					onBlur={field.handleBlur}
					rows={rows}
				/>
			) : (
				<Input
					id={id}
					type={type}
					placeholder={placeholder}
					value={field.state.value}
					onChange={(e) => field.handleChange(e.target.value)}
					onBlur={field.handleBlur}
				/>
			)}
			{field.state.meta.errors.length > 0 && (
				<p className="text-sm text-destructive">
					{String(field.state.meta.errors[0])}
				</p>
			)}
			{helperText && !field.state.meta.errors.length && (
				<p className="text-xs text-muted-foreground">{helperText}</p>
			)}
		</div>
	);
}
