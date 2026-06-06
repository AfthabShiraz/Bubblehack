import SiteMast from "@/components/SiteMast";

const phases = [
  {
    id: "01",
    label: "Phase 01 · Discovery",
    title: "Tender Identification & Qualification",
    color: "blue" as const,
    intro:
      "We started by helping businesses identify and qualify tender opportunities, but interviews revealed that finding opportunities was a broader problem than tenders alone.",
    interviews: [
      {
        name: "Simon Rozee",
        role: "Head of Sales Operations",
        company: "Paragon",
        avatar: "/avatars/SimonRozee.png",
        insight:
          "Finding the right tenders is mostly manual — we're checking multiple portals, filtering by hand, and half the time we've already missed the deadline by the time we find it.",
        tag: "Opportunity Discovery",
        recording: "https://web.plaud.ai/s/pub_4160de0c-5c33-4f6b-bc21-07444dd29cb0::y8W1B-mlnLCA0kkmPORySRQ59chAcTGnUdQePNhrU2L2Q-QETJx7uWZlEsLLHDsoIKB-b3qDz8BMsj1WYr4C",
      },
      {
        name: "Beth Sugg",
        role: "Bid Manager",
        company: "Paragon Brand Services",
        avatar: "/avatars/BethSugg.jpeg",
        insight:
          "The worst part of my job is spending two days writing a bid and then realising we never had a real chance. Better qualification upfront would save everyone's time.",
        tag: "Qualification Waste",
        recording: null,
      },
      {
        name: "Verity Halliday",
        role: "Digital Marketing & Communications Manager",
        company: "Paragon Global Brands",
        avatar: "/avatars/VerityHaliday.jpeg",
        insight:
          "From a brand perspective, we need to be selective. Winning the wrong tender can damage relationships if you're stretched too thin to deliver.",
        tag: "Strategic Fit",
        recording: "https://web.plaud.ai/s/pub_93f51d69-8f82-4cfc-8069-7599b425b354::a-OJH0tlWDVkFCNXJl2tKVkM3YOuY3o3ATTQBXw97MXxj-lpi3IxkKaOYz_ipcGlcnJrRleqaXJ1XyqwTzYC",
      },
      {
        name: "Alexandra O'Neil",
        role: "Bid Manager · Private Market Liaison",
        company: "Paragon Brand Services",
        avatar: "/avatars/AlexandraO%27Neil.jpeg",
        insight:
          "Private sector opportunities don't come through a portal. You hear about them through relationships — or you miss them entirely.",
        tag: "Market Visibility",
        recording: "https://web.plaud.ai/s/pub_4c01ea2c-4959-490c-ab09-bcfed741b9e9::qNg1mbi8-jGVK21V3f7z2vAZNy2euFxpb8WlNl0j0eWtwjLrAFGj89vg0hlLfUvXLwe5_oSNQc_s1zVtV5MC",
      },
      {
        name: "Mark Bickers",
        role: "Head of Public Sector Bids · Public Sector Liaison",
        company: "Paragon Customer Communications",
        avatar: "/avatars/MarkBickers.jpeg",
        insight:
          "There are thousands of public sector contracts published every week. Even with Find a Tender, the signal-to-noise ratio is terrible. You need intelligence, not just aggregation.",
        tag: "Signal vs Noise",
        recording: "https://web.plaud.ai/s/pub_c5c15ea7-74a5-4dcd-b69f-c8e30cb64876::U03JKbqoNYkMea-EueiOmU1Bp_jDPFOxSJx2q7j55BYNGlGolhxV_yVKBha8Rpw78pxthZnbdcrirPE46qAC",
      },
    ],
    transition: {
      heading: "Qualification → Lead Discovery",
      summary:
        "Early conversations showed that qualification wasn't the bottleneck — discovering the right opportunities was. Users didn't just need better tender analysis. They needed a way to find opportunities they didn't know existed.",
      accentClass: "border-blue-400",
      textClass: "text-blue-900",
    },
  },
  {
    id: "02",
    label: "Phase 02 · Pivot",
    title: "B2C Lead Discovery",
    color: "amber" as const,
    intro:
      "Small business owners told us they spend more time searching for customers than serving them. Customer interviews revealed that opportunity discovery extends beyond procurement into every industry.",
    interviews: [
      {
        name: "John Price",
        role: "Exited Founder & CGO",
        company: "Paragon Brand Services",
        avatar: "/avatars/JohnPrice.jpeg",
        insight:
          "You're solving tenders, but the real problem is bigger. Every small business owner is trying to find customers. What if AI could surface buying intent wherever it naturally appears?",
        tag: "The Pivot",
        recording: "https://web.plaud.ai/s/pub_80933227-6c58-44dc-8382-247c25a6df37::1F251pTYJtTG4iDKqIemgNxwIpxzYubV0vcYJ7J9Y31v2XJ1x89B0Dq0DlvT_THrWv0f-XodCO8eh5JP0JcC",
      },
      {
        name: "Tristan",
        role: "Independent Contractor",
        company: "Met on the Train",
        avatar: "https://i.pravatar.cc/300?u=tristan-cleaner",
        insight:
          "I'd scroll through local Facebook groups when I was starting out. People post when they're moving, when they've had a big event. You can see the demand if you know where to look.",
        tag: "Intent Signals",
        recording: null,
      },
    ],
    transition: {
      heading: "Lead Discovery → Network Intelligence",
      summary:
        "As we explored lead generation, a recurring theme emerged: the highest-converting opportunities come from trusted relationships. The most valuable opportunities weren't hidden on the internet — they were hidden inside existing networks.",
      accentClass: "border-amber-400",
      textClass: "text-amber-900",
    },
  },
];

const productJourney = [
  {
    node: "1",
    label: "Call 01",
    title: "The first requirement",
    person: "Family business partner",
    tag: "The Origin",
    narrative:
      "Our final pivot began with a conversation with my dad. Months earlier, he and his business partner had sat down with me to start documenting his network — his work is built on maintaining a large network and connecting people, and we were doing it all in Excel sheets and by hand. He told us his core requirement: he wanted to talk to an AI chat that held his entire personal network as context. That was the beginning of thinked-in. We built an MVP that took a LinkedIn CSV upload and let him reason across his whole network.",
    quote: "I started putting all of my contacts on the Excel sheet anyway.",
  },
  {
    node: "2",
    label: "Call 02",
    title: "Feedback & refinement",
    person: "Thajudeen Shiraz · Collaborator",
    tag: "Refinement",
    narrative:
      "We brought the product back to our collaborator, Thajudeen Shiraz, for feedback. He was impressed and suggested further adjustments — including the ability to share connections with people, which we later decided to include in our enterprise plans.",
    quote:
      "Say S sends a document and asks 'hey guys can you do this for me?' We get queries like this. The document contains a project. I'd like to see across my network who can fulfil this work.",
  },
  {
    node: "3",
    label: "Call 03",
    title: "Enterprise contract",
    person: "Thajudeen Shiraz · Collaborator",
    tag: "Paid Enterprise",
    narrative:
      "Our collaborator was impressed enough at this stage to sign an enterprise contract, paying in advance for access to our enterprise build. On our most recent call about the platform, he flagged a concern about employees uploading their entire network onto a company plan — which told us we need granular control over exactly which connections are used in enterprise plans.",
    quote: "Nobody is ever going to put their whole thing on the company.",
  },
  {
    node: "✦",
    label: "Message",
    title: "External validation",
    person: "Founder · Morpheus",
    tag: "Market Validation",
    narrative:
      "I discussed the product with Morpheus, a startup I work for that's building an AI associate for private markets. The founder's reaction proved the use case extends even further into enterprise.",
    quote: "By the way, this is actually the network connector we want to build at Morpheus.",
  },
];

const colorMap = {
  blue: {
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    tag: "bg-blue-100 text-blue-700",
    quoteBar: "border-blue-300",
    quoteText: "text-zinc-700",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
    tag: "bg-amber-100 text-amber-700",
    quoteBar: "border-amber-300",
    quoteText: "text-zinc-700",
  },
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteMast />

      <div className="mx-auto max-w-2xl px-8 pb-24 pt-10">

        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            User Research · June 2025
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900">
            The Road to thinked-in
          </h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-zinc-500">
            Seven conversations across three pivots — from tender automation to
            network intelligence.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400">
            Click the
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-medium text-zinc-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Listen
            </span>
            buttons to hear the interviews
          </p>
        </div>

        {/* Timeline — all nodes in w-[72px] wrapper, line center at left-9 (36px) */}
        <div className="relative">
          <div className="absolute left-9 top-0 h-full w-0.5 bg-zinc-300" />

          {phases.map((phase) => {
            const c = colorMap[phase.color];
            return (
              <div key={phase.id} className="mb-4">

                {/* Phase dot + header */}
                <div className="relative flex items-start gap-4 mb-8">
                  <div className="flex w-[72px] shrink-0 items-start justify-center">
                    <div
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${c.dot} text-sm font-bold text-white shadow-md ring-4 ring-white`}
                    >
                      {phase.id}
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
                      {phase.label}
                    </span>
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                      {phase.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                      {phase.intro}
                    </p>
                  </div>
                </div>

                {/* Interview rows */}
                <div className="flex flex-col gap-6 mb-10">
                  {phase.interviews.map((person) => (
                    <div key={person.name} className="relative flex items-start gap-4">
                      {/* Avatar as timeline node — w-14 wrapper keeps it centered on the line */}
                      <div className="flex w-[72px] shrink-0 justify-center">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="relative z-10 h-[72px] w-[72px] rounded-full object-cover ring-4 ring-white shadow-sm"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                          <span className="text-sm font-semibold text-zinc-900">{person.name}</span>
                          <span className="text-xs text-zinc-400">{person.role} · {person.company}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.tag}`}>
                            {person.tag}
                          </span>
                          {person.recording && (
                            <a
                              href={person.recording}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                            >
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                              </span>
                              Listen
                            </a>
                          )}
                        </div>
                        {/* Quote with colored left accent bar */}
                        <p className={`border-l-2 pl-3 text-sm italic leading-relaxed ${c.quoteBar} ${c.quoteText}`}>
                          &ldquo;{person.insight}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transition — editorial callout with colored left rule */}
                {phase.transition && (
                  <div className="relative ml-[88px] mb-14">
                    {/* Connector dot on line */}
                    <div className="absolute -left-[52px] top-3 h-3 w-3 rounded-full bg-zinc-400 ring-2 ring-white z-10" />
                    <div className={`border-l-2 pl-5 ${phase.transition.accentClass}`}>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        {phase.transition.heading}
                      </p>
                      <p className={`text-base font-medium leading-relaxed ${phase.transition.textClass}`}>
                        {phase.transition.summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Phase 3 — Final Product */}
          <div className="relative">
            <div className="relative flex items-start gap-4 mb-8">
              <div className="flex w-[72px] shrink-0 justify-center">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md ring-4 ring-white">
                  03
                </div>
              </div>
              <div className="pt-2">
                <span className="mb-1.5 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Phase 03 · Product
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                  thinked-in — Chat with your Network
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  A personal AI you can talk to that holds your entire professional network as context. What started as Excel sheets became thinked-in — built, refined, and validated through real users and a paid enterprise contract.
                </p>
              </div>
            </div>

            {/* Product journey — calls */}
            <div className="flex flex-col gap-6 mb-10">
              {productJourney.map((call) => (
                <div key={call.label} className="relative flex items-start gap-4">
                  {/* Node on the timeline */}
                  <div className="flex w-[72px] shrink-0 justify-center">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white ring-4 ring-white shadow-sm">
                      {call.node}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                      {call.label}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                      <span className="text-sm font-semibold text-zinc-900">{call.title}</span>
                      <span className="text-xs text-zinc-400">{call.person}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {call.tag}
                      </span>
                    </div>
                    <p className="mb-2 text-sm leading-relaxed text-zinc-500">{call.narrative}</p>
                    <p className="border-l-2 border-emerald-400 pl-3 text-sm italic leading-relaxed text-emerald-900">
                      &ldquo;{call.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* End cap */}
            <div className="mt-12 ml-[88px] rounded-xl bg-zinc-900 px-6 py-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                The Product
              </p>
              <p className="text-lg font-semibold text-white tracking-tight">thinked-in</p>
              <p className="mt-1 text-sm text-zinc-400">Your network, made conversational.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
