// data.js — Magazine content for the Learning Gallery guidebook.
// Pulled from gallery/data.js and supplemented with pre-room questions and
// full academic references for each wing.

window.GUIDE = {
  meta: {
    issue: "Issue 01",
    season: "Visitor's Edition",
    publisher: "The Learning Gallery",
  },

  rooms: [
    {
      id: "atrium",
      ordinal: "00",
      name: "The Rotunda",
      tag: "Meta-frameworks · Teacher stance · Contested ideas",
      hue: "#8a6d44",
      wall: "#dccdb2",
      pattern: "orbit",
      lede:
        "You enter beneath an oculus. Eight doorways radiate from a single drum, each labelled and faintly lit by the wing it leads into. Here, before you commit to a direction, are the meta-frameworks that try to organise the rest of the building — and the contested theories worth approaching with care.",
      curator:
        "The rotunda exists because no single theory of learning is enough. It collects diagnostics (McCrea's nine principles, the Learning Loop), stance‑setters (the meddler, looped input, tools‑not‑rules) and a small ring of celebrated theories that the evidence has not been kind to.",
      look: [
        "McCrea's Nine Principles — a portable checklist drawn from the wider evidence base.",
        "Meddler in the Middle — McWilliam's image of the teacher as a co-worker in the room.",
        "Learning Styles, SAMR, Multiple Intelligences — popular and empirically thin; the gallery shows them honestly.",
      ],
      featured: ["mccrea", "meddler", "learning-styles"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Before you read another wall: who first taught you how to learn — and what, concretely, did they do?",
        },
        {
          mode: "Predict",
          text:
            "Of the eight wings before you, which will you feel most at home in? Which will you avoid?",
        },
        {
          mode: "Provoke",
          text:
            "If a theory of learning works only when the room agrees it works, is it a theory or a habit?",
        },
      ],
      refs: [
        "McCrea, P. (2018). Learning: What is it, and how might we catalyse it? Institute for Teaching.",
        "Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. Psychological Science in the Public Interest, 9(3), 105–119.",
        "McWilliam, E. (2008). Unlearning how to teach. Innovations in Education and Teaching International, 45(3), 263–269.",
        "Siemens, G. (2005). Connectivism: A learning theory for the digital age. International Journal of Instructional Technology and Distance Learning, 2(1).",
        "Hattie, J. (2009). Visible Learning. Routledge.",
      ],
    },

    {
      id: "design",
      ordinal: "01",
      name: "The Design Wing",
      tag: "Instructional design · Technology · Behaviourist roots",
      hue: "#a8551f",
      wall: "#d39a6f",
      pattern: "grid",
      lede:
        "How instruction is deliberately built. The wing opens with the systematic models — Backward Design, Gagné's events, ADDIE in the wings — and walks back through the behaviourist roots that still shape how we drill, score and certify.",
      curator:
        "Notice the through‑line: each picture tries to answer the same engineer's question — given an outcome, what is the shortest path? Some models begin from cognition; some from technology; some from the long behaviourist tradition of breaking competence into reinforceable parts.",
      look: [
        "Constructive Alignment — outcomes, activities and assessment must answer to each other.",
        "Backward Design — start from the evidence of understanding, then build the route to it.",
        "TPACK — technology, pedagogy and content as overlapping rather than separable expertise.",
      ],
      featured: ["alignment", "backward-design", "tpack"],
      questions: [
        {
          mode: "Predict",
          text:
            "List the four moves you would make to design a single lesson on a topic you know well. Now count how many begin with the outcome.",
        },
        {
          mode: "Reflect",
          text:
            "Was the most useful instruction you ever received designed, or improvised?",
        },
        {
          mode: "Provoke",
          text:
            "If your course can be delivered by a well-followed checklist, what was it you thought you were doing in it?",
        },
      ],
      refs: [
        "Biggs, J., & Tang, C. (2011). Teaching for Quality Learning at University (4th ed.). Open University Press.",
        "Wiggins, G., & McTighe, J. (2005). Understanding by Design (Expanded 2nd ed.). ASCD.",
        "Gagné, R. M. (1985). The Conditions of Learning (4th ed.). Holt, Rinehart and Winston.",
        "Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge. Teachers College Record, 108(6), 1017–1054.",
        "Garrison, D. R., Anderson, T., & Archer, W. (2000). Critical inquiry in a text-based environment. The Internet and Higher Education, 2(2–3), 87–105.",
      ],
    },

    {
      id: "cog",
      ordinal: "02",
      name: "The Cognition Wing",
      tag: "Cognitive architecture · Memory · Mental models",
      hue: "#6a4f99",
      wall: "#a78fc2",
      pattern: "layers",
      lede:
        "How the mind processes what it meets. The wing is built around a single constraint — working memory is small — and tracks the design consequences outward to schemas, dual coding, advance organisers and the conceptual changes that ordinary teaching does not produce.",
      curator:
        "If you read one frame in this wing, read Sweller. Cognitive Load Theory is the plumbing under almost every other picture here: a relational measure that explains why the same task overwhelms one student and bores the next in the same row.",
      look: [
        "Cognitive Load Theory — minimise extraneous load; protect the germane load of building schemas.",
        "Multimedia Learning — twelve evidence-backed principles for words-and-pictures design.",
        "Conceptual Change — fluent explanation rarely shifts a misconception; friction does.",
      ],
      featured: ["cog-load", "multimedia", "conceptual-change"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Recall the last time something was explained to you twice. What changed between the first and second telling?",
        },
        {
          mode: "Predict",
          text:
            "How many discrete pieces of new information do you think a person can hold in mind at once?",
        },
        {
          mode: "Provoke",
          text:
            "If working memory is small and fragile, why do so many lecture slides act as if it isn't?",
        },
      ],
      refs: [
        "Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257–285.",
        "Mayer, R. E. (2009). Multimedia Learning (2nd ed.). Cambridge University Press.",
        "Baddeley, A. D., & Hitch, G. (1974). Working memory. Psychology of Learning and Motivation, 8, 47–89.",
        "Paivio, A. (1986). Mental Representations: A Dual-Coding Approach. Oxford University Press.",
        "Ausubel, D. P. (1968). Educational Psychology: A Cognitive View. Holt, Rinehart and Winston.",
        "Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. Educational Psychologist, 38(1), 23–31.",
      ],
    },

    {
      id: "mem",
      ordinal: "03",
      name: "The Memory Wing",
      tag: "Memory · Practice strategies · Study science",
      hue: "#1f7d6d",
      wall: "#79bdb0",
      pattern: "rings",
      lede:
        "How memory is made durable. Here the evidence is unusually clean: spacing, retrieval, interleaving and generation produce stronger and more transferable learning than the techniques learners typically prefer — and the techniques learners typically prefer feel like learning while they happen.",
      curator:
        "The discomforting frame is Bjork's. The activities that feel most effective in the moment — re-reading, highlighting, smooth recitation — are often the ones working least. Easy fluency is an illusion the body produces; durable learning has the texture of difficulty.",
      look: [
        "Desirable Difficulties — counter-intuitive: harder practice produces more durable learning.",
        "Retrieval Practice — testing is itself a learning event, not just a measurement event.",
        "Dunlosky's review — practice testing and spacing rank highest; highlighting and re-reading rank lowest.",
      ],
      featured: ["desirable-difficulty", "retrieval-practice", "study-tech"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Pick a fact you learned a decade ago and still know. What, specifically, kept it?",
        },
        {
          mode: "Predict",
          text:
            "Of re-reading, highlighting, summarising and self-testing — rank them, before you enter, by how well each produces lasting retention.",
        },
        {
          mode: "Provoke",
          text:
            "If the techniques that feel most effective are the ones that work least, why do learners — including the ones in your seminars — keep choosing them?",
        },
      ],
      refs: [
        "Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way. In Psychology and the Real World. Worth.",
        "Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. Psychological Science, 17(3), 249–255.",
        "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58.",
        "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks. Psychological Bulletin, 132(3), 354–380.",
        "Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35, 481–498.",
      ],
    },

    {
      id: "mot",
      ordinal: "04",
      name: "The Motivation Wing",
      tag: "Motivation · Self-regulation · Learner agency",
      hue: "#5f7d28",
      wall: "#aac279",
      pattern: "orbit",
      lede:
        "What gets a learner to start, persist and steer their own course. The wing distinguishes the quality of motivation, not just the quantity — and treats motivation as a property of the room as much as the person.",
      curator:
        "Self-Determination Theory is the room's gravitational centre: autonomy, competence and relatedness, three needs that the design of a course either feeds or starves. Around it, self-efficacy, mindset and self-regulation translate motivation into a teachable set of habits.",
      look: [
        "Self-Determination Theory — three needs without which intrinsic motivation corrodes.",
        "Self-Efficacy — built by succeeding at hard things, not by having things done for you.",
        "Self-Regulated Learning — forethought, performance, reflection — a cycle you can teach.",
      ],
      featured: ["self-determination", "self-efficacy", "self-regulated"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Describe the last time you stayed with something difficult longer than you wanted to. What kept you there?",
        },
        {
          mode: "Predict",
          text:
            "What proportion of your students' motivation, would you say, you can design for?",
        },
        {
          mode: "Provoke",
          text:
            "Is a motivated learner a feature of the person, or of the room they happen to be in?",
        },
      ],
      refs: [
        "Deci, E. L., & Ryan, R. M. (2000). The 'what' and 'why' of goal pursuits. Psychological Inquiry, 11(4), 227–268.",
        "Bandura, A. (1997). Self-Efficacy: The Exercise of Control. W. H. Freeman.",
        "Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64–70.",
        "Eccles, J. S., & Wigfield, A. (2002). Motivational beliefs, values, and goals. Annual Review of Psychology, 53, 109–132.",
        "Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.",
        "Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row.",
      ],
    },

    {
      id: "soc",
      ordinal: "05",
      name: "The Social Wing",
      tag: "Social & situated learning · Constructivism",
      hue: "#33639c",
      wall: "#88a8ce",
      pattern: "strokes",
      lede:
        "Learning as a social, situated act. Knowledge here is built between people — in the question that reframes a draft, in the seminar that interrupts a thought — and tied to the practices of the community that uses it.",
      curator:
        "The wing's central claim is that the social is not a backdrop to learning but its engine. Vygotsky's Zone of Proximal Development is the precise aiming point; Lave and Wenger's communities of practice describe the destination — a fuller participation in a tradition.",
      look: [
        "Zone of Proximal Development — design at the upper edge of current ability, then fade the scaffold.",
        "Situated Learning — knowledge is bound to the practices that use it.",
        "Cognitive Apprenticeship — model, coach, scaffold, articulate, reflect, explore.",
      ],
      featured: ["zpd", "situated", "cog-apprenticeship"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Name a person whose questions changed how you think. What kind of question did they ask?",
        },
        {
          mode: "Predict",
          text:
            "Which of your seminars would survive being silently observed by a stranger?",
        },
        {
          mode: "Provoke",
          text:
            "If knowledge is built between people, what does it mean to assess one of them alone?",
        },
      ],
      refs: [
        "Vygotsky, L. S. (1978). Mind in Society: The Development of Higher Psychological Processes. Harvard University Press.",
        "Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.",
        "Bandura, A. (1977). Social Learning Theory. Prentice Hall.",
        "Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship: Teaching the crafts of reading, writing, and mathematics. In L. B. Resnick (Ed.), Knowing, Learning, and Instruction. Lawrence Erlbaum.",
        "Engeström, Y. (1987). Learning by Expanding: An Activity-Theoretical Approach. Orienta-Konsultit.",
      ],
    },

    {
      id: "adu",
      ordinal: "06",
      name: "The Adult Learning Wing",
      tag: "Adult & experiential learning · Constructivist approaches",
      hue: "#a23e55",
      wall: "#cf93a1",
      pattern: "rings",
      lede:
        "How adults learn differently — when they do. The wing collects the frameworks that treat prior experience, self-direction and immediate relevance as the materials learning is made from, and the experiential cycle that turns 'doing-then-reflecting' into a deliberate method.",
      curator:
        "Kolb's cycle is the wing's organising image, but its sharpest frame is Marton and Säljö's: deep and surface are not learner traits but task-driven strategies. The cleanest test of any course is whether the work it asks for can be done well without understanding it.",
      look: [
        "Andragogy — adults need to know why, draw on experience, and want autonomy.",
        "Experiential Learning Cycle — concrete experience, reflection, conceptualisation, experiment.",
        "Deep & Surface Approaches — students take the approach the assessment rewards.",
      ],
      featured: ["andragogy", "kolb", "deep-surface"],
      questions: [
        {
          mode: "Reflect",
          text:
            "Think of the most useful thing you learned in the last year. Where did the learning actually happen — and was anyone teaching?",
        },
        {
          mode: "Predict",
          text:
            "Adults bring richer experience than children. What follows for how you teach them on Monday morning?",
        },
        {
          mode: "Provoke",
          text:
            "Reflection has become a coursework genre. Is anyone still doing it?",
        },
      ],
      refs: [
        "Knowles, M. S. (1975). Self-Directed Learning: A Guide for Learners and Teachers. Association Press.",
        "Kolb, D. A. (1984). Experiential Learning: Experience as the Source of Learning and Development. Prentice Hall.",
        "Mezirow, J. (1991). Transformative Dimensions of Adult Learning. Jossey-Bass.",
        "Schön, D. A. (1983). The Reflective Practitioner: How Professionals Think in Action. Basic Books.",
        "Marton, F., & Säljö, R. (1976). On qualitative differences in learning. British Journal of Educational Psychology, 46(1), 4–11.",
        "Freeman, S., et al. (2014). Active learning increases student performance in STEM. PNAS, 111(23), 8410–8415.",
      ],
    },

    {
      id: "eap",
      ordinal: "07",
      name: "The EAP Wing",
      tag: "Genre · Discourse · Academic literacies",
      hue: "#494099",
      wall: "#9890c6",
      pattern: "stripes",
      lede:
        "Frameworks specific to English for Academic Purposes. The wing treats academic writing as situated social practice — a set of moves that disciplinary communities make, not a neutral skill to be transferred from outside.",
      curator:
        "Swales gives the descriptive apparatus, Lea and Street the politics, Halliday the meta-language and Maton the link between abstract claim and concrete case. Together they refuse the idea that 'academic English' is a single, polished idiom that can be taught at arm's length from the disciplines.",
      look: [
        "Swalesian Genre Pedagogy — texts as moves and steps that achieve communicative purposes.",
        "Academic Literacies — writing as identity-laden social practice, not surface correction.",
        "Systemic Functional Linguistics — a meta-language for how academic meaning is made.",
      ],
      featured: ["swales", "academic-literacies", "sfl"],
      questions: [
        {
          mode: "Reflect",
          text:
            "When you first wrote in a new genre, who or what actually taught you its conventions?",
        },
        {
          mode: "Predict",
          text:
            "What proportion of a research paper's meaning, would you guess, is carried by its first paragraph?",
        },
        {
          mode: "Provoke",
          text:
            "If 'critical thinking' looks different in every discipline, what exactly is a generic critical-thinking course teaching?",
        },
      ],
      refs: [
        "Swales, J. M. (1990). Genre Analysis: English in Academic and Research Settings. Cambridge University Press.",
        "Lea, M. R., & Street, B. V. (2006). The 'academic literacies' model: Theory and applications. Theory Into Practice, 45(4), 368–377.",
        "Halliday, M. A. K. (2003). On Language and Linguistics. Continuum.",
        "Maton, K. (2014). Knowledge and Knowers: Towards a Realist Sociology of Education. Routledge.",
        "Hyland, K. (2006). English for Academic Purposes: An Advanced Resource Book. Routledge.",
      ],
    },

    {
      id: "tax",
      ordinal: "08",
      name: "The Taxonomy Wing",
      tag: "Taxonomies · Transfer · Expertise",
      hue: "#b08820",
      wall: "#d8bd72",
      pattern: "bauhaus",
      lede:
        "How learning is classified — and the hard problem of why it so often refuses to travel. The wing pairs the ladders of complexity (Bloom, SOLO) with the literatures on transfer, threshold concepts and the development of expertise.",
      curator:
        "The wing's central irony is that the verbs at the top of Bloom's pyramid are the ones most courses claim to teach and most assessments don't ask for. Read SOLO and the transfer literature against your own module specifications and the gap is usually visible from the door.",
      look: [
        "Bloom's Revised Taxonomy — a diagnostic for the cognitive demand of outcomes and assessments.",
        "Threshold Concepts — transformative, troublesome, irreversible doors into a discipline.",
        "Transfer of Learning — far transfer is rare; it must be designed for, not assumed.",
      ],
      featured: ["bloom", "threshold", "transfer"],
      questions: [
        {
          mode: "Predict",
          text:
            "Of Bloom's six verbs — remember, understand, apply, analyse, evaluate, create — which one are most undergraduate tasks actually asking for?",
        },
        {
          mode: "Reflect",
          text:
            "Recall a concept that, once understood, changed how you saw the rest of your field. How did you cross it?",
        },
        {
          mode: "Provoke",
          text:
            "Most learning does not transfer. Why do we keep teaching as if it does?",
        },
      ],
      refs: [
        "Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). A Taxonomy for Learning, Teaching, and Assessing. Longman.",
        "Biggs, J. B., & Collis, K. F. (1982). Evaluating the Quality of Learning: The SOLO Taxonomy. Academic Press.",
        "Meyer, J. H. F., & Land, R. (2003). Threshold concepts and troublesome knowledge. ETL Project, Occasional Report 4.",
        "Perkins, D. N., & Salomon, G. (1992). Transfer of learning. In International Encyclopedia of Education (2nd ed.). Pergamon.",
        "Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363–406.",
        "Polanyi, M. (1966). The Tacit Dimension. Doubleday.",
      ],
    },
  ],
};

// Theory lookup by id (populated from the live gallery data when available;
// here we re-state minimal fields for the featured callouts so the guide
// stands alone.)
window.GUIDE_THEORIES = {
  "mccrea":            { title: "McCrea's Nine Principles", author: "McCrea, 2018" },
  "meddler":           { title: "Meddler in the Middle", author: "McWilliam, 2008" },
  "learning-styles":   { title: "Learning Styles / VARK ⚠", author: "Pashler et al., 2008" },
  "alignment":         { title: "Constructive Alignment", author: "Biggs & Tang" },
  "backward-design":   { title: "Backward Design", author: "Wiggins & McTighe, 2005" },
  "tpack":             { title: "TPACK", author: "Mishra & Koehler, 2006" },
  "cog-load":          { title: "Cognitive Load Theory", author: "Sweller, 1988" },
  "multimedia":        { title: "Multimedia Learning", author: "Mayer, 2009" },
  "conceptual-change": { title: "Conceptual Change", author: "Posner et al., 1982" },
  "desirable-difficulty": { title: "Desirable Difficulties", author: "Bjork & Bjork" },
  "retrieval-practice":   { title: "Retrieval Practice", author: "Roediger & Karpicke, 2006" },
  "study-tech":        { title: "Effective Study Techniques", author: "Dunlosky et al., 2013" },
  "self-determination":{ title: "Self-Determination Theory", author: "Deci & Ryan" },
  "self-efficacy":     { title: "Self-Efficacy", author: "Bandura, 1997" },
  "self-regulated":    { title: "Self-Regulated Learning", author: "Zimmerman" },
  "zpd":               { title: "Zone of Proximal Development", author: "Vygotsky, 1978" },
  "situated":          { title: "Situated Learning", author: "Lave & Wenger, 1991" },
  "cog-apprenticeship":{ title: "Cognitive Apprenticeship", author: "Collins, Brown & Newman" },
  "andragogy":         { title: "Andragogy", author: "Knowles, 1975" },
  "kolb":              { title: "Experiential Learning Cycle", author: "Kolb, 1984" },
  "deep-surface":      { title: "Deep & Surface Approaches", author: "Marton & Säljö, 1976" },
  "swales":            { title: "Swalesian Genre Pedagogy", author: "Swales, 1990" },
  "academic-literacies": { title: "Academic Literacies", author: "Lea & Street, 2006" },
  "sfl":               { title: "Systemic Functional Linguistics", author: "Halliday, 2003" },
  "bloom":             { title: "Bloom's Revised Taxonomy", author: "Anderson & Krathwohl, 2001" },
  "threshold":         { title: "Threshold Concepts", author: "Meyer & Land, 2003" },
  "transfer":          { title: "Transfer of Learning", author: "Perkins & Salomon, 1992" },
};
