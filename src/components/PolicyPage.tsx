type Section = { h: string; p: string[] };

// Shared renderer for legal/policy pages (privacy, accessibility).
export function PolicyPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold uppercase text-dust-50 md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-dust-400">{updated}</p>
      <p className="mt-6 max-w-2xl text-lg text-dust-200">{intro}</p>

      <div className="mt-10 max-w-2xl space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold uppercase text-dust-50">{s.h}</h2>
            <div className="mt-3 space-y-2 text-dust-200">
              {s.p.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
