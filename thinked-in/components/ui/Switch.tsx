"use client";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export default function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  ariaLabel,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={`peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "border-[#0a66c2] bg-[#0a66c2]"
          : "border-black/10 bg-black/10"
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.24)] transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
