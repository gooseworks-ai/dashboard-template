const EXAMPLE_PROMPTS = [
  "Build me a revenue dashboard with MRR and new deals this week",
  "Show me a campaign tracker — opens, clicks, replies per campaign",
  "Add a churn chart broken down by cohort",
  "Make a lead pipeline view with counts by stage",
];

export default function Overview() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
          <span className="text-base">✨</span>
        </div>
        <h1 className="text-xl font-normal text-stone-900">
          What do you want to see here?
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Tell your agent in the chat on the right — a revenue chart, a
          campaign tracker, a team roster. It will build the page and it'll
          show up here.
        </p>

        <div className="mt-8 text-left">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-stone-400">
            Try asking
          </div>
          <ul className="flex flex-col gap-1.5">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <li
                key={prompt}
                className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
