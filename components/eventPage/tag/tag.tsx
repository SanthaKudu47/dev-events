export default function Tag({ label }: { label: string }) {
  return <div className="p-1 rounded-sm bg-tag-bg text-text">{label}</div>;
}
