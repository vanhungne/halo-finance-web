export default function GroupEmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-5 py-9 text-center sm:py-12">
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-blue-50 text-blue-700 [&>svg]:size-6 [&>svg]:stroke-[1.65]">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
