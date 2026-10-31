// The four Factory Excellence products. Each is sold and used on its own (`standalone`),
// and gains extra capability when connected to the Factory Head Core (`core`).

export const PRODUCTS = [
  {
    slug: "factory-kaizen", logo: "factorykaizen", name: "Factory Kaizen", module: "Continuous Improvement", accent: "#0D5360",
    card: "Drive continuous improvement across your manufacturing operations.",
    question: "How can we improve our operations?",
    headline: "Turn every operator's idea into a measured improvement.",
    intro: "Kaizen is the practice of making small, consistent improvements to processes, workplace efficiency, productivity and quality. Factory Kaizen collects improvement suggestions, tracks them to implementation and measures what they actually deliver.",
    purpose: "Give every employee a simple way to raise a problem or an idea, and give managers a clear way to follow it from submission to verified impact.",
    capabilities: [
      ["Improvement suggestions", "Employees submit ideas for improving factory operations from a phone or tablet."],
      ["Problem identification", "Capture bottlenecks, material wastage, downtime and process inefficiencies."],
      ["Kaizen tracking", "Follow each initiative from submission, through review and approval, to implementation."],
      ["Impact measurement", "Measure gains in productivity, cost savings, quality and cycle time."],
      ["Team participation", "Encourage employees and departments to take part, with visible participation by team."],
      ["Improvement history", "Keep a searchable record of completed improvements and their outcomes."]
    ],
    value: ["Reduces operational waste", "Improves production efficiency", "Encourages employee participation", "Reduces manufacturing costs", "Builds a culture of continuous improvement"],
    standalone: [
      "Idea submission, review and approval workflow",
      "Kaizen board with status from submitted to implemented",
      "Savings and cycle-time results entered against each kaizen",
      "Participation by employee, team and department",
      "Library of completed improvements"
    ],
    core: [
      ["Ideas linked to real losses", "Start a kaizen from a stop, defect or delay already recorded in the Core, instead of retyping the problem."],
      ["Savings verified, not claimed", "Impact is checked against the Core's baseline and review period, so reported savings are evidence-backed."],
      ["Reuse what already worked", "Plant Memory and Copilot surface earlier kaizens for similar faults, so teams stop solving the same problem twice."],
      ["Proven fixes update the standard", "A verified improvement can trigger an SOP revision and a skills update in the connected products."]
    ],
    useCases: [
      ["Shop-floor ideas", "An operator suggests a fixture change that shortens changeover. It is reviewed, trialled and its time saving is recorded."],
      ["Waste reduction drives", "A department runs a monthly drive on scrap and rework, with every idea and result in one place."],
      ["Cross-shift learning", "An improvement from the day shift is visible to the night shift and can be adopted the same week."]
    ],
    scenario: "Employees suggest improvements to the machine setup process to reduce defects and setup time."
  },
  {
    slug: "skill-matrix", logo: "factoryskills", name: "Factory Skills", module: "Skill Matrix", accent: "#7B4BC9",
    card: "Build a skilled, competent and production-ready workforce.",
    question: "Do our employees have the required skills?",
    headline: "Know who is qualified to run what, and where to train next.",
    intro: "A skill matrix tracks employee skills, technical competencies, training requirements and proficiency levels. Factory Skills shows managers which people are qualified for each operation and where additional training is needed.",
    purpose: "Put the right people on the right jobs, reduce dependence on a few individuals, and plan training from real gaps rather than guesswork.",
    capabilities: [
      ["Employee skill mapping", "Map employees against machines, processes and job roles."],
      ["Skill assessment", "Evaluate people against predefined competency levels."],
      ["Skill gap identification", "Find missing skills and competency gaps across departments."],
      ["Training management", "Plan training programmes from the gaps you have identified."],
      ["Certification tracking", "Track certifications and when each qualification expires."],
      ["Workforce readiness", "See who is qualified to operate a given machine or perform a given task."],
      ["Departmental overview", "View skill coverage across production lines and departments."]
    ],
    value: ["Improves workforce capability", "Puts the right people on the right jobs", "Reduces dependency on individuals", "Identifies training requirements", "Improves operational flexibility", "Supports workforce planning"],
    standalone: [
      "Skill matrix by line, machine and role",
      "Competency levels and assessments",
      "Gap view and training plan",
      "Certification expiry tracking and reminders",
      "Department-level coverage report"
    ],
    core: [
      ["Readiness against live production", "Check qualified cover against the shift plan and the orders running, not just a static grid."],
      ["Gaps found from real events", "When a repeat defect or stop is traced to a skill issue in the Core, the gap appears in the matrix with its evidence."],
      ["Training follows every change", "A verified kaizen or revised SOP can automatically raise the training needed for the people affected."],
      ["Capability in the decision", "Copilot and decision views see who can cover a machine when you plan a countermeasure."]
    ],
    useCases: [
      ["Shift planning", "A supervisor sees at a glance which operators can run a CNC machine before assigning the shift."],
      ["Cross-training", "A department builds backup cover for single-person operations to reduce risk."],
      ["Audit readiness", "Certification records are ready when a customer or auditor asks."]
    ],
    scenario: "Management identifies operators who need additional machine-operation training and schedules sessions."
  },
  {
    slug: "sop", logo: "factorysop", name: "Factory SOP", module: "SOP Management", accent: "#E8941F",
    card: "Standardise processes and ensure consistent execution.",
    question: "Are employees following standard procedures?",
    headline: "One current procedure, close to the work, read by the people who need it.",
    intro: "Standard Operating Procedures are the documented instructions for how tasks, processes and operations must be performed. Factory SOP helps you create, manage, distribute and monitor them so people follow one consistent method.",
    purpose: "Make sure the right procedure is the one in use: current, approved, accessible at the point of work and acknowledged by the people who must follow it.",
    capabilities: [
      ["SOP creation", "Create standard instructions for machines, processes and activities."],
      ["Document management", "Organise SOPs by department, machine and process."],
      ["Version control", "Keep every version and see what changed and when."],
      ["Employee access", "Let employees open the SOP relevant to the task they are doing."],
      ["Acknowledgement tracking", "Track who has read and acknowledged each required procedure."],
      ["Approval workflow", "Route documents to supervisors and managers for review and approval."],
      ["Compliance monitoring", "Verify whether documented procedures are being followed."]
    ],
    value: ["Standardises manufacturing operations", "Reduces process variation", "Minimises human error", "Improves workplace safety", "Preserves organisational knowledge", "Supports quality and regulatory compliance"],
    standalone: [
      "SOP editor with steps, images and checkpoints",
      "Library by department, machine and process",
      "Versioning with approval workflow",
      "Read-and-acknowledge tracking by employee",
      "Access from tablet, phone or workstation"
    ],
    core: [
      ["SOPs open from the event", "From a stop or quality hold in the Core, jump straight to the procedure that applies to that machine or process."],
      ["Revisions triggered by verified fixes", "When a countermeasure is confirmed, the Core prompts the owner to update the affected SOP and closes the loop."],
      ["Adherence linked to outcomes", "See whether defects and stops cluster where a procedure is not being followed."],
      ["Acknowledgement tied to skills", "Reading a revised SOP can feed the matrix, so qualification and procedure stay in step."]
    ],
    useCases: [
      ["Machine set-up", "A step-by-step set-up SOP is updated after a defect investigation and every operator acknowledges it."],
      ["New starters", "Joiners work from approved, current procedures from day one."],
      ["Safety and quality procedures", "Controlled documents with version history for regulatory review."]
    ],
    scenario: "The factory updates its machine setup SOP and ensures operators acknowledge the updated instructions."
  },
  {
    slug: "audit", logo: "factorystandards", name: "Factory Standards", module: "Audit Management", accent: "#2858D6",
    card: "Monitor compliance, identify gaps and drive corrective actions.",
    question: "Are our processes meeting required standards?",
    headline: "Inspect, find the gap, and prove it was closed.",
    intro: "Auditing is the structured way to check whether manufacturing processes, workplace practices, safety standards and quality requirements are being followed. Factory Standards plans audits, records non-conformities and tracks corrective action to closure.",
    purpose: "Give audits a consistent method and a clear owner for every finding, so a gap that is found is a gap that gets fixed and stays fixed.",
    capabilities: [
      ["Audit planning", "Schedule internal and external factory audits."],
      ["Audit checklists", "Build standard checklists for each audit category."],
      ["Factory inspections", "Inspect departments, production lines and facilities."],
      ["Non-conformity identification", "Record deviations, violations and operational gaps."],
      ["Evidence collection", "Attach photographs, documents and observations."],
      ["Corrective action tracking", "Assign corrective and preventive actions (CAPA) to responsible employees."],
      ["Audit reports", "Report audit scores, findings and compliance status."],
      ["Follow-up audits", "Verify that previously identified issues were resolved."]
    ],
    value: ["Improves factory compliance", "Identifies operational risks", "Strengthens quality management", "Improves workplace safety", "Ensures accountability", "Supports continuous improvement"],
    standalone: [
      "Audit calendar and assignments",
      "Reusable checklists scored on site",
      "Findings with photo and document evidence",
      "CAPA assignment, due dates and status",
      "Audit score and compliance reports"
    ],
    core: [
      ["Findings become tracked actions", "A non-conformity opens an owned action in the Core, kept attached to the original finding."],
      ["Audit where the losses are", "Prioritise audit scope using real stop, defect and delivery data rather than a fixed rota."],
      ["Closure verified against evidence", "A corrective action is only closed once the Core shows the result held over the review period."],
      ["Recurrence caught early", "Plant Memory flags a finding that has appeared before, with what was tried last time."]
    ],
    useCases: [
      ["Internal process audits", "Monthly layered audits of lines and departments with scored checklists."],
      ["Customer and certification audits", "Evidence and corrective action records are ready to present."],
      ["Follow-up verification", "Re-audit confirms the earlier gap is genuinely closed."]
    ],
    scenario: "An audit identifies that operators are not following the prescribed machine setup procedure."
  }
];

export const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);

// The order in which the four products solve one real problem (frequent production defects).
export const STORY = ["audit", "sop", "skill-matrix", "factory-kaizen"];
