interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  required?: boolean;
  name?: string;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  required = true,
  name,
}: FormFieldProps) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tomato/40"
      />
    </label>
  );
}
