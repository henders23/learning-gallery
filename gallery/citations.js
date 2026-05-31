// gallery/citations.js — canonical academic source(s) per exhibit.
//
// Each reference is copied verbatim from the guidebook's per-wing reading list
// (gallery/guidebook/data.js → window.GUIDE) and attached ONLY to the exhibit
// whose named author it plainly is — e.g. Sweller (1988) → cog-load,
// Vygotsky (1978) → zpd. Nothing is invented or paraphrased.
//
// Exhibits that are composite frameworks, shorthand, or popular myths are
// intentionally absent (like the optional evidence/pitfalls fields): they have
// no single anchoring source to cite honestly.

window.CITATIONS = {
  // ── Rotunda ──────────────────────────────────────────────────────────────
  "mccrea": ["McCrea, P. (2018). Learning: What is it, and how might we catalyse it? Institute for Teaching."],
  "learning-styles": ["Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. Psychological Science in the Public Interest, 9(3), 105–119."],
  "meddler": ["McWilliam, E. (2008). Unlearning how to teach. Innovations in Education and Teaching International, 45(3), 263–269."],
  "connectivism": ["Siemens, G. (2005). Connectivism: A learning theory for the digital age. International Journal of Instructional Technology and Distance Learning, 2(1)."],

  // ── Design Wing ────────────────────────────────────────────────────────────
  "alignment": ["Biggs, J., & Tang, C. (2011). Teaching for Quality Learning at University (4th ed.). Open University Press."],
  "backward-design": ["Wiggins, G., & McTighe, J. (2005). Understanding by Design (Expanded 2nd ed.). ASCD."],
  "gagne": ["Gagné, R. M. (1985). The Conditions of Learning (4th ed.). Holt, Rinehart and Winston."],
  "tpack": ["Mishra, P., & Koehler, M. J. (2006). Technological pedagogical content knowledge. Teachers College Record, 108(6), 1017–1054."],
  "community-of-inquiry": ["Garrison, D. R., Anderson, T., & Archer, W. (2000). Critical inquiry in a text-based environment. The Internet and Higher Education, 2(2–3), 87–105."],

  // ── Cognition Wing ─────────────────────────────────────────────────────────
  "cog-load": ["Sweller, J. (1988). Cognitive load during problem solving. Cognitive Science, 12(2), 257–285."],
  "multimedia": ["Mayer, R. E. (2009). Multimedia Learning (2nd ed.). Cambridge University Press."],
  "working-memory": ["Baddeley, A. D., & Hitch, G. (1974). Working memory. Psychology of Learning and Motivation, 8, 47–89."],
  "dual-coding": ["Paivio, A. (1986). Mental Representations: A Dual-Coding Approach. Oxford University Press."],
  "prior-knowledge": ["Ausubel, D. P. (1968). Educational Psychology: A Cognitive View. Holt, Rinehart and Winston."],
  "expertise-reversal": ["Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. Educational Psychologist, 38(1), 23–31."],

  // ── Memory Wing ────────────────────────────────────────────────────────────
  "desirable-difficulty": ["Bjork, R. A., & Bjork, E. L. (2011). Making things hard on yourself, but in a good way. In Psychology and the Real World. Worth."],
  "retrieval-practice": ["Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. Psychological Science, 17(3), 249–255."],
  "study-tech": ["Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4–58."],
  "spacing": ["Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks. Psychological Bulletin, 132(3), 354–380."],
  "interleaving": ["Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35, 481–498."],

  // ── Motivation Wing ────────────────────────────────────────────────────────
  "self-determination": ["Deci, E. L., & Ryan, R. M. (2000). The 'what' and 'why' of goal pursuits. Psychological Inquiry, 11(4), 227–268."],
  "self-efficacy": ["Bandura, A. (1997). Self-Efficacy: The Exercise of Control. W. H. Freeman."],
  "self-regulated": ["Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64–70."],
  "expectancy-value": ["Eccles, J. S., & Wigfield, A. (2002). Motivational beliefs, values, and goals. Annual Review of Psychology, 53, 109–132."],
  "mindset": ["Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House."],
  "flow": ["Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row."],

  // ── Social Wing ────────────────────────────────────────────────────────────
  "zpd": ["Vygotsky, L. S. (1978). Mind in Society: The Development of Higher Psychological Processes. Harvard University Press."],
  "situated": ["Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press."],
  "social-learning": ["Bandura, A. (1977). Social Learning Theory. Prentice Hall."],
  "cog-apprenticeship": ["Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship: Teaching the crafts of reading, writing, and mathematics. In L. B. Resnick (Ed.), Knowing, Learning, and Instruction. Lawrence Erlbaum."],
  "activity-theory": ["Engeström, Y. (1987). Learning by Expanding: An Activity-Theoretical Approach. Orienta-Konsultit."],

  // ── Adult Learning Wing ────────────────────────────────────────────────────
  "andragogy": ["Knowles, M. S. (1975). Self-Directed Learning: A Guide for Learners and Teachers. Association Press."],
  "kolb": ["Kolb, D. A. (1984). Experiential Learning: Experience as the Source of Learning and Development. Prentice Hall."],
  "transformative": ["Mezirow, J. (1991). Transformative Dimensions of Adult Learning. Jossey-Bass."],
  "reflective-practice": ["Schön, D. A. (1983). The Reflective Practitioner: How Professionals Think in Action. Basic Books."],
  "deep-surface": ["Marton, F., & Säljö, R. (1976). On qualitative differences in learning. British Journal of Educational Psychology, 46(1), 4–11."],
  "active-learning": ["Freeman, S., et al. (2014). Active learning increases student performance in STEM. PNAS, 111(23), 8410–8415."],

  // ── EAP Wing ───────────────────────────────────────────────────────────────
  "swales": ["Swales, J. M. (1990). Genre Analysis: English in Academic and Research Settings. Cambridge University Press."],
  "academic-literacies": ["Lea, M. R., & Street, B. V. (2006). The 'academic literacies' model: Theory and applications. Theory Into Practice, 45(4), 368–377."],
  "sfl": ["Halliday, M. A. K. (2003). On Language and Linguistics. Continuum."],
  "lct": ["Maton, K. (2014). Knowledge and Knowers: Towards a Realist Sociology of Education. Routledge."],

  // ── Taxonomy Wing ──────────────────────────────────────────────────────────
  "bloom": ["Anderson, L. W., & Krathwohl, D. R. (Eds.). (2001). A Taxonomy for Learning, Teaching, and Assessing. Longman."],
  "solo": ["Biggs, J. B., & Collis, K. F. (1982). Evaluating the Quality of Learning: The SOLO Taxonomy. Academic Press."],
  "threshold": ["Meyer, J. H. F., & Land, R. (2003). Threshold concepts and troublesome knowledge. ETL Project, Occasional Report 4."],
  "transfer": ["Perkins, D. N., & Salomon, G. (1992). Transfer of learning. In International Encyclopedia of Education (2nd ed.). Pergamon."],
  "deliberate-practice": ["Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363–406."],
  "tacit-knowledge": ["Polanyi, M. (1966). The Tacit Dimension. Doubleday."],
};
