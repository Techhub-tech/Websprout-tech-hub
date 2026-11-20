require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'websprout_hub_dev_secret_change_in_prod';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'websprout.db'), (err) => {
  if (err) {
    console.error('SQLite connection error:', err.message);
  } else {
    console.log('Connected to WebSprout Hub SQLite database.');
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pre_uni_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      track TEXT,
      ss3_school TEXT,
      graduation_year TEXT,
      state_of_origin TEXT,
      exam_score INTEGER,
      exam_completed INTEGER DEFAULT 0,
      choice_1_inst TEXT,
      choice_2_inst TEXT,
      choice_3_inst TEXT,
      choice_4_inst TEXT,
      target_course TEXT,
      admitted_inst_id TEXT,
      admitted_inst_name TEXT,
      admission_status TEXT DEFAULT 'PENDING_PROFILE',
      admission_ref TEXT,
      completed_courses TEXT DEFAULT '[]',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS digital_skills_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_slug TEXT NOT NULL,
      course_title TEXT NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, course_slug),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
  });
}

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session.' });
    req.user = decoded;
    next();
  });
}

app.post('/api/auth/register', async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const normalizedEmail = email.trim().toLowerCase();

    db.run(
      `INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      [full_name.trim(), normalizedEmail, (phone || '').trim(), hash],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
          }
          return res.status(500).json({ error: 'Failed to create account.' });
        }

        const userId = this.lastID;
        db.run(`INSERT INTO pre_uni_profiles (user_id) VALUES (?)`, [userId]);

        const user = { id: userId, full_name: full_name.trim(), email: normalizedEmail, phone: (phone || '').trim(), role: 'student' };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user });
      }
    );
  } catch (e) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email.trim().toLowerCase()], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (!row) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const user = { id: row.id, full_name: row.full_name, email: row.email, phone: row.phone, role: row.role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  });
});

app.get('/api/pre-uni/state', authMiddleware, (req, res) => {
  db.get(`SELECT id, full_name, email, phone, role FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found.' });

    db.get(`SELECT * FROM pre_uni_profiles WHERE user_id = ?`, [req.user.id], (err2, profile) => {
      if (err2) return res.status(500).json({ error: 'Failed to load profile.' });

      db.all(`SELECT * FROM digital_skills_enrollments WHERE user_id = ?`, [req.user.id], (err3, enrollments) => {
        if (err3) return res.status(500).json({ error: 'Failed to load skill enrolments.' });

        const parsedProfile = profile
          ? { ...profile, completed_courses: JSON.parse(profile.completed_courses || '[]') }
          : null;

        res.json({
          user,
          profile: parsedProfile,
          digitalSkills: enrollments || []
        });
      });
    });
  });
});

app.put('/api/pre-uni/onboarding', authMiddleware, (req, res) => {
  const { track, ss3_school, graduation_year, state_of_origin } = req.body;
  if (!['Science', 'Arts'].includes(track)) {
    return res.status(400).json({ error: 'Please select either Science or Arts.' });
  }
  if (!ss3_school || !ss3_school.trim()) {
    return res.status(400).json({ error: 'Please enter your SS3 secondary school name.' });
  }

  db.run(
    `UPDATE pre_uni_profiles
     SET track = ?, ss3_school = ?, graduation_year = ?, state_of_origin = ?,
         admission_status = CASE WHEN admission_status = 'PENDING_PROFILE' THEN 'READY_FOR_EXAM' ELSE admission_status END,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [track, ss3_school.trim(), (graduation_year || '2026').trim(), (state_of_origin || '').trim(), req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Could not save SS3 onboarding info.' });
      res.json({ message: 'SS3 profile and academic track saved.' });
    }
  );
});

app.post('/api/pre-uni/exam-submit', authMiddleware, (req, res) => {
  const { score } = req.body;
  const numericScore = Number(score);
  if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 400) {
    return res.status(400).json({ error: 'Valid JAMB simulation score (0-400) is required.' });
  }

  db.run(
    `UPDATE pre_uni_profiles
     SET exam_score = ?, exam_completed = 1,
         admission_status = CASE WHEN admitted_inst_id IS NULL THEN 'EXAM_COMPLETED' ELSE admission_status END,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ?`,
    [Math.round(numericScore), req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to record exam result.' });
      res.json({ message: 'Prep exam score recorded.', exam_score: Math.round(numericScore) });
    }
  );
});

app.post('/api/pre-uni/choices-submit', authMiddleware, (req, res) => {
  const { choice_1_inst, choice_2_inst, choice_3_inst, choice_4_inst, target_course, institutionsCatalog } = req.body;
  if (!choice_1_inst || !target_course) {
    return res.status(400).json({ error: 'At least a 1st Choice Institution and Target Course are required.' });
  }

  db.get(`SELECT * FROM pre_uni_profiles WHERE user_id = ?`, [req.user.id], (err, profile) => {
    if (err || !profile) return res.status(404).json({ error: 'Pre-University profile not found.' });
    if (!profile.exam_completed || profile.exam_score == null) {
      return res.status(400).json({ error: 'Please complete the JAMB-style prep exam before submitting institution choices.' });
    }

    const orderedChoices = [choice_1_inst, choice_2_inst, choice_3_inst, choice_4_inst].filter(Boolean);
    const catalog = Array.isArray(institutionsCatalog) ? institutionsCatalog : [];

    let admittedInst = null;
    for (const choiceId of orderedChoices) {
      const inst = catalog.find((item) => item.id === choiceId);
      if (inst && profile.exam_score >= inst.cutoffMark) {
        admittedInst = inst;
        break;
      }
    }

    const admissionStatus = admittedInst ? 'ADMITTED_SIMULATION' : 'NOT_YET_QUALIFIED';
    const admissionRef = admittedInst
      ? `WSH-SIM-${new Date().getFullYear()}-${String(req.user.id).padStart(4, '0')}`
      : null;

    db.run(
      `UPDATE pre_uni_profiles
       SET choice_1_inst = ?, choice_2_inst = ?, choice_3_inst = ?, choice_4_inst = ?,
           target_course = ?,
           admitted_inst_id = ?,
           admitted_inst_name = ?,
           admission_status = ?,
           admission_ref = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [
        choice_1_inst,
        choice_2_inst || '',
        choice_3_inst || '',
        choice_4_inst || '',
        target_course,
        admittedInst ? admittedInst.id : null,
        admittedInst ? admittedInst.name : null,
        admissionStatus,
        admissionRef,
        req.user.id
      ],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Failed to process institution choices.' });
        res.json({
          admitted: Boolean(admittedInst),
          admission_status: admissionStatus,
          admission_ref: admissionRef,
          admitted_inst_id: admittedInst ? admittedInst.id : null,
          admitted_inst_name: admittedInst ? admittedInst.name : null,
          exam_score: profile.exam_score,
          required_cutoff: admittedInst ? admittedInst.cutoffMark : null
        });
      }
    );
  });
});

app.post('/api/pre-uni/course-toggle', authMiddleware, (req, res) => {
  const { courseCode } = req.body;
  if (!courseCode) return res.status(400).json({ error: 'Course code is required.' });

  db.get(`SELECT completed_courses FROM pre_uni_profiles WHERE user_id = ?`, [req.user.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Profile not found.' });

    let list = [];
    try {
      list = JSON.parse(row.completed_courses || '[]');
    } catch {
      list = [];
    }

    if (list.includes(courseCode)) {
      list = list.filter((c) => c !== courseCode);
    } else {
      list.push(courseCode);
    }

    db.run(
      `UPDATE pre_uni_profiles SET completed_courses = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [JSON.stringify(list), req.user.id],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Failed to update course progress.' });
        res.json({ completed_courses: list });
      }
    );
  });
});

app.post('/api/digital-skills/enroll', authMiddleware, (req, res) => {
  const { course_slug, course_title } = req.body;
  if (!course_slug || !course_title) {
    return res.status(400).json({ error: 'Course slug and title are required.' });
  }

  db.run(
    `INSERT OR IGNORE INTO digital_skills_enrollments (user_id, course_slug, course_title) VALUES (?, ?, ?)`,
    [req.user.id, course_slug, course_title],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to enroll in skill course.' });
      res.status(201).json({ message: `Enrolled in ${course_title}` });
    }
  );
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WebSprout Hub API' });
});

app.listen(PORT, () => {
  console.log(`WebSprout Hub backend running on http://localhost:${PORT}`);
});
