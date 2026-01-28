import Link from "next/link";

type FeatureCardProps = {
  title: string;
  desc: string;
  href: string;
  emoji: string;
};

export default function FeatureCard({
  title,
  desc,
  href,
  emoji,
}: FeatureCardProps) {
  const isPdf = href.toLowerCase().endsWith(".pdf");

  return (
    <Link
      href={href}
      target={isPdf ? "_blank" : undefined}
      rel={isPdf ? "noopener noreferrer" : undefined}
      className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-2xl">{emoji}</div>
        <div className="text-xs text-zinc-400 group-hover:text-zinc-200">
          {isPdf ? "Open PDF →" : "Open →"}
        </div>
      </div>
      <div className="mt-4 text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-zinc-400">{desc}</div>
    </Link>
  );
}
