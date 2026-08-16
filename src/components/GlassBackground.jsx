export default function GlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-fuchsia-600 to-purple-900" />
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary opacity-50 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-400 opacity-40 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-400 opacity-40 blur-3xl" />
      <div className="absolute left-2/3 top-1/4 h-64 w-64 rounded-full bg-purple-300 opacity-30 blur-3xl" />
    </div>
  )
}
