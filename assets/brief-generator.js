/*
 * Brief Generator data + logic.
 *
 * Content-authoring contract for INDUSTRIES pools (read this before editing pools):
 *   - foundingVerb: a bare gerund ("bottling", "coding") — used as `began {foundingVerb} {productNoun}`.
 *   - productNoun: a bare noun phrase with NO article, singular-or-mass ("cold-brew coffee",
 *     "a scheduling tool" is wrong — use "scheduling software" instead) — always used bare, never with {a:}.
 *   - qualityTrait: a bare noun phrase used after "known for" / "built on" — no article needed.
 *   - trend: a bare noun phrase used after "reshaped by" / "driven by", or sentence-initial via {trend|Cap}.
 *   - primary: a short noun phrase describing the audience, usable both sentence-initial (via {primary|Cap})
 *     and after "Think of" — no leading article.
 *   - secondary / tertiary: verb phrases with NO subject pronoun ("cook at home most nights"), so they
 *     read naturally after both "who" and "they".
 *   - competitorPositioning: full one-line clauses used directly, no template.
 * Shared/global pools (originPlace, companySize) follow the same shape rules and are reused by every industry.
 */
(function () {
  "use strict";

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function weightedPick(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = Math.random() * total;
    for (const [key, w] of entries) {
      roll -= w;
      if (roll <= 0) return key;
    }
    return entries[0][0];
  }

  function aOrAn(word) {
    return /^[aeiou]/i.test(word) ? "an" : "a";
  }

  function fillTemplate(template, tokens) {
    return template.replace(/\{(a:)?(\w+)(\|Cap)?\}/g, (match, article, key, cap) => {
      let value = tokens[key];
      if (value == null) {
        console.warn(`Brief generator: missing token "${key}" for template: ${template}`);
        return "";
      }
      if (cap) value = value.charAt(0).toUpperCase() + value.slice(1);
      return article ? `${aOrAn(value)} ${value}` : value;
    });
  }

  // ---------------------------------------------------------------------
  // Shared/global pools
  // ---------------------------------------------------------------------

  const FIRST_NAMES = ["Mara", "Ines", "Theo", "Priya", "Noor", "Callum", "Yuki", "Idris", "Greta", "Bo", "Elena", "Kwame", "Saoirse", "Diego"];
  const YEARS_AGO = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

  const ORIGIN_PLACES = [
    "a spare bedroom",
    "a rented garage",
    "a college dorm room",
    "nights and weekends after a day job",
    "a shared studio space",
    "their grandparents' old workshop",
    "a two-person setup with a single laptop",
    "a converted shipping container",
  ];

  const COMPANY_SIZES = ["boutique", "family-run", "fast-growing", "venture-backed", "bootstrapped", "twelve-person", "thirty-person", "scrappy"];

  const TONE_GROUPS = [
    ["Bold", "Loud", "Energetic"],
    ["Minimal", "Quiet", "Restrained"],
    ["Playful", "Fun", "Whimsical"],
    ["Luxurious", "Premium", "Refined"],
    ["Warm", "Approachable", "Friendly"],
    ["Rebellious", "Edgy", "Disruptive"],
    ["Trustworthy", "Grounded", "Reliable"],
  ];

  const DELIVERABLES_POOL = [
    "Logo & wordmark",
    "Business card / stationery suite",
    "Packaging design",
    "Social media template kit",
    "Website landing page",
    "App icon & UI kit",
    "Signage / environmental graphics",
    "One-page brand guidelines",
    "Email newsletter template",
    "Merch (t-shirt / tote)",
    "Pitch deck template",
    "Poster / flyer campaign",
    "Loyalty card / QR menu",
    "Icon set / pictogram system",
    "Trade show booth graphic",
  ];

  const SUFFIXES = ["Co.", "Studio", "Labs", "Collective", "House", "& Partners"];
  const SYNTH = {
    onsets: ["Vel", "Nor", "Aur", "Zeph", "Kest", "Bri", "Quor", "Fen", "Ost", "Mon", "Tal", "Riv"],
    nuclei: ["a", "o", "i", "eo", "yn", "u", "ae"],
    codas: ["ra", "lis", "vion", "dex", "nova", "tik", "form", "th", "mo", "land"],
  };
  const SURNAME_ROOTS = ["Marchett", "Reyes", "Finch", "Amara", "Solberg", "Okafor", "Vance", "Delgad", "Bianchi", "Okonkwo"];
  const SURNAME_ENDINGS = ["i", "son", "ley", "ford", "wick", "mont", ""];

  // Shared sentence frames. Only the token pools differ per industry.
  const BACKGROUND_TEMPLATES = [
    "{companyName} started in {foundingYear} when {founderFirst} began {foundingVerb} {productNoun} out of {originPlace}. What began as a side project has grown into {a:companySize} business known for {qualityTrait}.",
    "Founded in {foundingYear} out of {originPlace}, {companyName} makes {productNoun} — the kind of thing {founderFirst} always wished existed. Today it's {a:companySize} team still obsessed with {qualityTrait}.",
    "{founderFirst} launched {companyName} in {foundingYear} after years of {foundingVerb} {productNoun} out of {originPlace}. What's now {a:companySize} company was built from day one on {qualityTrait}.",
  ];

  const AUDIENCE_TEMPLATES = [
    "{primary|Cap}, who {secondary} and {tertiary}.",
    "Think of {primary} — they {secondary}, and {tertiary}.",
  ];

  const CONTEXT_TEMPLATES = [
    "The category is being reshaped by {trend}, and independent brands are taking share from legacy players on story and craft alone.",
    "Momentum in the space is being driven by {trend}, pressuring anyone who hasn't kept pace.",
    "{trend|Cap} is redefining what customers expect, leaving slower-moving competitors exposed.",
  ];

  // ---------------------------------------------------------------------
  // Industries
  // ---------------------------------------------------------------------

  const INDUSTRIES = [
    {
      id: "food-beverage",
      label: "Food & Beverage",
      nameBank: {
        modifiers: ["Copper", "Golden", "Wild", "Salt", "Amber", "Humble", "Rustic", "Bright"],
        nouns: ["Ferment", "Larder", "Harvest", "Kettle", "Grove", "Mill", "Pantry", "Bramble"],
      },
      nameStrategyWeights: { compound: 0.55, synthetic: 0.15, founder: 0.3 },
      foundingVerb: ["bottling", "baking", "brewing", "roasting", "fermenting", "pickling"],
      productNoun: ["small-batch hot sauces", "cold-brew coffee", "wild-fermented sodas", "sourdough loaves", "single-origin chocolate", "artisan preserves"],
      qualityTrait: ["honest ingredients", "bold flavour", "zero-waste sourcing", "small-batch craft", "recipes passed down for generations"],
      trend: ["low-and-slow fermentation", "hyper-local sourcing", "clean-label ingredients", "nostalgia-driven comfort food", "direct-to-consumer subscription snacking"],
      primary: ["home cooks in their late 20s and 30s", "adults aged 25-40 who eat out often", "budget-conscious families shopping weekly", "food-curious professionals with disposable income", "health-focused shoppers in their 30s and 40s"],
      secondary: ["cook at home most nights", "care where their ingredients come from", "follow food creators on social media", "shop at farmers markets on weekends", "read the label before they read the price"],
      tertiary: ["will pay a premium for quality", "are price-conscious but flavour-first", "treat good food as a small daily luxury", "expect the brand to match their values", "are quick to switch if a competitor tastes better"],
      competitorPositioning: [
        "the mass-market shelf staple everyone already knows",
        "the premium artisanal player selling on provenance",
        "the scrappy direct-to-consumer challenger shipped in eco packaging",
        "the wellness-adjacent brand chasing the health-conscious aisle",
      ],
    },
    {
      id: "fashion-apparel",
      label: "Fashion & Apparel",
      nameBank: {
        modifiers: ["Field", "Northern", "Loose", "Common", "Second", "Bare", "Folded", "Quiet"],
        nouns: ["Thread", "Seam", "Atelier", "Wardrobe", "Denim", "Cloth", "Stitch", "Weave"],
      },
      nameStrategyWeights: { compound: 0.45, synthetic: 0.2, founder: 0.35 },
      foundingVerb: ["cutting", "stitching", "designing", "sewing", "pattern-making", "screen-printing"],
      productNoun: ["minimalist ready-to-wear", "hand-stitched leather goods", "sustainable everyday basics", "limited-run streetwear", "tailored workwear"],
      qualityTrait: ["fabric-first design", "a strict small-batch production run", "fit that actually flatters real bodies", "a refusal to chase seasonal trends"],
      trend: ["a backlash against fast fashion", "the rise of resale and rental", "genderless and size-inclusive collections", "slow fashion built to last a decade"],
      primary: ["style-conscious adults in their 20s and 30s", "design-minded professionals building a capsule wardrobe", "Gen Z shoppers who buy secondhand first", "budget-savvy shoppers who still want it to look expensive"],
      secondary: ["scroll lookbooks before they scroll the news", "buy fewer, better pieces on purpose", "care deeply about how something's made", "mix high and low without a second thought"],
      tertiary: ["will pay more for something that lasts", "expect transparency about factories and materials", "are loyal once a brand fits them right", "switch fast if the quality doesn't hold up"],
      competitorPositioning: [
        "the fast-fashion giant with next-day everything",
        "the heritage label coasting on its archive",
        "the direct-to-consumer basics brand undercutting everyone on price",
        "the resale platform quietly eating retail's margins",
      ],
    },
    {
      id: "wellness-health",
      label: "Wellness & Health",
      nameBank: {
        modifiers: ["Still", "Bloom", "Even", "Whole", "Root", "Hush", "Tide", "Soft"],
        nouns: ["Practice", "Studio", "Ritual", "Balm", "Circle", "Field", "Ground", "Method"],
      },
      nameStrategyWeights: { compound: 0.5, synthetic: 0.35, founder: 0.15 },
      foundingVerb: ["teaching", "formulating", "developing", "practicing", "building"],
      productNoun: ["guided breathwork sessions", "small-batch skin balms", "a strength-training app", "adaptogenic supplements", "one-on-one coaching programmes"],
      qualityTrait: ["clinically-informed simplicity", "ingredients you can actually pronounce", "a refusal to promise overnight results", "genuine one-on-one attention"],
      trend: ["a shift from quick fixes to sustainable habits", "growing distrust of wellness fads", "the rise of at-home, data-tracked fitness", "demand for mental health support that isn't clinical or cold"],
      primary: ["busy professionals managing burnout", "new parents rebuilding a routine", "adults aged 30-50 easing into fitness again", "people recovering from an injury or a health scare"],
      secondary: ["are tired of being sold quick fixes", "want a routine that actually fits their week", "research everything before they commit", "have tried and abandoned a dozen other apps"],
      tertiary: ["will commit long-term if they see real change", "are sceptical of anything that sounds too good", "value a human touch over pure automation", "expect the brand to be honest about limits"],
      competitorPositioning: [
        "the big-box gym chain everyone has a membership to and never uses",
        "the venture-backed app burning cash on ads",
        "the boutique studio charging a premium for community",
        "the supplement brand relying on influencer hype",
      ],
    },
    {
      id: "technology-saas",
      label: "Technology / SaaS",
      nameBank: {
        modifiers: ["Nimbus", "Vertex", "Loop", "Grid", "Signal", "Arc", "Northstar", "Clearpath"],
        nouns: ["Base", "Stack", "Flow", "Hub", "Works", "Sync", "Path", "Ledger"],
      },
      nameStrategyWeights: { compound: 0.3, synthetic: 0.55, founder: 0.15 },
      foundingVerb: ["building", "prototyping", "shipping", "coding", "automating"],
      productNoun: ["a scheduling tool", "an internal analytics dashboard", "a workflow automation layer", "an AI writing assistant", "a customer support inbox", "a no-code database"],
      qualityTrait: ["fast, opinionated software", "obsessive attention to onboarding", "an unusually responsive support team", "a product roadmap shaped entirely by user requests"],
      trend: ["AI-assisted workflows replacing manual busywork", "a shift away from bloated all-in-one suites toward focused tools", "a wave of budget scrutiny on software spend", "buyers demanding self-serve pricing over sales calls"],
      primary: ["small-team operations leads", "solo founders wearing every hat", "mid-market IT managers under pressure to cut costs", "product managers at scaling startups"],
      secondary: ["are drowning in disconnected spreadsheets", "got burned by a tool that didn't scale", "are tired of paying for features they never use", "need something live before the next board meeting"],
      tertiary: ["are cautious about switching costs but open to it", "expect a demo that works on the first click", "will churn fast if onboarding is confusing", "care more about reliability than flashy features"],
      competitorPositioning: [
        "the entrenched enterprise incumbent everyone complains about",
        "the well-funded challenger burning cash on growth",
        "the scrappy open-source alternative with a cult following",
        "the spreadsheet nobody has managed to fully replace yet",
      ],
    },
    {
      id: "finance-fintech",
      label: "Finance / Fintech",
      nameBank: {
        modifiers: ["Steady", "Northbound", "Plain", "Clear", "Anchor", "Sound", "Even", "Ledger"],
        nouns: ["Vault", "Balance", "Wallet", "Compass", "Reserve", "Bridge", "Path", "Harbor"],
      },
      nameStrategyWeights: { compound: 0.4, synthetic: 0.35, founder: 0.25 },
      foundingVerb: ["building", "designing", "launching", "modelling"],
      productNoun: ["a personal budgeting app", "fee-free international transfers", "a robo-advised investment account", "a small-business lending platform", "a shared family finance tool"],
      qualityTrait: ["radical fee transparency", "bank-grade security without the jargon", "a genuinely useful mobile-first experience", "advice that isn't secretly a sales pitch"],
      trend: ["a generational shift away from traditional banks", "growing demand for financial transparency", "embedded finance showing up inside every app", "distrust of legacy institutions after years of hidden fees"],
      primary: ["freelancers managing irregular income", "first-time investors in their 20s", "small business owners doing their own books", "dual-income households trying to budget together"],
      secondary: ["are anxious about money but avoid thinking about it", "have never trusted a bank's app before this", "want to understand their finances without a finance degree", "split expenses constantly and hate doing the math"],
      tertiary: ["will switch immediately if a fee feels hidden", "expect real-time visibility into every transaction", "are loyal once they trust the brand with their money", "research reviews obsessively before signing up"],
      competitorPositioning: [
        "the legacy bank with an app nobody enjoys using",
        "the venture-backed neobank burning cash on referral bonuses",
        "the spreadsheet-and-willpower approach most people still default to",
        "the robo-advisor with a beautiful UI and mediocre returns",
      ],
    },
    {
      id: "education",
      label: "Education",
      nameBank: {
        modifiers: ["Bright", "Open", "Forward", "Foundry", "Compass", "Ground", "Curious", "North"],
        nouns: ["Academy", "Studio", "Lab", "Path", "Cohort", "Bench", "School", "Atlas"],
      },
      nameStrategyWeights: { compound: 0.5, synthetic: 0.25, founder: 0.25 },
      foundingVerb: ["teaching", "tutoring", "designing", "building", "mentoring"],
      productNoun: ["a cohort-based design course", "one-on-one exam tutoring", "a self-paced coding curriculum", "an after-school arts programme", "a mentorship platform for career switchers"],
      qualityTrait: ["small class sizes that actually work", "curriculum built with working practitioners", "a refusal to grade on attendance alone", "real portfolio outcomes over certificates"],
      trend: ["a shift from credentials toward provable skills", "growing scepticism about traditional degree costs", "demand for flexible, self-paced learning", "AI tools changing what's worth teaching by hand"],
      primary: ["career-changers in their late 20s and 30s", "high schoolers preparing for competitive exams", "working professionals upskilling on evenings and weekends", "parents choosing enrichment programmes for their kids"],
      secondary: ["are anxious about wasting time on the wrong course", "compare a dozen programmes before committing", "learn best with structure and real deadlines", "want proof the skill will actually get them hired"],
      tertiary: ["will pay more for a real instructor over a video library", "expect a community, not just content", "are quick to drop out if it feels impersonal", "judge the programme entirely by outcomes, not marketing"],
      competitorPositioning: [
        "the massive open online platform with a tiny completion rate",
        "the traditional institution charging ten times the price",
        "the free YouTube-and-forums route most people try first",
        "the bootcamp promising a job in twelve weeks",
      ],
    },
    {
      id: "nonprofit-social-impact",
      label: "Nonprofit / Social Impact",
      nameBank: {
        modifiers: ["Common", "Open", "Bridge", "Neighbour", "Forward", "Shared", "Rooted", "Widen"],
        nouns: ["Ground", "Fund", "Circle", "Commons", "Collective", "Relief", "Alliance", "Trust"],
      },
      nameStrategyWeights: { compound: 0.5, synthetic: 0.1, founder: 0.4 },
      foundingVerb: ["organising", "fundraising", "building", "advocating for", "coordinating"],
      productNoun: ["free after-school meal programmes", "emergency housing support", "a community mental health hotline", "local climate resilience projects", "a legal aid clinic for renters"],
      qualityTrait: ["every dollar tracked and published openly", "a volunteer base that keeps coming back", "partnerships with the neighbourhoods it actually serves", "results measured in people, not just funds raised"],
      trend: ["donor fatigue pushing nonprofits to prove real impact", "a shift toward direct, transparent giving over large institutions", "growing demand for hyper-local, community-led solutions", "younger donors expecting reporting as detailed as any startup's"],
      primary: ["monthly recurring donors in their 30s and 40s", "local volunteers looking for hands-on ways to help", "corporate partners seeking genuine community ties", "families directly affected by the issue the org addresses"],
      secondary: ["want to see exactly where their money goes", "give small amounts often rather than one big gift", "are wary of overhead-heavy charities", "show up in person when they can, not just online"],
      tertiary: ["will stop giving the moment trust is broken", "expect a story, not just a statistic", "are more loyal to a cause than to a single organisation", "need to feel like their contribution actually moved something"],
      competitorPositioning: [
        "the large legacy charity everyone's heard of but few trust fully",
        "the crowdfunding platform taking a cut of every donation",
        "the grassroots group with heart but no visibility",
        "the corporate-sponsored initiative that feels more like PR",
      ],
    },
    {
      id: "hospitality-travel",
      label: "Hospitality & Travel",
      nameBank: {
        modifiers: ["Harbor", "Wander", "Quiet", "Southbound", "Open", "Drift", "Local", "Golden"],
        nouns: ["Inn", "Route", "Camp", "Lodge", "Passage", "Trail", "Retreat", "Harbour"],
      },
      nameStrategyWeights: { compound: 0.55, synthetic: 0.15, founder: 0.3 },
      foundingVerb: ["renovating", "hosting", "guiding", "building", "curating"],
      productNoun: ["boutique stays in overlooked towns", "small-group guided hiking trips", "a platform for booking local, independent hosts", "slow-travel itineraries off the main tourist route", "a members' club for remote workers who travel"],
      qualityTrait: ["a genuinely local, unpolished feel", "hosts who actually know the area", "a refusal to overbook or oversell", "details that make a stay feel considered, not templated"],
      trend: ["a backlash against overtourism and identikit hotels", "demand for slower, more immersive travel", "remote work blurring the line between travel and living", "travellers researching everything themselves instead of trusting agencies"],
      primary: ["remote workers stretching a trip into a month", "couples celebrating a milestone without a five-star budget", "solo travellers in their late 20s and 30s", "families wanting an experience over a checklist of sights"],
      secondary: ["research obsessively before booking anything", "want to feel like locals, not tourists", "book last-minute more than they used to", "compare a dozen reviews before trusting a single listing"],
      tertiary: ["will pay more for something that feels authentic", "expect flexible cancellation as standard, not a luxury", "are loyal to hosts and places, not platforms", "are quick to leave a public review either way"],
      competitorPositioning: [
        "the global booking platform with an endless, faceless catalogue",
        "the big hotel chain optimised for consistency over character",
        "the influencer-driven pop-up destination that peaks and fades",
        "the traditional travel agent most of this audience has stopped using",
      ],
    },
    {
      id: "beauty-cosmetics",
      label: "Beauty & Cosmetics",
      nameBank: {
        modifiers: ["Bare", "Dew", "Second", "Hush", "Clean", "Velvet", "Undone", "Mineral"],
        nouns: ["Skin", "Glow", "Studio", "Ritual", "Bloom", "Lab", "Face", "Vanity"],
      },
      nameStrategyWeights: { compound: 0.5, synthetic: 0.3, founder: 0.2 },
      foundingVerb: ["formulating", "mixing", "testing", "developing"],
      productNoun: ["clean, fragrance-free skincare", "a modular makeup system", "gender-neutral grooming essentials", "dermatologist-developed serums", "refillable beauty basics"],
      qualityTrait: ["formulas tested on real skin, not just in a lab", "ingredient lists you don't need a chemistry degree to read", "packaging designed to actually be refilled", "a refusal to reformulate every season for hype"],
      trend: ["consumers scrutinising ingredient lists like nutrition labels", "a shift toward skincare as self-care over quick transformation", "clean beauty claims facing more scrutiny than ever", "refillable and low-waste packaging becoming a real expectation"],
      primary: ["skincare-obsessed adults in their 20s and 30s", "people with sensitive skin who've been burned before", "minimalists who want a five-step routine cut to two", "Gen Z shoppers who research every ingredient before buying"],
      secondary: ["read the full ingredient list before the marketing copy", "follow dermatologists and estheticians more than influencers", "have a drawer full of products that didn't work", "switch brands fast when something breaks them out"],
      tertiary: ["will pay a premium for formulas that are actually gentle", "expect full transparency about testing and sourcing", "are loyal once something finally works for their skin", "are sceptical of any brand promising instant results"],
      competitorPositioning: [
        "the drugstore staple everyone's tried at least once",
        "the celebrity-founded brand riding a single viral moment",
        "the luxury department-store line selling on prestige alone",
        "the clinical dermatology brand that feels more medicine than beauty",
      ],
    },
    {
      id: "music-entertainment",
      label: "Music & Entertainment",
      nameBank: {
        modifiers: ["Afterglow", "Low", "Analog", "Static", "Nightline", "Echo", "Paper", "Neon"],
        nouns: ["Records", "Studio", "Sessions", "Collective", "Waves", "Tape", "Reel", "Stage"],
      },
      nameStrategyWeights: { compound: 0.45, synthetic: 0.3, founder: 0.25 },
      foundingVerb: ["recording", "producing", "booking", "curating", "promoting"],
      productNoun: ["a vinyl-first independent record label", "live sessions filmed in unconventional spaces", "a platform connecting emerging artists with venues", "a subscription box of undiscovered new music", "short-run festival experiences"],
      qualityTrait: ["a genuine ear for what's next", "real relationships with the artists on the roster", "production values bigger than the budget suggests", "a refusal to chase whatever's trending that week"],
      trend: ["streaming flattening how discovery actually happens", "a resurgence of physical formats like vinyl and tape", "audiences craving live, in-person experiences again", "independent artists bypassing labels entirely"],
      primary: ["music-obsessed listeners in their 20s and 30s", "early adopters who brag about finding artists first", "people who go to more live shows than the average listener", "collectors who still buy vinyl despite streaming everything"],
      secondary: ["discover most new music through friends, not algorithms", "go down genre rabbit holes for hours", "show up early to support the opening act", "will drive across town for the right show"],
      tertiary: ["will pay for physical formats out of loyalty, not necessity", "expect a curated point of view, not just another feed", "are loyal to taste-makers more than platforms", "are quick to champion something the moment they love it"],
      competitorPositioning: [
        "the major label with the marketing budget but not the ear",
        "the streaming platform's algorithmic playlist doing the discovery for free",
        "the festival brand that's grown too big to feel curated",
        "the influencer-run ‘label’ that's really just a merch store",
      ],
    },
  ];

  // ---------------------------------------------------------------------
  // Name generation
  // ---------------------------------------------------------------------

  function generateCompound(industry) {
    const { modifiers, nouns } = industry.nameBank;
    const modifier = pick(modifiers);
    const noun = pick(nouns);
    const style = pick(["concat", "space", "ampersand"]);
    let base;
    if (style === "concat") base = modifier + noun.toLowerCase();
    else if (style === "space") base = `${modifier} ${noun}`;
    else base = `${modifier} & ${noun}`;
    return Math.random() < 0.22 ? `${base} ${pick(SUFFIXES)}` : base;
  }

  function generateSynthetic() {
    const word = pick(SYNTH.onsets) + pick(SYNTH.nuclei) + pick(SYNTH.codas);
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return Math.random() < 0.3 ? `${capitalized} ${pick(SUFFIXES)}` : capitalized;
  }

  function generateFounderStyle() {
    const surname = pick(SURNAME_ROOTS) + pick(SURNAME_ENDINGS);
    return pick([`${surname} & Co`, `${surname} & Sons`, `${surname} Studio`, `House of ${surname}`]);
  }

  function generateBrandName(industry) {
    const strategy = weightedPick(industry.nameStrategyWeights);
    if (strategy === "compound") return generateCompound(industry);
    if (strategy === "founder") return generateFounderStyle();
    return generateSynthetic();
  }

  function generateCompetitors(industry, currentState) {
    const primaryName = currentState.fields.name ? currentState.fields.name.name : "";
    const used = new Set([primaryName.toLowerCase()]);
    const positioningPool = shuffleArray(industry.competitorPositioning).slice(0, 3);
    return positioningPool.map((positioning) => {
      let name;
      let attempts = 0;
      do {
        name = generateBrandName(industry);
        attempts++;
      } while (used.has(name.toLowerCase()) && attempts < 6);
      used.add(name.toLowerCase());
      return { name, positioning };
    });
  }

  // ---------------------------------------------------------------------
  // Field generators (store raw generation choices, not rendered strings)
  // ---------------------------------------------------------------------

  function generateNameField(industry) {
    return {
      name: generateBrandName(industry),
      founderFirst: pick(FIRST_NAMES),
      foundingYear: new Date().getFullYear() - pick(YEARS_AGO),
    };
  }

  function generateBackgroundField(industry) {
    return {
      template: pick(BACKGROUND_TEMPLATES),
      tokens: {
        foundingVerb: pick(industry.foundingVerb),
        productNoun: pick(industry.productNoun),
        originPlace: pick(ORIGIN_PLACES),
        companySize: pick(COMPANY_SIZES),
        qualityTrait: pick(industry.qualityTrait),
      },
    };
  }

  function generateAudienceField(industry) {
    return {
      template: pick(AUDIENCE_TEMPLATES),
      tokens: {
        primary: pick(industry.primary),
        secondary: pick(industry.secondary),
        tertiary: pick(industry.tertiary),
      },
    };
  }

  function generateContextField(industry) {
    return {
      template: pick(CONTEXT_TEMPLATES),
      tokens: { trend: pick(industry.trend) },
    };
  }

  function sampleDeliverables() {
    const count = 5 + Math.floor(Math.random() * 3); // 5-7
    return shuffleArray(DELIVERABLES_POOL).slice(0, count);
  }

  const FIELD_KEYS = ["name", "background", "audience", "context", "competitors", "tone", "deliverables"];

  const FIELD_LABELS = {
    name: "Brand name",
    background: "Background",
    audience: "Target audience",
    context: "Market context",
    competitors: "Competitor snapshot",
    tone: "Brand tone",
    deliverables: "Deliverables",
  };

  const GENERATORS = {
    name: (industry) => generateNameField(industry),
    background: (industry) => generateBackgroundField(industry),
    audience: (industry) => generateAudienceField(industry),
    context: (industry) => generateContextField(industry),
    competitors: (industry, currentState) => generateCompetitors(industry, currentState),
    tone: () => pick(TONE_GROUPS),
    deliverables: () => sampleDeliverables(),
  };

  // ---------------------------------------------------------------------
  // Render (pure functions of state -> strings)
  // ---------------------------------------------------------------------

  function renderBackground(state) {
    const { template, tokens } = state.fields.background;
    const n = state.fields.name;
    return fillTemplate(template, { ...tokens, companyName: n.name, founderFirst: n.founderFirst, foundingYear: n.foundingYear });
  }

  function renderAudience(state) {
    const { template, tokens } = state.fields.audience;
    return fillTemplate(template, tokens);
  }

  function renderContext(state) {
    const { template, tokens } = state.fields.context;
    return fillTemplate(template, tokens);
  }

  // ---------------------------------------------------------------------
  // State + wiring
  // ---------------------------------------------------------------------

  const state = {
    industryId: "random",
    currentIndustryId: null,
    fields: { name: null, background: null, audience: null, context: null, competitors: null, tone: null, deliverables: null },
    locks: { name: false, background: false, audience: false, context: false, competitors: false, tone: false, deliverables: false },
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function resolveIndustry() {
    if (state.industryId === "random") return pick(INDUSTRIES);
    return INDUSTRIES.find((industry) => industry.id === state.industryId) || INDUSTRIES[0];
  }

  function currentIndustry() {
    return INDUSTRIES.find((industry) => industry.id === state.currentIndustryId) || resolveIndustry();
  }

  function announce(message) {
    const el = $("#sr-status");
    if (!el) return;
    el.textContent = "";
    window.setTimeout(() => {
      el.textContent = message;
    }, 30);
  }

  function updateUnlockAllButton() {
    const btn = $("#unlock-all");
    if (!btn) return;
    btn.disabled = !Object.values(state.locks).some(Boolean);
  }

  function syncLockButtons() {
    document.querySelectorAll('.icon-btn[data-action="lock"]').forEach((btn) => {
      const field = btn.dataset.field;
      btn.setAttribute("aria-pressed", String(!!state.locks[field]));
    });
    updateUnlockAllButton();
  }

  function renderAll() {
    const industry = currentIndustry();
    const n = state.fields.name;

    $("#brief-name").textContent = n.name;
    $("#brief-industry-tag").textContent = industry.label;
    $("#brief-founded").textContent = `Founded ${n.foundingYear} by ${n.founderFirst}`;

    $('[data-field-output="background"]').textContent = renderBackground(state);
    $('[data-field-output="audience"]').textContent = renderAudience(state);
    $('[data-field-output="context"]').textContent = renderContext(state);

    const toneHost = $('[data-field-output="tone"]');
    toneHost.innerHTML = "";
    state.fields.tone.forEach((adjective) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = adjective;
      toneHost.appendChild(span);
    });

    const competitorsHost = $('[data-field-output="competitors"]');
    competitorsHost.innerHTML = "";
    state.fields.competitors.forEach((competitor) => {
      const li = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = competitor.name;
      li.append(strong, document.createTextNode(` — ${competitor.positioning}`));
      competitorsHost.appendChild(li);
    });

    const deliverablesHost = $('[data-field-output="deliverables"]');
    deliverablesHost.innerHTML = "";
    state.fields.deliverables.forEach((deliverable) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = deliverable;
      deliverablesHost.appendChild(span);
    });

    syncLockButtons();
  }

  function shuffleAll() {
    const industry = resolveIndustry();
    state.currentIndustryId = industry.id;
    FIELD_KEYS.forEach((field) => {
      if (!state.locks[field]) state.fields[field] = GENERATORS[field](industry, state);
    });
    renderAll();
    announce("New brief generated.");
  }

  function regenerateField(field) {
    if (state.locks[field]) return;
    const industry = currentIndustry();
    state.fields[field] = GENERATORS[field](industry, state);
    renderAll();
    announce(`${FIELD_LABELS[field]} updated.`);
  }

  function toggleLock(field) {
    state.locks[field] = !state.locks[field];
    syncLockButtons();
  }

  function unlockAll() {
    FIELD_KEYS.forEach((field) => {
      state.locks[field] = false;
    });
    syncLockButtons();
  }

  function buildBriefText() {
    const industry = currentIndustry();
    const n = state.fields.name;
    const lines = [
      `${n.name} — Design Brief`,
      `Industry: ${industry.label}`,
      `Founded ${n.foundingYear} by ${n.founderFirst}`,
      "",
      "Background:",
      renderBackground(state),
      "",
      "Target audience:",
      renderAudience(state),
      "",
      "Market context:",
      renderContext(state),
      "",
      "Brand tone:",
      state.fields.tone.join(", "),
      "",
      "Competitors:",
      ...state.fields.competitors.map((c) => `- ${c.name} — ${c.positioning}`),
      "",
      "Deliverables to design:",
      ...state.fields.deliverables.map((d) => `- ${d}`),
    ];
    return lines.join("\n");
  }

  async function copyBrief() {
    const text = buildBriefText();
    const btn = $("#copy-brief");
    try {
      await navigator.clipboard.writeText(text);
      announce("Brief copied to clipboard.");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Copied!";
        window.setTimeout(() => {
          btn.textContent = original;
        }, 1600);
      }
    } catch (err) {
      announce("Couldn't copy automatically. Select the brief text and copy manually.");
    }
  }

  function populateIndustrySelect() {
    const select = $("#industry-select");
    if (!select) return;
    const randomOption = document.createElement("option");
    randomOption.value = "random";
    randomOption.textContent = "Random industry";
    select.appendChild(randomOption);
    INDUSTRIES.forEach((industry) => {
      const option = document.createElement("option");
      option.value = industry.id;
      option.textContent = industry.label;
      select.appendChild(option);
    });
    select.value = "random";
  }

  function init() {
    populateIndustrySelect();

    $("#industry-select").addEventListener("change", (event) => {
      state.industryId = event.target.value;
      shuffleAll();
    });
    $("#shuffle-all").addEventListener("click", () => shuffleAll());
    $("#unlock-all").addEventListener("click", () => unlockAll());
    $("#copy-brief").addEventListener("click", () => copyBrief());
    $("#print-brief").addEventListener("click", () => window.print());

    document.querySelectorAll('.icon-btn[data-action="shuffle"]').forEach((btn) => {
      btn.addEventListener("click", () => regenerateField(btn.dataset.field));
    });
    document.querySelectorAll('.icon-btn[data-action="lock"]').forEach((btn) => {
      btn.addEventListener("click", () => toggleLock(btn.dataset.field));
    });

    shuffleAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
