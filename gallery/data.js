// gallery/data.js — Room layout + theory data for Learning Gallery
// 8-wing radial cathedral pattern radiating from a central dome at 45° intervals.
// Warm stone palette throughout; each wing has its own accent colour.

const ROOMS = {
  atrium: {
    name: "The Cathedral Dome",
    subtitle: "Meta-frameworks, teacher stance & contested ideas",
    center: [0, 0],
    sizeX: 30, sizeZ: 30,
    shape: "circle",
    floor: "#c8b89a",
    floorPattern: "checker",
    wall:  "#e8dcc4",
    accent: "#7a5c3a",
    doors: ["N","S","E","W","NE","NW","SE","SW"],
  },
  design: {
    name: "Design Wing",
    subtitle: "Instructional design, technology & behaviourist models",
    center: [31, 0],
    sizeX: 26, sizeZ: 14,
    angle: 0,
    floor: "#d4c5a0",
    floorPattern: "planks",
    wall:  "#ede0c8",
    accent: "#8b5e3c",
    doors: ["W"],
  },
  cog: {
    name: "Cognition Chapel",
    subtitle: "Cognitive architecture, memory & mental models",
    center: [20.5, -20.5],
    sizeX: 14, sizeZ: 14,
    angle: 45,
    floor: "#cfc0a2",
    floorPattern: "planks",
    wall:  "#e9dfc9",
    accent: "#5a4a7a",
    doors: ["W"],
  },
  mem: {
    name: "Memory Nave",
    subtitle: "Memory, practice strategies & study science",
    center: [0, -32],
    sizeX: 14, sizeZ: 32,
    angle: 90,
    floor: "#d1c3a4",
    floorPattern: "planks",
    wall:  "#ebe2cc",
    accent: "#3a6a5a",
    doors: ["S"],
  },
  mot: {
    name: "Motivation Garden",
    subtitle: "Motivation, self-regulation & learner agency",
    center: [-22, -22],
    sizeX: 20, sizeZ: 14,
    angle: 135,
    floor: "#d6c7a5",
    floorPattern: "planks",
    wall:  "#ede3cc",
    accent: "#6a7a3a",
    doors: ["S"],
  },
  soc: {
    name: "Social Amphitheatre",
    subtitle: "Social & situated learning, constructivism",
    center: [-29, 0],
    sizeX: 16, sizeZ: 16,
    angle: 180,
    shape: "circle",
    floor: "#cec0a2",
    floorPattern: "checker",
    wall:  "#e8dfc9",
    accent: "#3a5a7a",
    doors: ["E"],
  },
  adu: {
    name: "Adult Learning Tower",
    subtitle: "Adult & experiential learning, constructivist approaches",
    center: [-22, 22],
    sizeX: 18, sizeZ: 18,
    angle: 225,
    floor: "#d3c4a3",
    floorPattern: "planks",
    wall:  "#ece1ca",
    accent: "#7a4a5a",
    doors: ["N"],
  },
  eap: {
    name: "EAP Spire",
    subtitle: "EAP-specific frameworks: genre, discourse & academic literacies",
    center: [0, 32],
    sizeX: 8, sizeZ: 26,
    angle: 270,
    floor: "#d0c2a3",
    floorPattern: "planks",
    wall:  "#eae1cb",
    accent: "#5a3a7a",
    doors: ["N"],
  },
  tax: {
    name: "Taxonomy Tower",
    subtitle: "Taxonomies, transfer & expertise",
    center: [22, 22],
    sizeX: 14, sizeZ: 14,
    angle: 315,
    floor: "#d2c4a5",
    floorPattern: "planks",
    wall:  "#ece2cc",
    accent: "#7a6a3a",
    doors: ["N"],
  },
};

// Helper for short authoring of theories
function T(o) { return o; }

// THEORIES: each placed on a specific wall ("N","S","E","W") of its room,
// `t` is offset along that wall in metres (negative = left as you look at it).
const THEORIES = [
  // ═════════════════════════════════════════════════════════════════════════
  // ATRIUM · META-FRAMEWORKS, TEACHER STANCE & CONTESTED THEORIES
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"mccrea", room:"atrium", wall:"N", t:-7,
    title:"McCrea's Nine Principles",
    author:"McCrea, 2018",
    cluster:"Meta-framework",
    style:"grid",
    summary:"Nine empirically-grounded principles that work as a diagnostic checklist for any lesson — covering retention, attention, prior knowledge, motivation, and the slow, cumulative nature of fluency.",
    extendedSummary:"McCrea's value is less as a unified theory than as a portable checklist: nine claims drawn from a wider evidence base that a designer can hold against any planned activity. The framing is deliberately blunt — performance during a session is not learning; we attend to what we value; fluency comes from consolidation — to interrupt the cosier intuitions that often drive teaching choices.",
    keypoints:[
      "Learning is a persistent change in knowledge — performance ≠ learning.",
      "Some things are easier to learn than others; plan extra time for the hard stuff.",
      "What we attend to is what we learn.",
      "We can only attend to a few things at once.",
      "We attend to things we value.",
      "What we know determines what we can learn.",
      "We elaborate gradually; understanding comes from connection.",
      "Fluency arises through consolidation."
    ],
    pitfalls:"Treated as nine independent slogans rather than as a coherent set of constraints that must all be respected at once."
  }),

  T({ id:"loop", room:"atrium", wall:"N", t:0,
    title:"The Learning Loop",
    author:"composite framework",
    cluster:"Meta-framework",
    style:"orbit",
    summary:"A three-phase scaffold — Pre / During / Post — that organises evidence-based moves around the moment of learning.",
    extendedSummary:"Rather than a single theory, the Learning Loop curates an evidence-led toolkit from Ausubel, Vygotsky, Bjork, Roediger, Hattie and others. The point is that durable learning depends as much on what happens before (activating prior knowledge, diagnosing gaps) and after (retrieval, spacing, transfer) the lesson as on what happens inside it.",
    keypoints:[
      "Pre-learning: activate prior knowledge, build context, diagnose gaps.",
      "During: ZPD with scaffolding, desirable difficulty, manage cognitive load.",
      "Post: retrieval practice, distributed practice, transfer, feedback, metacognition.",
      "Each phase has named, evidenced moves drawn from cognitive science."
    ]
  }),

  T({ id:"watson-todd", room:"atrium", wall:"N", t:7,
    title:"Pedagogical Aspects of EAP",
    author:"Watson-Todd",
    cluster:"Meta-framework",
    style:"bauhaus",
    summary:"A descriptive framework of what characterises EAP teaching across institutions: inductive, process-oriented, autonomy-seeking, authentic and technology-integrated.",
    extendedSummary:"Watson-Todd's six aspects are not a recipe but a way of recognising the family resemblance between EAP courses worldwide. Where general English instruction often defaults to product (the finished sentence, the corrected essay), EAP foregrounds the process of getting there — induction from authentic texts, learner autonomy, and collaboration with subject specialists.",
    keypoints:[
      "Inductive learning — derive principles from examples.",
      "Process syllabi, not only product syllabi.",
      "Learner autonomy at the centre.",
      "Authentic materials and tasks.",
      "Integration of technology (corpora, AI, reference managers).",
      "Team teaching with subject specialists where possible."
    ]
  }),

  T({ id:"meddler", room:"atrium", wall:"E", t:-7,
    title:"Meddler in the Middle",
    author:"McWilliam",
    cluster:"Teacher stance",
    style:"strokes",
    summary:"A stance for the teacher: not the transmissive sage, not the hands-off guide, but a co-worker who interferes productively as the work unfolds.",
    extendedSummary:"McWilliam's image cuts through a tired binary. The 'meddler' is in the room, alongside students, doing the work too — challenging, prodding, redirecting — which is neither lecturing at them nor leaving them alone. The stance changes what 'good teaching' looks like minute by minute.",
    keypoints:[
      "Teacher as co-worker who interferes productively.",
      "Not 'sage on the stage' (transmission).",
      "Not 'guide on the side' (laissez-faire).",
      "Active intellectual presence in students' work."
    ]
  }),

  T({ id:"looped-input", room:"atrium", wall:"E", t:0,
    title:"Looped Input",
    author:"Woodward",
    cluster:"Teacher stance",
    style:"rings",
    summary:"Designing the medium so it carries the message — students learn how to do X by doing X to talk about X.",
    extendedSummary:"Looped input is a quiet trick: the form of the lesson becomes its own example. Teaching about discussion through discussion of discussion lets the content be experienced rather than merely described. It only works when the form really does model the practice — clumsy lessons that just declare alignment do not loop.",
    keypoints:[
      "Use the form of the lesson to embody its content.",
      "Teach about discussion by getting them to discuss discussion.",
      "Quietly turns the lesson into its own example."
    ]
  }),

  T({ id:"differentiation", room:"atrium", wall:"E", t:7,
    title:"Differentiation & Needs",
    author:"EAP shorthand",
    cluster:"Teacher stance",
    style:"layers",
    summary:"Designing for who is actually in the room — beginning with needs analysis and continuing as moment-to-moment differentiation across the class.",
    extendedSummary:"Differentiation rejects the course-book march. Needs analysis (target situation, present situation, lacks, wants) is the formal entry point; the more demanding move is staying differentiated lesson-to-lesson — varying inputs, tasks, support and assessment so different learners can meet the same outcomes through different routes.",
    keypoints:[
      "Needs analysis: target situation, present situation, lacks, wants.",
      "Differentiation: tasks pitched at varied levels and needs.",
      "'Teaching students, not materials'."
    ]
  }),

  T({ id:"tools-rules", room:"atrium", wall:"S", t:-7,
    title:"Tools, Not Rules",
    author:"EAP shorthand",
    cluster:"Teacher stance",
    style:"glyphs",
    summary:"Equip learners with adaptable strategies they can deploy across genres and disciplines, not rigid prescriptions that break the moment context shifts.",
    extendedSummary:"'Rules' generalise to the case the rule was written for; 'tools' generalise to a class of problems. Tools-not-rules is shorthand for a teaching stance that prefers transferable principles over local prescriptions — 'use hedging when you cannot commit to a claim' rather than 'never use I in academic writing'.",
    keypoints:[
      "Give adaptable principles, not fixed prescriptions.",
      "Strategies that travel across contexts beat memorised rules.",
      "Learners need a workshop, not a rulebook."
    ]
  }),

  T({ id:"samr", room:"atrium", wall:"S", t:0,
    title:"SAMR  ⚠",
    author:"Puentedura",
    cluster:"Contested framework",
    style:"strokes",
    summary:"A four-stage ladder of technology integration — Substitution, Augmentation, Modification, Redefinition — popular in school staff development.",
    extendedSummary:"SAMR is widely used and weakly evidenced. The implicit hierarchy ('higher up the ladder is better') is not supported by empirical work, and the model says nothing about whether the use of technology actually improves learning. Useful as a vocabulary; misleading as a quality measure.",
    keypoints:[
      "Substitution: tech replaces an existing tool with no functional change.",
      "Augmentation: tech replaces a tool with functional improvement.",
      "Modification: tech allows significant task redesign.",
      "Redefinition: tech enables previously inconceivable tasks."
    ],
    evidence:"★☆☆☆☆ — popular, weakly evidenced; the hierarchy is contested.",
    pitfalls:"Treated as a value hierarchy when there is no evidence higher rungs produce more learning.",
    aiImplications:"Retire the implicit hierarchy; ask whether AI use serves the learning, not where it sits on a ladder."
  }),

  T({ id:"learning-styles", room:"atrium", wall:"S", t:7,
    title:"Learning Styles / VARK  ⚠",
    author:"Various; Fleming",
    cluster:"Contested theory",
    style:"glyphs",
    summary:"The claim that learners have stable preferences (Visual, Auditory, Read/write, Kinaesthetic) and learn better when teaching is matched to their preferred style. The matching hypothesis is not supported by rigorous evidence.",
    extendedSummary:"Despite enormous popularity, decades of well-controlled studies have failed to show that matching teaching to claimed style improves learning. Learners do have preferences; preferences do not predict differential learning gains. The vocabulary persists because it is intuitive and offers individualised teaching as a quick fix.",
    keypoints:[
      "Stable 'styles': visual, auditory, read/write, kinaesthetic.",
      "Matching hypothesis: teach to the learner's style.",
      "Preferences exist; matching does not improve outcomes.",
      "Time better spent on dual coding and retrieval practice."
    ],
    evidence:"★☆☆☆☆ — matching hypothesis not supported (Pashler et al., 2008).",
    pitfalls:"'I'm a visual learner' replacing more useful diagnoses of prior knowledge or interest.",
    aiImplications:"Use AI's multimodality as a UDL win, not as evidence for a discredited theory."
  }),

  T({ id:"left-right", room:"atrium", wall:"W", t:-7,
    title:"Left / Right Brain Dominance  ⚠",
    author:"Popular extrapolation from Sperry",
    cluster:"Contested theory",
    style:"strokes",
    summary:"The popular claim that some learners are 'left-brained' (logical) and others 'right-brained' (creative), and that teaching should accommodate this. The underlying neuroscience does not support the educational claim.",
    extendedSummary:"The brain has hemispheric specialisations for some functions (notably language), but lateralisation is not the basis for individual differences in personality or learning, and most cognitive activity engages both hemispheres extensively. The framing should be retired in favour of better-evidenced concepts.",
    keypoints:[
      "Hemispheric specialisations exist for some functions.",
      "Lateralisation is not the basis for personality types.",
      "Most cognition engages both hemispheres.",
      "The educational claim has no empirical support."
    ],
    evidence:"★☆☆☆☆",
    aiImplications:"Retire the framing; redirect to dual coding or individual differences in prior knowledge."
  }),

  T({ id:"multiple-intelligences", room:"atrium", wall:"W", t:0,
    title:"Multiple Intelligences  ⚠",
    author:"Gardner",
    cluster:"Contested theory",
    style:"glyphs",
    summary:"The claim that there are several relatively independent intelligences (linguistic, logical-mathematical, spatial, musical, bodily-kinesthetic, interpersonal, intrapersonal, naturalist).",
    extendedSummary:"MI is widely popular and weakly evidenced. The 'intelligences' do not have the psychometric independence the theory requires — they correlate strongly enough to suggest a single general factor underneath. Its appeal is its inclusive vocabulary; the empirical claim does not stand up. AI's multimodality is a UDL win, not evidence for MI.",
    keypoints:[
      "Eight or nine 'intelligences', purportedly independent.",
      "Psychometric independence not supported.",
      "Frequently conflated with learning styles.",
      "Appealing rhetorically; empirically thin."
    ],
    evidence:"★☆☆☆☆",
    aiImplications:"AI's multimodality is a UDL win, not evidence for a contested theory of intelligence."
  }),

  T({ id:"connectivism", room:"atrium", wall:"W", t:7,
    title:"Connectivism  ⚠",
    author:"Siemens, 2005",
    cluster:"Contested theory",
    style:"glyphs",
    summary:"The claim that in a networked age, learning is the process of forming and navigating networks — and that knowledge resides in the network.",
    extendedSummary:"Connectivism overstates its case. Navigating networked information well still requires substantial domain knowledge in long-term memory — without that, search and curation are unmoored, and 'know-where' cannot substitute for know-that or know-how. Useful as a description of a working stance, weak as a foundational theory.",
    keypoints:[
      "Learning as network-formation and navigation.",
      "Knowledge in the network of people, sources, tools.",
      "Cannot substitute for individual schema-building.",
      "Underwrites useful working practices, not foundational theory."
    ],
    evidence:"★★☆☆☆",
    aiImplications:"Navigating networked information well requires substantial domain knowledge in long-term memory."
  }),

  T({ id:"digital-natives", room:"atrium", wall:"N", t:-11,
    title:"Digital Natives  ⚠",
    author:"Prensky",
    cluster:"Contested theory",
    style:"glyphs",
    summary:"The claim that learners born after a certain date have fundamentally different cognitive structures from those born before. Not supported by evidence.",
    extendedSummary:"The 'natives/immigrants' frame collapses on contact with data: variation within generations is far larger than variation between them, and digital fluency is a function of access and practice, not birth date. The 'AI-native' framing repeats the error in a new wrapper.",
    keypoints:[
      "Cognitive differences by birth-cohort: not supported.",
      "Variation within generations >> variation between them.",
      "Fluency is a function of access and practice.",
      "'AI-native' is the same framing recycled."
    ],
    evidence:"★☆☆☆☆",
    aiImplications:"'AI-native' is the same framing in a new wrapper, with the same empirical problems."
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // DESIGN WING · DESIGN FRAMEWORKS, TECH-BASED & BEHAVIOURIST
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"alignment", room:"design", wall:"N", t:-10,
    title:"Constructive Alignment",
    author:"Biggs & Tang",
    cluster:"Design framework",
    style:"stripes",
    summary:"A whole-course design principle: intended learning outcomes, teaching activities and assessment must be coherently aligned.",
    extendedSummary:"Constructive alignment turns 'what do I want students to be able to do?' into a structural test for the rest of the course. When outcomes, activities and assessment drift apart, students rationally study the assessment — and surface learning becomes the optimal strategy. Tightening alignment makes deep learning the easier path.",
    keypoints:[
      "Intended learning outcomes, activities and assessment must be coherent.",
      "What is assessed should be what is taught should be what was intended.",
      "Misalignment encourages surface learning and tactical study.",
      "A well-aligned module is harder to game with AI than a misaligned one."
    ],
    evidence:"★★★★★ — widely adopted across HE quality assurance frameworks.",
    aiImplications:"A well-aligned module is harder to game with AI than a misaligned one; tighten alignment before adding AI policy."
  }),

  T({ id:"backward-design", room:"design", wall:"N", t:-4,
    title:"Backward Design",
    author:"Wiggins & McTighe, 2005",
    cluster:"Design framework",
    style:"grid",
    summary:"Plan in reverse: start from desired understanding, decide what evidence would show it, then design the activities to produce that evidence.",
    extendedSummary:"Understanding by Design inverts the typical lesson-planning order. The 'evidence of understanding' stage is the hinge — it forces designers to operationalise outcomes before committing to activities, and it makes assessment a design problem rather than an afterthought.",
    keypoints:[
      "Stage 1 — Identify desired results (transferable understandings).",
      "Stage 2 — Determine acceptable evidence (assessment design).",
      "Stage 3 — Plan learning experiences and instruction.",
      "Six facets of understanding: explain, interpret, apply, perspective, empathy, self-knowledge."
    ],
    evidence:"★★★★★",
    aiImplications:"Designing from outcomes (stable) rather than from technologies (changing) is the most AI-resilient stance available."
  }),

  T({ id:"gagne", room:"design", wall:"N", t:2,
    title:"Nine Events of Instruction",
    author:"Gagné, 1985",
    cluster:"Design framework",
    style:"rings",
    summary:"A nine-step instructional sequence: gain attention, inform of objectives, recall prior learning, present content, provide guidance, elicit performance, give feedback, assess, enhance retention and transfer.",
    extendedSummary:"Gagné's events read like a checklist for a single learning episode. They map onto the underlying cognitive processes — attention, encoding, retrieval, transfer — that any successful lesson has to support, whatever the discipline.",
    keypoints:[
      "Gain attention; inform learners of objectives.",
      "Stimulate recall of prior learning.",
      "Present the content; provide learning guidance.",
      "Elicit performance; provide feedback.",
      "Assess performance; enhance retention and transfer."
    ],
    evidence:"★★★☆☆"
  }),

  T({ id:"tpack", room:"design", wall:"N", t:8,
    title:"TPACK",
    author:"Mishra & Koehler",
    cluster:"Design framework",
    style:"layers",
    summary:"Effective tech-integrated teaching sits at the intersection of Technological, Pedagogical and Content Knowledge — none alone is sufficient.",
    extendedSummary:"TPACK frames the kind of expertise teachers need when working with digital tools: not technology in the abstract, not pedagogy in general, but the situated knowledge of how a particular tool can teach a particular content area effectively. The framework explains why generic 'use AI in class' training tends to fail.",
    keypoints:[
      "Content Knowledge — what is to be taught.",
      "Pedagogical Knowledge — how people learn it.",
      "Technological Knowledge — what the tools can do.",
      "Effective practice lives in the overlap of all three."
    ],
    aiImplications:"AI staff development needs disciplinary integration, not generic tool training."
  }),

  T({ id:"udl", room:"design", wall:"E", t:-5,
    title:"Universal Design for Learning",
    author:"Rose & Meyer (CAST)",
    cluster:"Design framework",
    style:"glyphs",
    summary:"Design instruction from the start to accommodate variability: multiple means of engagement, representation, and action/expression.",
    extendedSummary:"UDL borrows from architecture: it is cheaper and more inclusive to design for variability from the start than to retrofit accommodations later. The three networks — affective (the why of learning), recognition (the what), and strategic (the how) — give designers concrete handles for offering options without lowering the bar.",
    keypoints:[
      "Multiple means of engagement (the 'why').",
      "Multiple means of representation (the 'what').",
      "Multiple means of action and expression (the 'how').",
      "Designed-in flexibility — not bolt-on accommodation."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI's multimodality is one of the strongest UDL enablers in HE's history when accessibility is designed for from the start."
  }),

  T({ id:"abc-design", room:"design", wall:"E", t:2,
    title:"ABC Learning Design",
    author:"Young & Perović",
    cluster:"Design framework",
    style:"bauhaus",
    summary:"A rapid storyboarding workshop method for module redesign, structuring learning around Laurillard's six learning types.",
    extendedSummary:"ABC turns module design into a 90-minute team activity. Storyboarding the six learning types — acquisition, inquiry, discussion, practice, collaboration, production — on cards forces decisions about balance and sequence that often hide in narrative descriptions of a module.",
    keypoints:[
      "Workshop-based, storyboarded module redesign.",
      "Built around Laurillard's six learning types.",
      "Surfaces imbalance (e.g. all acquisition, no inquiry).",
      "Fast, collaborative, and disciplinarily neutral."
    ],
    evidence:"★★★☆☆"
  }),

  T({ id:"laurillard", room:"design", wall:"S", t:-10,
    title:"Conversational Framework",
    author:"Laurillard, 2012",
    cluster:"Design framework",
    style:"orbit",
    summary:"Learning happens through a structured conversation between teacher and learner concepts and practices — operationalised as six learning types.",
    extendedSummary:"Laurillard models the teacher-learner relationship as iterative conversations at the concept and practice levels. The six learning types — acquisition, inquiry, discussion, practice, collaboration, production — are the operational vocabulary for what students actually do, and they give designers a way to audit whether a module is rich or thin.",
    keypoints:[
      "Acquisition, inquiry, discussion, practice, collaboration, production.",
      "Conversations at both concept and practice levels.",
      "Teacher and learner each produce, the other revises.",
      "A diagnostic for the balance of activity in a module."
    ],
    evidence:"★★★★☆",
    aiImplications:"Discussion and collaboration are largely AI-resistant by their nature; design class time to use them."
  }),

  T({ id:"feedback", room:"design", wall:"S", t:-4,
    title:"Three Questions, Four Levels",
    author:"Hattie & Timperley, 2007",
    cluster:"Design framework",
    style:"stripes",
    summary:"Feedback works when it answers three questions for the learner — Where am I going? How am I going? Where to next? — at the levels of task, process and self-regulation.",
    extendedSummary:"Hattie and Timperley's model is the closest the literature has to an operational definition of useful feedback. Its sharpest finding is that feedback about the self ('well done!') is the least effective form — feedback about the process and about self-regulation drives the biggest gains, and they are exactly the levels most rubrics omit.",
    keypoints:[
      "Three questions: Where am I going? How am I going? Where to next?",
      "Four levels: task, process, self-regulation, self.",
      "Process and self-regulation feedback drive the biggest gains.",
      "Feedback about 'the self' ('well done!') is largely ineffective."
    ],
    evidence:"★★★★★",
    aiImplications:"Use AI for task and process feedback; reserve human time for self-regulation feedback where AI cannot deliver."
  }),

  T({ id:"flipped", room:"design", wall:"S", t:2,
    title:"Flipped Learning",
    author:"Bergmann & Sams, 2012",
    cluster:"Tech-based",
    style:"strokes",
    summary:"Direct instruction moves out of class — typically as video — freeing class time for higher-order application, dialogue and feedback.",
    extendedSummary:"Flipped learning is structural: it rebalances where teacher and peers add most value. The model is only as good as the in-class half — if the application phase is just re-explanation, the flip wastes everyone's time. AI strengthens the pre-class half (personalised explanation) and threatens it (students may not engage with material a chatbot can summarise on demand).",
    keypoints:[
      "Direct instruction outside class.",
      "Class time for application, dialogue, feedback.",
      "Teacher & peers used where they add most value.",
      "In-class half is the AI-resistant core."
    ],
    evidence:"★★★☆☆",
    aiImplications:"AI strengthens pre-class material and threatens it; the in-class half is the AI-resistant core."
  }),

  T({ id:"community-of-inquiry", room:"design", wall:"S", t:8,
    title:"Community of Inquiry",
    author:"Garrison, Anderson, Archer",
    cluster:"Tech-based",
    style:"orbit",
    summary:"Effective online learning depends on the interplay of three 'presences': cognitive, social and teaching.",
    extendedSummary:"The CoI framework is the most influential model of online learning design. Its sharpest implication is that purely automated provision (high cognitive presence, low teaching/social presence) reliably underperforms — and that AI's ability to perform 'teaching presence' raises hard questions about whether anyone is actually teaching the course.",
    keypoints:[
      "Cognitive presence — meaning-making through discourse.",
      "Social presence — projecting oneself as a person.",
      "Teaching presence — design, facilitation, direction.",
      "All three needed; automation erodes the latter two."
    ],
    evidence:"★★★★☆",
    aiImplications:"If AI is doing the work of teaching presence, where is the real teaching presence?"
  }),

  T({ id:"behaviourism", room:"design", wall:"N", t:-13,
    title:"Behaviourism",
    author:"Skinner, 1971",
    cluster:"Behaviourist",
    style:"stripes",
    summary:"Learning framed as observable change in behaviour, shaped by reinforcement and punishment. Useful for automating sub-skills with immediate feedback.",
    extendedSummary:"Behaviourism's place in HE is narrow but not zero — drill-and-practice software, vocabulary spaced-repetition apps, and immediate-feedback referencing tutorials all exploit operant principles. The weakness is well-known: little to say about the higher-order thinking that defines academic study.",
    keypoints:[
      "Learning as observable change in behaviour.",
      "Shaped by reinforcement and punishment.",
      "Useful for sub-skill automation.",
      "Limited account of higher-order thinking."
    ],
    evidence:"★★★★☆ — for the narrow claim about behavioural conditioning."
  }),

  T({ id:"mastery-learning", room:"design", wall:"S", t:13,
    title:"Mastery Learning",
    author:"Bloom, 1968",
    cluster:"Behaviourist",
    style:"bauhaus",
    summary:"Students must demonstrate mastery of one unit before moving to the next. Time is the variable, attainment the constant.",
    extendedSummary:"Mastery learning rejects the bell curve as a feature of teaching rather than a fact of nature: if every student has the time and support they need, most can reach proficiency. The trade-off is logistical — variable time-on-task is hard to schedule — and the model fits AI-tutoring naturally, provided the mastery checks are tightly aligned to integrative outcomes.",
    keypoints:[
      "Demonstrate mastery before moving on.",
      "Time is variable; attainment is constant.",
      "Prevents gap-accumulation.",
      "Logistically demanding to schedule."
    ],
    evidence:"★★★★☆",
    aiImplications:"A natural fit for AI tutoring; pair mastery checkpoints with integrative tasks across units."
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // COG CHAPEL · COGNITIVE ARCHITECTURE
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"cog-load", room:"cog", wall:"N", t:-4,
    title:"Cognitive Load Theory  ✦",
    author:"Sweller, 1988",
    cluster:"Cognitive architecture",
    style:"layers",
    summary:"Working memory is severely limited. Good instruction minimises extraneous load, manages intrinsic load and protects germane load — the productive effort of building schemas.",
    extendedSummary:"CLT is the cognitive plumbing of instructional design. Its programme of empirical findings — the worked-example effect, split-attention effect, redundancy effect, expertise reversal — together form one of the most directly applicable bodies of evidence we have. Critically, load is relational: the same task imposes different loads on a novice and an expert.",
    keypoints:[
      "Working memory is severely limited (perhaps four chunks).",
      "Minimise extraneous load (poor design).",
      "Manage intrinsic load (task complexity).",
      "Maximise germane load (schema-building effort).",
      "Load is relational between learner and material."
    ],
    evidence:"★★★★★ — among the most replicated findings in educational psychology.",
    pitfalls:"Conflated with 'make it easy' — but reducing intrinsic load too aggressively prevents schema-building.",
    aiImplications:"Use AI to clear extraneous load; preserve struggle for germane load; fade scaffolds as expertise grows."
  }),

  T({ id:"multimedia", room:"cog", wall:"N", t:4,
    title:"Multimedia Learning Principles  ✦",
    author:"Mayer, 2009",
    cluster:"Cognitive architecture",
    style:"grid",
    summary:"Twelve evidence-backed principles for designing learning materials that combine words and pictures — operationalising cognitive load theory for media-rich teaching.",
    extendedSummary:"Mayer's principles read like a quality-control checklist for any slide deck, video or web page used for instruction. Coherence (cut extraneous material), signalling, redundancy, spatial and temporal contiguity, modality, segmenting, pre-training, and personalisation are individually well-evidenced and collectively a powerful design discipline.",
    keypoints:[
      "Coherence — cut extraneous material.",
      "Signalling — highlight what matters.",
      "Redundancy — do not read on-screen text aloud verbatim.",
      "Spatial/temporal contiguity — place related words and images close.",
      "Modality, segmenting, pre-training, personalisation."
    ],
    evidence:"★★★★★",
    aiImplications:"Use Mayer's principles as a quality check on any AI-generated material before it reaches students."
  }),

  T({ id:"working-memory", room:"cog", wall:"E", t:-4,
    title:"Working Memory",
    author:"Baddeley & Hitch, 1974",
    cluster:"Cognitive architecture",
    style:"orbit",
    summary:"A limited-capacity system that holds information temporarily for processing — phonological loop, visuospatial sketchpad, episodic buffer, and a central executive that allocates attention.",
    extendedSummary:"Baddeley's model is the foundation under cognitive load theory and most of multimedia learning. Its sharpest pedagogical implication is that chunk size grows with expertise — so what overwhelms a novice's working memory is comfortably held by an expert, and the same task carries very different loads in different rows of the same lecture hall.",
    keypoints:[
      "Phonological loop — verbal information.",
      "Visuospatial sketchpad — visual information.",
      "Episodic buffer — integrated representations.",
      "Central executive — attentional control.",
      "Capacity grows in effective size with expertise."
    ],
    evidence:"★★★★★"
  }),

  T({ id:"dual-coding", room:"cog", wall:"E", t:4,
    title:"Dual Coding Theory",
    author:"Paivio, 1986",
    cluster:"Cognitive architecture",
    style:"stripes",
    summary:"Information is represented in two largely independent but interconnected systems — verbal and non-verbal. Information encoded in both is more durable and easier to retrieve.",
    extendedSummary:"Dual coding underpins multimedia learning and explains why a well-chosen diagram beside a written description outperforms either alone. The catch is that the image must actually carry the meaning the words describe — decorative images add extraneous load rather than enabling dual coding.",
    keypoints:[
      "Two systems: verbal and non-verbal representations.",
      "Coded in both → more durable, easier to retrieve.",
      "Combining text with diagrams beats either alone.",
      "Decorative imagery does not produce dual coding."
    ],
    evidence:"★★★★★",
    pitfalls:"Confused with learning styles — every learner benefits, regardless of any 'preference'."
  }),

  T({ id:"schema", room:"cog", wall:"S", t:-4,
    title:"Schema Theory",
    author:"Bartlett; Anderson; Rumelhart",
    cluster:"Cognitive architecture",
    style:"rings",
    summary:"Long-term knowledge is organised into schemas — structured representations of patterns and relationships. Expertise is rich, well-organised, easily-activated schemas.",
    extendedSummary:"Schema theory is the connective tissue between memory research and expertise research. It explains why two students with the 'same' background knowledge can read the same paragraph with very different comprehension — the better-organised schema lets one of them anchor new information while the other has nowhere for it to land.",
    keypoints:[
      "Knowledge is organised in mental structures (schemas).",
      "Assimilation fits new input in; accommodation reshapes the schema.",
      "Activated schemas accelerate comprehension.",
      "Expertise is rich, well-organised, easily-activated schemas."
    ],
    evidence:"★★★★★",
    aiImplications:"AI explanations can mimic the shape of a schema without building it; require the student's own connection-making."
  }),

  T({ id:"prior-knowledge", room:"cog", wall:"S", t:4,
    title:"Prior Knowledge & Advance Organisers",
    author:"Ausubel, 1968",
    cluster:"Cognitive architecture",
    style:"layers",
    summary:"Ausubel's claim: the single most important factor influencing learning is what the learner already knows. Advance organisers connect new material to existing structures.",
    extendedSummary:"Ausubel's quote is one of the most-cited lines in the field for good reason — every other intervention assumes a base it builds on. Advance organisers are not summaries or previews; they are higher-level, more general material designed to give new content somewhere to attach. The diagnostic move is auditing what students bring before designing what to add.",
    keypoints:[
      "'The most important single factor influencing learning is what the learner already knows.'",
      "New material is mapped onto existing structures.",
      "Without anchoring, it is forgotten or distorted.",
      "Inert, insufficient or incorrect prior knowledge can block new learning."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI is good at advance organisers — if you specify the learner's prior knowledge precisely."
  }),

  T({ id:"conceptual-change", room:"cog", wall:"W", t:-4,
    title:"Conceptual Change",
    author:"Posner et al., 1982",
    cluster:"Cognitive architecture",
    style:"strokes",
    summary:"Some learning is not addition but restructuring — replacing or revising prior conceptions that conflict with the target understanding.",
    extendedSummary:"Conceptual change happens when a learner becomes dissatisfied with their existing conception and a new conception is intelligible, plausible and fruitful. Misconceptions are resilient — they survive teaching that does not directly engage them. Closely related to threshold concepts.",
    keypoints:[
      "Not adding new information; restructuring existing belief.",
      "Requires dissatisfaction with the prior conception.",
      "New conception must be intelligible, plausible and fruitful.",
      "Misconceptions survive teaching that does not confront them."
    ],
    evidence:"★★★★☆",
    aiImplications:"Fluent AI explanation often fails to shift misconceptions; design for friction, not clarity."
  }),

  T({ id:"distributed-cog", room:"cog", wall:"W", t:4,
    title:"Distributed & Extended Cognition",
    author:"Hutchins; Clark & Chalmers",
    cluster:"Cognitive architecture",
    style:"glyphs",
    summary:"Cognition does not happen only inside individual heads — it is routinely distributed across people, tools and environments. The extended mind goes further: external tools can constitute cognitive systems.",
    extendedSummary:"This is the theoretical frame in which AI tools sit most naturally. The question stops being 'what can the student do alone?' and becomes 'what should they be able to do with their tools?' — and 'what underlying capability do they need to do that well?'.",
    keypoints:[
      "Cognition distributed across people, tools and environments.",
      "External tools as parts of a cognitive system (the extended mind).",
      "Professional competence is often extended competence.",
      "Decide which outcomes are assessed in extended form and which unaided."
    ],
    evidence:"★★★☆☆",
    aiImplications:"Decide which outcomes are assessed in extended form (with AI) and which must be assessed unaided."
  }),

  T({ id:"forgetting-curve", room:"cog", wall:"N", t:-7,
    title:"The Forgetting Curve",
    author:"Ebbinghaus, 1885",
    cluster:"Cognitive architecture",
    style:"orbit",
    summary:"Retention of newly learned material decays sharply within hours and days unless revisited. Spaced review flattens the curve.",
    extendedSummary:"Ebbinghaus's curve is one of the oldest findings in experimental psychology and the empirical engine behind distributed practice. Every successful retrieval strengthens the trace and slows future decay — which is why a course that 'covers' a topic once in week three and never again is almost guaranteeing forgetting.",
    keypoints:[
      "Retention decays sharply within hours/days without retrieval.",
      "Spaced review flattens the curve.",
      "Each successful retrieval slows future decay.",
      "The empirical basis for distributed practice."
    ],
    evidence:"★★★★★"
  }),

  T({ id:"levels", room:"cog", wall:"E", t:7,
    title:"Levels of Processing",
    author:"Craik & Lockhart, 1972",
    cluster:"Cognitive architecture",
    style:"strokes",
    summary:"Information processed at deeper, more semantic levels is remembered better than information processed shallowly. Encoding depth determines retrieval strength.",
    extendedSummary:"The depth-of-processing finding reframed memory from a passive storage problem into an active encoding problem. The pedagogical implication is direct: asking learners to evaluate an argument leaves a deeper trace than asking them to highlight its main idea, even when both tasks 'cover' the same material.",
    keypoints:[
      "Deeper, semantic processing → better retention.",
      "Encoding depth determines retrieval strength.",
      "Meaning-based engagement beats rote.",
      "Evaluate > summarise > highlight."
    ],
    evidence:"★★★★☆"
  }),

  T({ id:"expertise-reversal", room:"cog", wall:"S", t:-7,
    title:"Expertise Reversal Effect",
    author:"Kalyuga, Sweller & Ayres, 2003",
    cluster:"Cognitive architecture",
    style:"bauhaus",
    summary:"Instructional methods that help novices — worked examples, heavy guidance — can actively hinder experts whose schemas make that detail redundant.",
    extendedSummary:"Expertise reversal is the bridge between cognitive load theory and the design of long modules. Scaffolds that are necessary in week one become extraneous load by week eight, and what looks like 'fading scaffolds' in the planning becomes essential cognitive housekeeping in the run.",
    keypoints:[
      "Methods that help novices can hinder experts.",
      "Worked examples support novices, bore experts.",
      "Match guidance to the learner's current schema.",
      "Fade scaffolds as competence grows."
    ],
    evidence:"★★★★☆",
    aiImplications:"Fade AI support as expertise grows, or graduates may end more dependent than they began."
  }),

  T({ id:"clt-eap", room:"cog", wall:"W", t:-7,
    title:"CLT in Multilingual EAP",
    author:"Sweller — EAP application",
    cluster:"Cognitive architecture",
    style:"layers",
    summary:"Cognitive Load Theory matters especially in EAP because students simultaneously meet a new discipline, work in an L2, and learn a new genre. Working memory load is genuinely higher.",
    extendedSummary:"In a multilingual classroom, intrinsic load comes from the content; extraneous load from the language of instruction; germane load from the new genre conventions. The instructional cost of poor design is multiplied, and even small reductions in extraneous load can free substantial capacity for learning.",
    keypoints:[
      "EAP layers three difficulties simultaneously.",
      "Conceptual difficulty: a new discipline.",
      "Linguistic difficulty: working in an L2.",
      "Procedural difficulty: a new genre.",
      "Working memory load is genuinely higher than for L1 peers."
    ]
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // MEMORY NAVE · MEMORY, PRACTICE STRATEGIES & STUDY SCIENCE
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"desirable-difficulty", room:"mem", wall:"N", t:-4,
    title:"Desirable Difficulties  ✦",
    author:"Bjork & Bjork",
    cluster:"Memory & practice",
    style:"strokes",
    summary:"Conditions that make learning feel harder in the moment often produce stronger, more durable, more transferable learning. Easy fluency is often an illusion.",
    extendedSummary:"Bjork's principle names the divergence between immediate performance and long-term learning. Spacing, interleaving, varying conditions, requiring retrieval, requiring generation — all feel harder during practice and produce lower performance there, and all produce better long-term retention. The pedagogical implication is uncomfortable: the activities that learners rate as 'working' may be the ones working least.",
    keypoints:[
      "Counter-intuitive: harder practice → more durable learning.",
      "Spacing, interleaving, retrieval, generation, variation.",
      "Beware the 'illusion of fluency' from easy re-reading.",
      "Only specific kinds of difficulty are desirable — not pointless obstacles."
    ],
    evidence:"★★★★★",
    aiImplications:"AI on demand is fluent and frictionless — the exact opposite of what builds durable learning."
  }),

  T({ id:"retrieval-practice", room:"mem", wall:"N", t:4,
    title:"Retrieval Practice & Testing Effect",
    author:"Roediger & Karpicke, 2006",
    cluster:"Memory & practice",
    style:"orbit",
    summary:"Retrieving information from memory strengthens it more than re-reading does. Testing is itself a learning event, not just a measurement event.",
    extendedSummary:"The testing effect is one of the most-replicated findings in cognitive psychology over the past two decades, and one of the most directly translatable. Even unsuccessful retrieval, followed by feedback, produces learning gains. Low-stakes retrieval should be routine, not reserved for end-of-module exams.",
    keypoints:[
      "Retrieving > re-reading for durable learning.",
      "Effects are large, durable and broad across material.",
      "Unsuccessful retrieval + feedback still produces gains.",
      "Free recall stronger than recognition (MCQ)."
    ],
    evidence:"★★★★★",
    aiImplications:"Design retrieval so AI consultation comes after the attempt, not in place of it."
  }),

  T({ id:"spacing", room:"mem", wall:"E", t:-12,
    title:"Spacing Effect",
    author:"Ebbinghaus; Cepeda; Bahrick",
    cluster:"Memory & practice",
    style:"rings",
    summary:"Distributing study or practice across multiple sessions produces better long-term retention than concentrating the same amount into a single session.",
    extendedSummary:"Spacing is among the oldest findings in psychology and one of the easiest to design for. Optimal spacing depends on how long the material needs to be retained — longer retention intervals call for longer spacing. The frame should shift from 'students should space their study' to 'we should space our curriculum'.",
    keypoints:[
      "Distributed > massed practice for long-term retention.",
      "Optimal spacing scales with retention interval.",
      "Massed practice ('cramming') performs better short-term, worse long-term.",
      "A curriculum-design issue, not just a study-habits issue."
    ],
    evidence:"★★★★★",
    aiImplications:"AI is well-suited to scheduling and prompting spaced retrieval across a module."
  }),

  T({ id:"interleaving", room:"mem", wall:"E", t:-6,
    title:"Interleaving",
    author:"Rohrer; Taylor; Bjork",
    cluster:"Memory & practice",
    style:"stripes",
    summary:"Mixing different topics or problem types within a study session produces better learning than studying one topic at a time — especially when learners need to choose the right approach.",
    extendedSummary:"Interleaving forces discrimination between problem types and retrieval of the right strategy each time. Like other desirable difficulties, it feels harder during practice and produces lower in-session performance — and substantially better performance on later transfer tests.",
    keypoints:[
      "Mixed practice > blocked practice for choice tasks.",
      "Forces discrimination between problem types.",
      "Forces retrieval of the right strategy each time.",
      "Feels harder; works better."
    ],
    evidence:"★★★★☆",
    aiImplications:"Require students to identify the type of problem before any AI assistance."
  }),

  T({ id:"generation", room:"mem", wall:"E", t:0,
    title:"Generation Effect",
    author:"Slamecka & Graf",
    cluster:"Memory & practice",
    style:"glyphs",
    summary:"Information generated by the learner — even partially — is remembered better than information passively read.",
    extendedSummary:"The generation effect is the cognitive engine under 'predict before you peek' activities. Making the learner produce, not consume, the relevant fact or relationship leaves a stronger trace, even when the generated answer is wrong (provided feedback follows).",
    keypoints:[
      "Self-generated information is remembered better.",
      "Even partial generation produces gains.",
      "Errors followed by feedback still help.",
      "Underpins 'predict-then-explain' activities."
    ],
    evidence:"★★★★☆",
    aiImplications:"Have students predict before AI explains; the prediction is where the encoding happens."
  }),

  T({ id:"worked-examples", room:"mem", wall:"E", t:6,
    title:"Worked Example Effect  ✦",
    author:"Sweller & Cooper",
    cluster:"Memory & practice",
    style:"grid",
    summary:"For novices, studying fully worked-out examples produces more learning per unit of effort than solving equivalent problems unaided.",
    extendedSummary:"The worked-example effect is one of the most replicated findings in cognitive load research and forms the basis of scaffolded sequences: fully solved → completion problems → independent practice. It reverses for experts (the expertise reversal effect), so the same intervention must fade.",
    keypoints:[
      "Worked examples > equivalent problem-solving for novices.",
      "Reduces extraneous load while preserving germane load.",
      "Best used in a fading sequence: solved → completion → independent.",
      "Reverses at higher expertise."
    ],
    evidence:"★★★★★",
    aiImplications:"Use AI to generate scaffolded examples; assess at the later, independent stages."
  }),

  T({ id:"study-tech", room:"mem", wall:"E", t:12,
    title:"Effective Study Techniques",
    author:"Dunlosky et al., 2013",
    cluster:"Memory & practice",
    style:"layers",
    summary:"A systematic review ranking common study techniques. Practice testing and distributed practice rank highest; highlighting and re-reading rank lowest.",
    extendedSummary:"Dunlosky's review is the closest thing the field has to a definitive league table of study techniques. Many intuitive techniques produce a feeling of fluency without durable learning — what Bjork calls the 'illusion of competence'. Teaching study skills explicitly, with evidence, replaces folk practice with method.",
    keypoints:[
      "High utility: practice testing, distributed practice.",
      "Moderate utility: elaborative interrogation, self-explanation, interleaving.",
      "Low utility: highlighting, re-reading, summarising, mnemonic use.",
      "Intuitive techniques often produce only the feeling of fluency."
    ],
    evidence:"★★★★★"
  }),

  T({ id:"metacognition", room:"mem", wall:"W", t:-12,
    title:"Metacognition",
    author:"Flavell; Brown; Stanton et al.",
    cluster:"Memory & practice",
    style:"glyphs",
    summary:"Awareness and regulation of one's own thinking and learning — knowing what you know, and managing how you learn.",
    extendedSummary:"Metacognition is the executive layer that decides when more study is needed, when a strategy is failing, and when a feeling of understanding is genuine or illusory. It is teachable and explicit — students who plan, monitor and evaluate their own work outperform equally able peers who don't.",
    keypoints:[
      "Knowing what you know; managing how you learn.",
      "Plan → monitor → evaluate.",
      "Teachable and explicit — not a fixed trait.",
      "Helps detect (and resist) the illusion of fluency."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI fluency produces a feel-of-knowing that good metacognition is supposed to detect."
  }),

  T({ id:"learning-pyramid", room:"mem", wall:"W", t:0,
    title:"The Learning Pyramid  ⚠",
    author:"Attributed to NTL Institute (unverified)",
    cluster:"Contested theory",
    style:"stripes",
    summary:"The popular claim that we retain 5% of what we hear, 10% of what we read, 75% of what we do, etc. The numbers have no empirical basis.",
    extendedSummary:"The pyramid's specific percentages have never been traced to a primary study, and they survive because they encode a useful intuition (active beats passive) in a memorable visual. The underlying intuition is right; the numbers are made up. Cite retrieval, generation, or dual coding instead.",
    keypoints:[
      "The retention percentages have no empirical basis.",
      "The underlying intuition (active beats passive) is sound.",
      "Better-evidenced concepts make the same point.",
      "Retire the visual; keep the instinct."
    ],
    evidence:"★☆☆☆☆",
    aiImplications:"Retire the framework; cite retrieval, generation, or dual coding instead."
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // MOTIVATION GARDEN · MOTIVATION & SELF-REGULATION
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"self-determination", room:"mot", wall:"N", t:-8,
    title:"Self-Determination Theory  ✦",
    author:"Deci & Ryan",
    cluster:"Motivation & self-regulation",
    style:"orbit",
    summary:"Sustainable motivation rests on three psychological needs — autonomy, competence and relatedness. Intrinsic motivation flourishes where they are met and corrodes where they are not.",
    extendedSummary:"SDT is the most empirically robust theory of motivation in the field. Its sharpest move is to distinguish quality of motivation, not just quantity: amotivation, external regulation, introjected, identified, integrated, intrinsic — each form is different from the next and produces different downstream behaviour and wellbeing.",
    keypoints:[
      "Three basic psychological needs: autonomy, competence, relatedness.",
      "Quality of motivation matters as much as quantity.",
      "Controlling environments corrode intrinsic motivation.",
      "Autonomy-supportive teaching outperforms control-oriented teaching."
    ],
    evidence:"★★★★★",
    aiImplications:"AI must support autonomy, competence and relatedness — not corrode them through surveillance or substitution."
  }),

  T({ id:"self-efficacy", room:"mot", wall:"N", t:-3,
    title:"Self-Efficacy",
    author:"Bandura; Zimmerman",
    cluster:"Motivation & self-regulation",
    style:"rings",
    summary:"A learner's belief in their capacity to succeed at a specific task — domain-specific, not a global trait. Built by mastery, vicarious experience, persuasion and managing arousal.",
    extendedSummary:"Self-efficacy predicts effort and persistence, particularly in the face of difficulty. The most reliable builder is direct mastery experience — succeeding at hard things. Vicarious experience (seeing similar others succeed) and credible persuasion matter too, but words alone rarely move self-efficacy.",
    keypoints:[
      "Task-specific belief — not a personality trait.",
      "Built by mastery experiences, watching similar others, credible persuasion.",
      "Predicts effort and persistence.",
      "Built by succeeding at hard things, not having things done for you."
    ],
    evidence:"★★★★☆",
    aiImplications:"Self-efficacy comes from succeeding at hard things, not from having things done for you."
  }),

  T({ id:"mindset", room:"mot", wall:"N", t:3,
    title:"Mindset",
    author:"Dweck",
    cluster:"Motivation & self-regulation",
    style:"glyphs",
    summary:"Beliefs about whether ability is fixed or malleable shape how learners respond to difficulty, feedback and failure.",
    extendedSummary:"Dweck's framework is widely cited and widely overstated. The original findings — that growth-mindset framings of feedback support persistence — replicate at modest effect sizes; the larger 'mindset interventions in schools' literature is mixed. The most defensible reading: ability beliefs matter, but they are produced by the practices of the classroom, not delivered by motivational posters.",
    keypoints:[
      "Fixed mindset: ability is innate, success reflects talent.",
      "Growth mindset: ability is developed through effort and strategy.",
      "Praise the process, not the person.",
      "Mindset is a product of experience, not a cause of it."
    ],
    evidence:"★★★☆☆ — original effects replicate at modest sizes; large-scale interventions are mixed.",
    aiImplications:"AI that removes struggle removes the conditions under which a growth mindset would matter."
  }),

  T({ id:"goal-orientation", room:"mot", wall:"N", t:8,
    title:"Goal Orientation",
    author:"Nicholls; Dweck; Ames",
    cluster:"Motivation & self-regulation",
    style:"stripes",
    summary:"Learners orient towards mastery goals (learning the material) or performance goals (looking competent / not looking incompetent). Mastery orientation supports deeper engagement.",
    extendedSummary:"Goal orientation links motivation to assessment design. When the visible reward structure foregrounds grades and rankings, performance goals dominate; when it foregrounds growth and feedback, mastery goals have room. The classroom climate teaches goal orientation as surely as it teaches content.",
    keypoints:[
      "Mastery goals — focus on learning.",
      "Performance-approach goals — focus on looking competent.",
      "Performance-avoidance goals — focus on not looking incompetent.",
      "Classroom climate shapes the orientation students adopt."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI makes performance-oriented gaming trivial; design assessment to require evidence of mastery."
  }),

  T({ id:"self-regulated", room:"mot", wall:"E", t:-5,
    title:"Self-Regulated Learning",
    author:"Zimmerman; Pintrich",
    cluster:"Motivation & self-regulation",
    style:"orbit",
    summary:"Effective learners cycle through forethought (goals, strategy), performance (monitoring, attention), and reflection (evaluation, attribution) — and the cycle can be taught.",
    extendedSummary:"SRL synthesises motivation, metacognition, and self-efficacy into a cyclical model of how skilled learners actually behave. Its design implication is that 'learning to learn' is teachable through structured prompts at each phase — not as an add-on study-skills module but inside the discipline.",
    keypoints:[
      "Forethought: goal-setting, strategic planning, task analysis.",
      "Performance: self-monitoring, attention control.",
      "Self-reflection: evaluation, attribution, adaptation.",
      "Cycle is teachable through structured prompts."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI can develop or replace self-regulation; the design difference is whether the student does the regulating."
  }),

  T({ id:"expectancy-value", room:"mot", wall:"E", t:0,
    title:"Expectancy-Value Theory",
    author:"Eccles; Wigfield",
    cluster:"Motivation & self-regulation",
    style:"layers",
    summary:"Motivation = expectancy of success × perceived value of the task. Both must be present for effort to follow.",
    extendedSummary:"Expectancy-value is the design tool for the question 'why would they do this?'. Tasks that learners think they cannot do, or do not value, predictably produce low effort regardless of how well-aligned the rest of the design is. The lever is usually value: connect to identity, future, or interest.",
    keypoints:[
      "Expectancy — 'can I do this?'",
      "Value — 'is it worth doing?'",
      "Attainment, intrinsic, utility, cost dimensions of value.",
      "Both expectancy and value must be present."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI can build expectancy and surface relevance; do not let it take over the personal connection-making."
  }),

  T({ id:"flow", room:"mot", wall:"W", t:-5,
    title:"Flow",
    author:"Csikszentmihalyi",
    cluster:"Motivation & self-regulation",
    style:"rings",
    summary:"A state of full task absorption when challenge and skill are balanced just above the edge of comfortable competence.",
    extendedSummary:"Flow is more vivid as a description than as a design target — the conditions (clear goals, immediate feedback, balance of challenge and skill) are necessary but not sufficient. Pedagogically the framework is most useful as a diagnostic for boredom (too easy) and anxiety (too hard) and as a reminder that those states are about task design, not the learner.",
    keypoints:[
      "Challenge balanced just above current skill.",
      "Clear goals and immediate feedback.",
      "Loss of self-consciousness; time distortion.",
      "Boredom and anxiety as design diagnostics."
    ],
    evidence:"★★★☆☆"
  }),

  T({ id:"attribution", room:"mot", wall:"W", t:5,
    title:"Attribution Theory",
    author:"Weiner, 1985",
    cluster:"Motivation & self-regulation",
    style:"stripes",
    summary:"How people explain success and failure on three dimensions — locus, stability, controllability — shapes future motivation.",
    extendedSummary:"Weiner's three-by-three is a practical lens on a recurring classroom moment. A student who says 'I'm just bad at writing' has attributed failure to a stable, internal, uncontrollable cause — exactly the pattern that leads to learned helplessness. Reframing the failure to a controllable cause (effort, strategy, planning) is the move that keeps motivation alive.",
    keypoints:[
      "Locus: internal vs external.",
      "Stability: stable vs unstable.",
      "Controllability: controllable vs not.",
      "Attributing failure to effort sustains it; attributing to ability is corrosive."
    ],
    evidence:"★★★★☆"
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // SOCIAL AMPHITHEATRE · SOCIAL & SITUATED LEARNING + CONSTRUCTIVISM
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"zpd", room:"soc", wall:"N", t:-5,
    title:"Zone of Proximal Development  ✦",
    author:"Vygotsky, 1978",
    cluster:"Social & situated",
    style:"orbit",
    summary:"The gap between what a learner can do alone and what they can do with expert or peer support. Learning happens at the upper edge of current ability.",
    extendedSummary:"The ZPD is one of the most-cited concepts in education for a reason: it gives a precise place to aim. Tasks below the zone are boring; tasks above it are paralysing; tasks within it, with appropriate scaffolding, are where learning happens. The scaffold is provisional — designed to be withdrawn as the learner takes over.",
    keypoints:[
      "The gap between independent and supported performance.",
      "Learning happens at the upper edge of current ability.",
      "Scaffolding is just-enough, then withdrawn.",
      "An aiming point, not a region of comfort."
    ],
    evidence:"★★★★☆",
    aiImplications:"Design AI use as scaffolding within the zone, not as a leap over it; build in deliberate fading."
  }),

  T({ id:"social-constructivism", room:"soc", wall:"N", t:5,
    title:"Social Constructivism",
    author:"Vygotsky; Bruner",
    cluster:"Social & situated",
    style:"rings",
    summary:"Knowledge is constructed through social interaction, with language as the primary mediating tool. Dialogue with more capable others drives conceptual development.",
    extendedSummary:"Social constructivism positions the social as the engine of cognitive change, not a backdrop to it. The peer tutorial, the seminar discussion, the supervisor's question that reframes the draft — these are not pleasant adjuncts to learning but the site where it happens.",
    keypoints:[
      "Knowledge constructed through social interaction.",
      "Language as primary mediating tool.",
      "Dialogue with more capable others drives development.",
      "AI cannot substitute for genuine dialogue."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI does not change its mind the way another person can; it cannot substitute for genuine dialogue."
  }),

  T({ id:"social-learning", room:"soc", wall:"S", t:-5,
    title:"Social Learning Theory",
    author:"Bandura, 1977",
    cluster:"Social & situated",
    style:"strokes",
    summary:"People learn by observing, imitating and modelling others — mediated by attention, retention, reproduction and motivation. Vicarious reinforcement builds self-efficacy.",
    extendedSummary:"Bandura's contribution was to broaden behaviourism into something that could account for the bulk of human learning — most of which happens through observation, not direct shaping. Modelling expert practice is one of the most pedagogically powerful moves available, and real experts thinking aloud usually beat any imitation of them.",
    keypoints:[
      "Learning by observation, imitation and modelling.",
      "Mediated by attention, retention, reproduction, motivation.",
      "Vicarious reinforcement builds self-efficacy.",
      "Real experts thinking aloud usually beat AI."
    ],
    evidence:"★★★★☆",
    aiImplications:"For modelling expert thinking, real experts thinking aloud usually beat AI."
  }),

  T({ id:"situated", room:"soc", wall:"S", t:5,
    title:"Situated Learning & Communities of Practice",
    author:"Lave & Wenger, 1991",
    cluster:"Social & situated",
    style:"rings",
    summary:"Learning is inseparable from its social and physical context. Novices begin as peripheral participants in a community of practice and move toward fuller membership.",
    extendedSummary:"Lave and Wenger's account explains why textbook competence does not always translate to professional competence: knowledge is bound to the practices that use it, and learning means becoming a member of the community that uses it. The educational implication is that 'authentic' tasks are not a pedagogical bonus but a structural necessity.",
    keypoints:[
      "Learning inseparable from context.",
      "Novices begin as peripheral participants.",
      "Trajectory toward fuller participation.",
      "Knowledge bound to the practices that use it."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI is at most a tool within a community of practice, never a member of it."
  }),

  T({ id:"cog-apprenticeship", room:"soc", wall:"W", t:-5,
    title:"Cognitive Apprenticeship",
    author:"Collins, Brown & Newman",
    cluster:"Social & situated",
    style:"grid",
    summary:"An apprenticeship model adapted for cognitive skills: modelling → coaching → scaffolding → articulation → reflection → exploration.",
    extendedSummary:"The cognitive apprenticeship makes expert thinking visible in a way that traditional lecture cannot. The teacher thinks aloud, externalising the moves a competent reader/writer/analyst would make; then coaches the novice through the same moves; then steps back. AI does not have the disciplinary expertise the model assumes from the master.",
    keypoints:[
      "Model → coach → scaffold → articulate → reflect → explore.",
      "Makes the thinking of experts visible.",
      "Gradually transfers responsibility to the learner.",
      "Depends on real disciplinary expertise."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI does not have the disciplinary expertise that the apprenticeship model assumes from the master."
  }),

  T({ id:"activity-theory", room:"soc", wall:"W", t:0,
    title:"Activity Theory",
    author:"Leontiev; Engeström",
    cluster:"Social & situated",
    style:"bauhaus",
    summary:"Human activity is mediated by tools, rules, community and division of labour — and activity systems can be analysed for the contradictions that drive change.",
    extendedSummary:"Engeström's expanded model gives a unit of analysis (the activity system) larger than the individual and richer than the dyad. It is a useful lens for analysing the contradictions AI is producing in higher education's activity systems — between the rules (academic integrity), the tools (generative AI), the community (students, staff), and the object (graduate capability).",
    keypoints:[
      "Activity = subject + object + tools + rules + community + division of labour.",
      "Contradictions within and between systems drive change.",
      "A lens for organisational learning.",
      "Useful for analysing AI's effects on HE."
    ],
    evidence:"★★★☆☆",
    aiImplications:"A useful lens for analysing the contradictions AI is producing in HE's activity systems."
  }),

  T({ id:"constructivism", room:"soc", wall:"W", t:5,
    title:"Constructivism (general)",
    author:"Piaget, Bruner, others",
    cluster:"Constructivist",
    style:"layers",
    summary:"Learners actively build understanding from experience and interaction. Meaning is constructed, not transmitted.",
    extendedSummary:"Constructivism is less a single theory than a family stance: knowledge is produced by the learner, anchored to prior structures, and revised through experience. It overlaps with schema theory, ZPD, situated learning and discovery learning — but constructivist teaching as a slogan often slips into 'discovery without structure', which is exactly what the evidence does not support.",
    keypoints:[
      "Learners actively construct understanding.",
      "New input filters through existing mental structures.",
      "Meaning is constructed, not transmitted.",
      "Pure unguided 'discovery' is inefficient."
    ]
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // ADULT LEARNING TOWER · ADULT & EXPERIENTIAL + CONSTRUCTIVIST APPROACHES
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"andragogy", room:"adu", wall:"S", t:-7,
    title:"Andragogy (Self-Directed Learning)",
    author:"Knowles, 1975",
    cluster:"Adult & experiential",
    style:"grid",
    summary:"Adult learners take initiative across the whole learning cycle — diagnosing needs, setting goals, choosing resources, evaluating outcomes. Relevance and autonomy do the motivational work.",
    extendedSummary:"Knowles distinguished pedagogy (the teaching of children) from andragogy (the teaching of adults) on the basis of adults' richer experience, established self-concept and need for relevance. The contrast is sharper than the evidence — adults are not monolithic — but the practical implications (negotiate, draw on experience, connect to need) remain useful.",
    keypoints:[
      "Adults need to know why they are learning something.",
      "They bring rich experience to draw on.",
      "Self-concept as autonomous learner.",
      "Readiness driven by life-role demands.",
      "Problem-centred, not subject-centred."
    ],
    evidence:"★★★☆☆",
    aiImplications:"Connect AI use to the experience already in the room; do not let it displace integration with deep professional knowledge."
  }),

  T({ id:"kolb", room:"adu", wall:"S", t:0,
    title:"Experiential Learning Cycle",
    author:"Kolb, 1984",
    cluster:"Adult & experiential",
    style:"rings",
    summary:"A four-stage cycle: concrete experience → reflective observation → abstract conceptualisation → active experimentation. Experience becomes learning only when followed by structured reflection.",
    extendedSummary:"Kolb's cycle is widely used and weakly evidenced as a typology of learners — but it remains genuinely useful as a design template for activities. The pedagogically active move is the closing of the cycle: making the abstracted principle the seed of a new experiment that begins the loop again.",
    keypoints:[
      "Concrete experience → reflective observation.",
      "→ Abstract conceptualisation → active experimentation.",
      "Experience without reflection is not learning.",
      "The cycle is iterative — each loop refines the model."
    ],
    evidence:"★★★☆☆",
    aiImplications:"Reflection is one of the easiest things for AI to fake; structures that elicit specific situated detail are harder to game."
  }),

  T({ id:"transformative", room:"adu", wall:"S", t:7,
    title:"Transformative Learning",
    author:"Mezirow, 1991",
    cluster:"Adult & experiential",
    style:"orbit",
    summary:"Deep learning that shifts a learner's frames of reference — usually triggered by a 'disorienting dilemma' and worked through by critical reflection.",
    extendedSummary:"Mezirow's framework names a kind of learning that ordinary models miss — the change in how a learner sees, not just what they know. It depends on disconfirming experience that resists assimilation, and on the slow work of dialogue and critical reflection to integrate it.",
    keypoints:[
      "Shifts in frames of reference — assumptions, beliefs, worldviews.",
      "Triggered by a 'disorienting dilemma'.",
      "Worked through by critical reflection and dialogue.",
      "Not information accumulation."
    ],
    evidence:"★★★☆☆",
    aiImplications:"AI smooths over the disorienting dilemmas that transformation requires; AI is at best a tool for processing the disruption."
  }),

  T({ id:"reflective-practice", room:"adu", wall:"E", t:-7,
    title:"Reflective Practice",
    author:"Schön, 1983",
    cluster:"Adult & experiential",
    style:"strokes",
    summary:"Professional competence develops through reflection-in-action (thinking on your feet) and reflection-on-action (thinking back) — both rooted in the concrete particulars of practice.",
    extendedSummary:"Schön's contribution was to reject the 'technical rationality' model of professional knowledge and foreground the artistry of practice — the way skilled professionals improvise, frame and reframe situations as they unfold. Reflective writing that generates these specifics is a different artefact from the generic reflection AI can readily fake.",
    keypoints:[
      "Reflection-in-action — thinking during practice.",
      "Reflection-on-action — thinking after practice.",
      "Practice itself generates knowledge professional knowledge lacks.",
      "Rooted in specific situated detail."
    ],
    evidence:"★★★☆☆",
    aiImplications:"Reflective writing is increasingly AI-generated; design it to require specific situated detail and connection to subsequent action."
  }),

  T({ id:"deep-surface", room:"adu", wall:"E", t:0,
    title:"Deep & Surface Approaches  ✦",
    author:"Marton; Säljö; Entwistle; Ramsden",
    cluster:"Adult & experiential",
    style:"layers",
    summary:"Students adopt approaches to learning — deep (intention to understand) or surface (intention to reproduce) — that are shaped by the tasks and assessments they face.",
    extendedSummary:"The Gothenburg group's central finding was that 'deep' and 'surface' are not learner traits but task-driven strategies. A student who deep-reads a novel for one course will surface-read an article for another, depending on what counts as success. The corollary is uncomfortable: badly designed assessment teaches surface learning, and AI dramatically reduces the cost of executing surface strategies well.",
    keypoints:[
      "Approach, not style — task-driven, not learner-trait.",
      "Deep: intention to understand, engage with meaning.",
      "Surface: intention to reproduce, memorise discrete facts.",
      "Shaped by the tasks and assessments the student faces."
    ],
    evidence:"★★★★★",
    aiImplications:"AI massively reduces the cost of surface approaches; the cleanest test of whether design is AI-resilient."
  }),

  T({ id:"heutagogy", room:"adu", wall:"E", t:7,
    title:"Heutagogy",
    author:"Hase & Kenyon",
    cluster:"Adult & experiential",
    style:"glyphs",
    summary:"Self-determined learning — learners choose what they need to learn, how they will learn it, and how they will assess success.",
    extendedSummary:"Heutagogy goes further than andragogy: where Knowles' adult learner is more autonomous than the child, the heutagogical learner is essentially self-directed from the outset. The framework is most useful for already-expert learners with strong domain knowledge; for novices, the demands often exceed the support and the model under-delivers.",
    keypoints:[
      "Self-determined learning beyond self-direction.",
      "Learner sets goals, chooses methods, assesses outcomes.",
      "Works best for already-expert learners.",
      "Often under-supports novices."
    ],
    evidence:"★★☆☆☆",
    aiImplications:"AI supports already-expert learners; novices need more structure than the framework provides."
  }),

  T({ id:"discovery", room:"adu", wall:"W", t:-7,
    title:"Discovery Learning",
    author:"Bruner, 1961",
    cluster:"Constructivist",
    style:"glyphs",
    summary:"Learners work out principles from materials rather than being told them — stronger encoding than transmission, but pure unguided discovery is inefficient.",
    extendedSummary:"Bruner's original claim was that the act of finding-out leaves a deeper trace than the act of being-told. The subsequent evidence narrows the claim: pure unguided discovery is inefficient, often producing wrong ideas that have to be unlearned. Guided discovery — with structured materials, hints and feedback — is the form that tends to work.",
    keypoints:[
      "Learners derive principles from materials.",
      "Discovery yields stronger encoding than transmission.",
      "Unguided discovery is inefficient.",
      "Guided discovery is the workable form."
    ],
    evidence:"★★★☆☆ — guided discovery only."
  }),

  T({ id:"inquiry", room:"adu", wall:"W", t:0,
    title:"Inquiry-Based Learning",
    author:"Pedaste et al., 2015",
    cluster:"Constructivist",
    style:"orbit",
    summary:"A cyclical model — orient, question, hypothesise, investigate, conclude, discuss. Owning the question drives motivation; method and content are built in parallel.",
    extendedSummary:"Inquiry-based learning generalises the scientific cycle to any discipline that has questions and methods of answering them. The risk is that without sufficient guidance, students reinvent dead ends; the strength, when done well, is that the question is owned and the method is internalised, not just performed.",
    keypoints:[
      "Cycle: orient → question → hypothesise → investigate → conclude → discuss.",
      "Owning the question drives engagement.",
      "Method and content built in parallel.",
      "Needs structured support to avoid reinvented dead ends."
    ],
    evidence:"★★★☆☆"
  }),

  T({ id:"pbl", room:"adu", wall:"W", t:7,
    title:"Problem-Based Learning",
    author:"Barrows & Tamblyn, 1980",
    cluster:"Constructivist",
    style:"bauhaus",
    summary:"Curriculum organised around solving authentic, ill-structured problems. The problem drives learners to identify what they need to know.",
    extendedSummary:"PBL was pioneered in medical education and has spread widely. The defining feature is that the problem comes first and curriculum follows from the demands of solving it — producing knowledge that is contextualised and transferable. Variations differ on facilitator role, group size and the structure of the problem.",
    keypoints:[
      "Learning organised around authentic, ill-structured problems.",
      "Problems force learners to identify what they need to know.",
      "Produces contextualised, transferable knowledge.",
      "Facilitator-driven group inquiry."
    ],
    evidence:"★★★★☆",
    aiImplications:"Design AI use into PBL deliberately as a research tool or simulation — never as substitute for the group's reasoning."
  }),

  T({ id:"active-learning", room:"adu", wall:"S", t:-7,
    title:"Active Learning",
    author:"Freeman et al., 2014",
    cluster:"Constructivist",
    style:"strokes",
    summary:"Any approach that engages students in doing and reflecting rather than passively receiving. A landmark meta-analysis found it cuts failure rates and lifts exam performance.",
    extendedSummary:"Freeman et al.'s meta-analysis is one of the more consequential findings in higher-education research: across 225 STEM studies, active learning reduced failure rates by ~12 percentage points and raised exam scores by half a standard deviation compared with traditional lecture. The category is broad — peer instruction, small-group discussion, problem-solving — but the principle is consistent.",
    keypoints:[
      "Doing + reflecting > passive reception.",
      "Reduces failure rates, lifts exam performance vs. lecture.",
      "Broad category — many specific techniques work.",
      "Engagement increases attention and processing."
    ],
    evidence:"★★★★★"
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // EAP SPIRE · EAP-SPECIFIC FRAMEWORKS
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"swales", room:"eap", wall:"E", t:-9,
    title:"Swalesian Genre Pedagogy",
    author:"Swales, 1990",
    cluster:"EAP-specific",
    style:"stripes",
    summary:"Academic texts can be analysed in terms of recurring moves and steps that achieve communicative purposes — most famously the CARS model for article introductions.",
    extendedSummary:"Swales' move-step analysis gave EAP a precise descriptive apparatus for what experienced academic readers see at a glance. Once students can identify the moves in their discipline's introductions and discussions, they can replicate the rhetorical work — not by mimicking sentences but by performing the same communicative jobs.",
    keypoints:[
      "Texts analysed as moves and steps.",
      "Recurring genres achieve communicative purposes.",
      "CARS model: establish territory → niche → occupying.",
      "Makes the rhetorical work of expert texts visible."
    ]
  }),

  T({ id:"academic-literacies", room:"eap", wall:"E", t:-3,
    title:"Academic Literacies",
    author:"Lea & Street, 2006",
    cluster:"EAP-specific",
    style:"strokes",
    summary:"Distinguishes three approaches to student writing — surface study skills, induction into established norms, and writing as identity-laden social practice. The third is privileged.",
    extendedSummary:"Lea and Street reframed writing instruction as politically and identity-laden rather than neutral skill transfer. The academic literacies approach treats writing as contested practice tied to power — disciplinary conventions, voice, the right to make claims — and refuses to reduce 'fixing' a student's writing to surface correction.",
    keypoints:[
      "Three approaches: study skills, academic socialisation, academic literacies.",
      "The third foregrounds identity, contested practices and power.",
      "Writing as social practice, not neutral skill.",
      "Refuses to reduce 'good writing' to surface correction."
    ]
  }),

  T({ id:"sfl", room:"eap", wall:"E", t:3,
    title:"Systemic Functional Linguistics",
    author:"Halliday, 2003",
    cluster:"EAP-specific",
    style:"grid",
    summary:"Language as a meaning-making system organised around three metafunctions — ideational, interpersonal, textual. Gives precise tools (nominalisation, theme/rheme, modality) for how academic meaning is made.",
    extendedSummary:"SFL gives EAP a meta-language for academic discourse that goes beyond 'use formal English'. It explains why expert academic writing uses heavy nominalisation (to package information and theme it), modality (to manage commitment), and theme-rheme patterning (to manage flow) — and lets students see those moves rather than infer them.",
    keypoints:[
      "Language as a meaning-making system.",
      "Ideational metafunction: representing experience.",
      "Interpersonal: enacting relationships.",
      "Textual: organising as message.",
      "Tools: nominalisation, theme/rheme, modality."
    ]
  }),

  T({ id:"lct", room:"eap", wall:"E", t:9,
    title:"Legitimation Code Theory",
    author:"Maton, 2014",
    cluster:"EAP-specific",
    style:"bauhaus",
    summary:"A framework for analysing what is 'legitimated' as knowledge in different fields, using dimensions like semantic gravity (context-dependence) and semantic density (condensation).",
    extendedSummary:"LCT names what other frameworks point at: disciplines differ in how they handle the relationship between abstract claims and concrete examples. Strong teaching deliberately 'waves' between high and low semantic gravity — moving from the abstract concept down to a vivid case and back up to the principle — and explicitly teaches the move.",
    keypoints:[
      "Analyses what counts as legitimate knowledge in a field.",
      "Semantic gravity: how context-dependent meaning is.",
      "Semantic density: how condensed meaning is.",
      "Effective teaching 'waves' between high and low semantic gravity."
    ]
  }),

  T({ id:"genre-process", room:"eap", wall:"W", t:-9,
    title:"Genre as Social Process",
    author:"Sydney School & beyond",
    cluster:"EAP-specific",
    style:"orbit",
    summary:"Genres are conventionalised responses to recurring rhetorical situations — patterns that emerge from disciplinary communities, not rule-books to be followed.",
    extendedSummary:"Genre-as-social-process refuses to teach genres as forms to be filled in. It treats them as practical solutions to recurring rhetorical problems — what does this community do when it has to argue for the relevance of a new study? — and asks learners to participate in that problem-solving, not perform a template.",
    keypoints:[
      "Genres as conventionalised responses to recurring situations.",
      "Patterns emerge from disciplinary communities.",
      "Learners participate in disciplinary discourse, not 'general English'.",
      "Not rule-books — practical solutions."
    ]
  }),

  T({ id:"dialogic-feedback", room:"eap", wall:"W", t:-3,
    title:"Dialogic Feedback",
    author:"composite",
    cluster:"EAP-specific",
    style:"rings",
    summary:"In EAP, feedback works best as dialogue — tutorials and peer review are where academic literacy is actually constructed, not just where errors are caught.",
    extendedSummary:"Dialogic feedback aligns Hattie and Timperley's process and self-regulation levels with the EAP tradition of tutorial work. The conversation is the site of learning — not the marginal note. Students who can ask back, justify, and revise in conversation develop the metacognitive habits that one-way feedback rarely produces.",
    keypoints:[
      "Feedback as conversation, not correction.",
      "Tutorials are where academic literacy is constructed.",
      "Process and self-regulation, not surface fixes.",
      "Student justification and revision are the learning."
    ]
  }),

  T({ id:"discipline-ct", room:"eap", wall:"W", t:3,
    title:"Discipline-Specific Critical Thinking",
    author:"Jones, 2015",
    cluster:"EAP-specific",
    style:"layers",
    summary:"Critical thinking is not a single generic skill — it is shaped by the epistemology, methods and conventions of each discipline.",
    extendedSummary:"Generic 'critical thinking' instruction repeatedly fails to transfer because the moves that count as critique differ by discipline: source provenance for historians, methodology for engineers, internal coherence for philosophers. Teaching critical thinking in EAP means teaching the discipline's moves explicitly, not delivering a context-free skill.",
    keypoints:[
      "Critical thinking shaped by each discipline's epistemology.",
      "What counts as 'good argument' differs by field.",
      "Transfer across disciplines is not automatic.",
      "Teach the discipline's moves explicitly."
    ]
  }),

  // ═════════════════════════════════════════════════════════════════════════
  // TAXONOMY TOWER · TAXONOMIES, TRANSFER & EXPERTISE
  // ═════════════════════════════════════════════════════════════════════════

  T({ id:"bloom", room:"tax", wall:"S", t:-4,
    title:"Bloom's Revised Taxonomy",
    author:"Anderson & Krathwohl, 2001",
    cluster:"Taxonomy",
    style:"stripes",
    summary:"A hierarchy of cognitive processes — remember, understand, apply, analyse, evaluate, create — that gives shared vocabulary for designing tasks at progressively demanding levels.",
    extendedSummary:"Bloom's value is less the hierarchy than the diagnostic. Reading a module's outcomes through the verbs reveals when 'apply' is doing all the work and 'evaluate' and 'create' are missing. The revised taxonomy added a second dimension — factual, conceptual, procedural, metacognitive knowledge — that often catches misalignment a single dimension would miss.",
    keypoints:[
      "Remember → Understand → Apply → Analyse → Evaluate → Create.",
      "Knowledge dimensions: factual, conceptual, procedural, metacognitive.",
      "A diagnostic for the cognitive demand of outcomes and assessments.",
      "Useful for spotting AI-vulnerability: too many low-level outcomes."
    ],
    evidence:"★★★★☆",
    aiImplications:"A useful diagnostic for AI-vulnerability: clusters of low-level outcomes need higher-level companions."
  }),

  T({ id:"solo", room:"tax", wall:"S", t:4,
    title:"SOLO Taxonomy",
    author:"Biggs & Collis",
    cluster:"Taxonomy",
    style:"rings",
    summary:"A hierarchy of structural complexity in student understanding: prestructural, unistructural, multistructural, relational, extended abstract.",
    extendedSummary:"Where Bloom tells you what the student should do, SOLO tells you what their thinking should look like. The leap from multistructural (many ideas listed) to relational (ideas connected into a system) is the move most undergraduate work fails to make — and the move AI-generated text most reliably misses.",
    keypoints:[
      "Prestructural — no relevant grasp.",
      "Unistructural — one relevant aspect.",
      "Multistructural — several aspects, not connected.",
      "Relational — connected into a coherent whole.",
      "Extended abstract — generalised beyond the case."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI output looks multi-structural at first glance; extended-abstract integration distinguishes student-led work."
  }),

  T({ id:"threshold", room:"tax", wall:"E", t:-4,
    title:"Threshold Concepts  ✦",
    author:"Meyer & Land",
    cluster:"Taxonomy",
    style:"bauhaus",
    summary:"Within each discipline there are concepts that, once grasped, transform a learner's view of the subject. They are troublesome, irreversible and integrative — and progress depends on crossing them.",
    extendedSummary:"Threshold concepts are the doors between superficial competence and real disciplinary thinking. Opportunity cost in economics, statistical significance in social science, complex numbers in maths — students can perform the surface operations without crossing the threshold, and the apparent competence is fragile. Designing for threshold crossings means designing for productive struggle and conceptual change, not for clarity.",
    keypoints:[
      "Transformative — change the learner's view of the field.",
      "Troublesome — counter-intuitive or conceptually difficult.",
      "Irreversible — hard to unlearn once crossed.",
      "Integrative — reveal previously hidden interrelations.",
      "Often accompanied by 'liminal' states of partial understanding."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI explanations are characteristically too clear; the productive struggle is what the threshold actually requires."
  }),

  T({ id:"transfer", room:"tax", wall:"E", t:4,
    title:"Transfer of Learning",
    author:"Thorndike; Perkins & Salomon",
    cluster:"Transfer & expertise",
    style:"orbit",
    summary:"Applying what is learned in one context to another. Near transfer (to similar contexts) happens fairly readily; far transfer (to dissimilar contexts) is rare and must be designed for.",
    extendedSummary:"The transfer literature is humbling. Far transfer is not the byproduct of good local teaching; it requires deliberate work — varied contexts, abstracted principles, explicit comparison. The 'high road' (conscious abstraction) and 'low road' (automatic generalisation from heavy practice) of Perkins and Salomon name two routes worth designing for.",
    keypoints:[
      "Near transfer happens; far transfer rarely happens by itself.",
      "Vary contexts; abstract principles; compare cases.",
      "'High road' transfer through conscious abstraction.",
      "'Low road' transfer through heavy practice in many contexts."
    ],
    evidence:"★★★★☆",
    aiImplications:"Design tasks that require students to articulate why a principle applies, not just produce the application."
  }),

  T({ id:"deliberate-practice", room:"tax", wall:"W", t:-4,
    title:"Deliberate Practice",
    author:"Ericsson",
    cluster:"Transfer & expertise",
    style:"strokes",
    summary:"Targeted, effortful practice on specific aspects of performance, with rich feedback and just beyond current ability. Distinct from mere experience.",
    extendedSummary:"Ericsson's programme distinguishes the time you spent and the time that built expertise. Deliberate practice is focused, targets specific weaknesses, and depends on immediate, accurate feedback. The framework reshapes ideas of 'time in the discipline' — three years of deliberate practice usually outstrips ten years of repeated routine work.",
    keypoints:[
      "Focused, effortful, just beyond current ability.",
      "Targets specific aspects of performance.",
      "Requires rich, immediate feedback.",
      "Mere experience is not enough."
    ],
    evidence:"★★★★☆",
    aiImplications:"AI is well-placed to support targeted, feedback-rich practice; pair with human expert checkpoints."
  }),

  T({ id:"tacit-knowledge", room:"tax", wall:"W", t:4,
    title:"Tacit Knowledge",
    author:"Polanyi, 1966",
    cluster:"Transfer & expertise",
    style:"layers",
    summary:"'We know more than we can tell.' Much expert knowledge is procedural, embodied and resistant to articulation.",
    extendedSummary:"Polanyi's insight matters wherever expertise is being taught: a substantial portion of what a master knows is not in their explanations and is acquired only through participation. Assessments that require tacit knowledge — bedside manner, design judgement, diagnostic intuition — are inherently AI-resistant because, by definition, that knowledge is not in any training data.",
    keypoints:[
      "Much expert knowledge cannot be fully articulated.",
      "Acquired through participation, modelling and feedback.",
      "Underwrites professional judgement.",
      "Inherently AI-resistant — not in any training corpus."
    ],
    evidence:"★★★★☆",
    aiImplications:"Tacit knowledge is, by definition, not in the training data; assessments requiring it are inherently AI-resistant."
  }),

];

// quick lookup
const THEORIES_BY_ID = Object.fromEntries(THEORIES.map(t => [t.id, t]));

window.ROOMS = ROOMS;
window.THEORIES = THEORIES;
window.THEORIES_BY_ID = THEORIES_BY_ID;
