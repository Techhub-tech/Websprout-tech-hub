export const INSTITUTIONS_CATALOG = [
  {
    id: 'unilag-sim',
    name: 'University of Lagos (Simulated Prep Portal)',
    shortName: 'UNILAG Prep',
    location: 'Lagos, Nigeria',
    cutoffMark: 240,
    primaryColor: '#15803d',
    secondaryColor: '#facc15',
    badgeText: 'FIRST CHOICE PREP PORTAL • GREEN & GOLD CREST',
    motto: 'In Deed and in Truth (Preparatory Simulation)'
  },
  {
    id: 'ui-sim',
    name: 'University of Ibadan (Simulated Prep Portal)',
    shortName: 'UI Prep',
    location: 'Ibadan, Nigeria',
    cutoffMark: 230,
    primaryColor: '#1e3a8a',
    secondaryColor: '#38bdf8',
    badgeText: 'PREMIER PREP PORTAL • ROYAL BLUE CREST',
    motto: 'Recte Sapere Fons (Preparatory Simulation)'
  },
  {
    id: 'abu-sim',
    name: 'Ahmadu Bello University (Simulated Prep Portal)',
    shortName: 'ABU Zaria Prep',
    location: 'Zaria, Nigeria',
    cutoffMark: 210,
    primaryColor: '#065f46',
    secondaryColor: '#d97706',
    badgeText: 'NORTHERN PREP PORTAL • EMERALD & AMBER CREST',
    motto: 'Knowledge and Practice (Preparatory Simulation)'
  },
  {
    id: 'unn-sim',
    name: 'University of Nigeria, Nsukka (Simulated Prep Portal)',
    shortName: 'UNN Prep',
    location: 'Nsukka, Nigeria',
    cutoffMark: 200,
    primaryColor: '#166534',
    secondaryColor: '#86efac',
    badgeText: 'LION PREP PORTAL • FOREST GREEN CREST',
    motto: 'To Restore the Dignity of Man (Preparatory Simulation)'
  },
  {
    id: 'unilorin-sim',
    name: 'University of Ilorin (Simulated Prep Portal)',
    shortName: 'UNILORIN Prep',
    location: 'Ilorin, Nigeria',
    cutoffMark: 190,
    primaryColor: '#6b21a8',
    secondaryColor: '#e9d5ff',
    badgeText: 'BETTER BY FAR PREP PORTAL • PURPLE CREST',
    motto: 'Character and Learning (Preparatory Simulation)'
  },
  {
    id: 'baze-sim',
    name: 'Baze University (Simulated Prep Portal)',
    shortName: 'Baze Prep',
    location: 'Abuja, Nigeria',
    cutoffMark: 180,
    primaryColor: '#0f766e',
    secondaryColor: '#99f6e4',
    badgeText: 'CAPITAL PREP PORTAL • TEAL CREST',
    motto: 'Learn to Live (Preparatory Simulation)'
  }
];

export const TARGET_COURSES_BY_TRACK = {
  Science: [
    'Computer Science & Software Engineering',
    'Medicine & Surgery (Pre-Med Prep)',
    'Electrical & Electronics Engineering',
    'Biochemistry & Molecular Biology',
    'Data Science & Applied Mathematics'
  ],
  Arts: [
    'Mass Communication & Digital Media',
    'Law & Legal Studies (Pre-Law Prep)',
    'English & Literary Studies',
    'International Relations & Diplomacy',
    'Economics & Public Policy'
  ]
};

export const EXAM_QUESTIONS_BY_TRACK = {
  Science: [
    {
      id: 'sci-1',
      subject: 'Use of English',
      question: 'Choose the option nearest in meaning to the underlined word: The principal gave a *laconic* speech at the SS3 valedictory assembly.',
      options: ['Lengthy and emotional', 'Brief and concise', 'Hostile and loud', 'Unprepared'],
      correctIndex: 1
    },
    {
      id: 'sci-2',
      subject: 'Mathematics',
      question: 'If f(x) = 2x² - 3x + 5, what is the value of f(3)?',
      options: ['14', '17', '20', '11'],
      correctIndex: 0
    },
    {
      id: 'sci-3',
      subject: 'Physics',
      question: 'Which quantity is a vector rather than a scalar?',
      options: ['Speed', 'Mass', 'Displacement', 'Temperature'],
      correctIndex: 2
    },
    {
      id: 'sci-4',
      subject: 'Chemistry',
      question: 'What is the chemical formula of common table salt (sodium chloride)?',
      options: ['NaOH', 'NaCl', 'Na2CO3', 'KCl'],
      correctIndex: 1
    },
    {
      id: 'sci-5',
      subject: 'Biology',
      question: 'Which organelle is primarily responsible for ATP energy production in eukaryotic cells?',
      options: ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Lysosome'],
      correctIndex: 1
    }
  ],
  Arts: [
    {
      id: 'art-1',
      subject: 'Use of English',
      question: 'Select the best word to complete the sentence: Despite the heavy rain, the students remained ____ about finishing their project.',
      options: ['sanguine', 'apathetic', 'lethargic', 'indifferent'],
      correctIndex: 0
    },
    {
      id: 'art-2',
      subject: 'Literature in English',
      question: 'A recurring symbol, motif, or idea that develops the central theme of a literary work is called a:',
      options: ['Soliloquy', 'Leitmotif', 'Malapropism', 'Oxymoron'],
      correctIndex: 1
    },
    {
      id: 'art-3',
      subject: 'Government',
      question: 'Separation of powers among the executive, legislature, and judiciary is designed mainly to:',
      options: ['Eliminate elections', 'Prevent tyranny and abuse of power', 'Abolish constitutions', 'Centralize all courts'],
      correctIndex: 1
    },
    {
      id: 'art-4',
      subject: 'Economics',
      question: 'Opportunity cost in economics refers to:',
      options: ['The monetary price paid at checkout', 'The next best alternative forgone when a choice is made', 'Total government tax revenue', 'Fixed factory rent'],
      correctIndex: 1
    },
    {
      id: 'art-5',
      subject: 'History & Civic Studies',
      question: 'Primary sources in historical research include:',
      options: ['Modern textbook summaries', 'Contemporary letters, diaries, and official records', 'Fictional movie adaptations', 'Later encyclopaedia reviews'],
      correctIndex: 1
    }
  ]
};

export const UNI_SEMESTER_COURSES_BY_TRACK = {
  Science: [
    {
      code: 'GST 111',
      title: 'Communication in English & Academic Writing',
      units: 2,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Covers university essay structure, research referencing, seminar presentation skills, and academic integrity.',
      quizQuestion: 'What is the primary purpose of citing sources in a university essay?',
      quizOptions: ['To pad the word count', 'To credit original authors and verify evidence', 'To avoid writing conclusions'],
      quizAnswer: 1
    },
    {
      code: 'MTH 101',
      title: 'Elementary Mathematics I (Calculus & Algebra)',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Introduces functions, limits, basic differentiation, sequences, series, and matrices for STEM undergraduates.',
      quizQuestion: 'In calculus, differentiation primarily measures:',
      quizOptions: ['Area under a straight line', 'Instantaneous rate of change', 'Total population size'],
      quizAnswer: 1
    },
    {
      code: 'CSC 101',
      title: 'Introduction to Computing & Problem Solving',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Covers algorithms, flowcharts, binary logic, computer architecture, and structured problem-solving.',
      quizQuestion: 'An algorithm is best defined as:',
      quizOptions: ['A step-by-step procedure to solve a problem', 'A physical computer monitor', 'An antivirus license'],
      quizAnswer: 0
    },
    {
      code: 'PHY 101',
      title: 'General Physics I (Mechanics & Properties of Matter)',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Explores Newton’s laws, work, energy, momentum, rotational motion, and elasticity in university labs.',
      quizQuestion: 'According to Newton’s second law, force equals:',
      quizOptions: ['Mass divided by acceleration', 'Mass multiplied by acceleration', 'Velocity squared'],
      quizAnswer: 1
    }
  ],
  Arts: [
    {
      code: 'GST 111',
      title: 'Communication in English & Academic Writing',
      units: 2,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Focuses on critical reading, structured arguments, academic referencing, and clear written expression.',
      quizQuestion: 'A strong thesis statement in a university paper should:',
      quizOptions: ['Present a clear, debatable central claim', 'List random unrelated facts', 'End with an unanswered joke'],
      quizAnswer: 0
    },
    {
      code: 'LIT 101',
      title: 'Introduction to Prose, Drama & Poetry',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Examines narrative voice, dramatic conflict, poetic imagery, and close textual analysis across genres.',
      quizQuestion: 'Close reading in literary studies focuses on:',
      quizOptions: ['Word choice, imagery, tone, and structure in the text', 'Guessing the author’s shoe size', 'Skipping stanzas'],
      quizAnswer: 0
    },
    {
      code: 'POL 101',
      title: 'Introduction to Political Science & Governance',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Introduces state structures, constitutions, civic institutions, public policy, and comparative politics.',
      quizQuestion: 'A constitution primarily defines:',
      quizOptions: ['Fundamental rules, powers, and limits of government', 'Daily weather forecasts', 'Private grocery lists'],
      quizAnswer: 0
    },
    {
      code: 'ECO 101',
      title: 'Principles of Microeconomics & Society',
      units: 3,
      semester: '100L Semester 1',
      pdfFile: '/materials/sample-course-guide.txt',
      summary: 'Covers scarcity, supply and demand, elasticity, consumer choice, and market structures.',
      quizQuestion: 'When demand increases while supply stays constant, equilibrium price tends to:',
      quizOptions: ['Rise', 'Fall to zero', 'Stay permanently fixed'],
      quizAnswer: 0
    }
  ]
};
