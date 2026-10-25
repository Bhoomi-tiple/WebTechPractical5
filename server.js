// ============================================================
//  server.js  —  Student Registration Portal (Practical 05)
//  Technology: Node.js + ExpressJS + EJS
// ============================================================

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
// Parse URL-encoded form bodies (from HTML <form> submissions)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (for API / fetch-based requests)
app.use(express.json());

// Serve static assets (CSS, client-side JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ── Helper: Server-Side Validation ──────────────────────────
/**
 * validateStudent(data)
 * Receives the raw POST body and returns an object:
 *   { errors: { field: 'message', … }, isValid: Boolean }
 *
 * NEVER trusts data from the browser — all rules are enforced here.
 */
function validateStudent(data) {
  const errors = {};

  // -- Full Name --------------------------------------------------
  const name = (data.name || '').trim();
  if (!name) {
    errors.name = 'Full Name is required.';
  } else if (name.length < 3) {
    errors.name = 'Full Name must be at least 3 characters long.';
  } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    errors.name = 'Full Name may only contain letters, spaces, hyphens, and apostrophes.';
  }

  // -- Email ------------------------------------------------------
  const email = (data.email || '').trim().toLowerCase();
  if (!email) {
    errors.email = 'Email Address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address (e.g. user@example.com).';
  }

  // -- Phone Number -----------------------------------------------
  const phone = (data.phone || '').trim();
  if (!phone) {
    errors.phone = 'Phone Number is required.';
  } else if (!/^\d{10}$/.test(phone)) {
    errors.phone = 'Phone Number must contain exactly 10 digits (numbers only).';
  }

  // -- Age --------------------------------------------------------
  const ageRaw = (data.age || '').trim();
  if (!ageRaw) {
    errors.age = 'Age is required.';
  } else {
    const age = Number(ageRaw);
    if (!Number.isInteger(age) || isNaN(age)) {
      errors.age = 'Age must be a whole number.';
    } else if (age < 17 || age > 60) {
      errors.age = 'Age must be between 17 and 60.';
    }
  }

  // -- Course Selection -------------------------------------------
  const validCourses = [
    'bsc-cs', 'bsc-it', 'bca', 'bcom', 'ba',
    'msc-cs', 'msc-it', 'mca', 'mba', 'other'
  ];
  const course = (data.course || '').trim();
  if (!course) {
    errors.course = 'Please select a course.';
  } else if (!validCourses.includes(course)) {
    errors.course = 'Invalid course selection. Please choose from the provided list.';
  }

  // -- Password ---------------------------------------------------
  const password = data.password || '';
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // -- Confirm Password -------------------------------------------
  const confirmPassword = data.confirmPassword || '';
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}


// ── Routes ──────────────────────────────────────────────────

/**
 * GET /
 * Renders the blank registration form.
 */
app.get('/', (req, res) => {
  res.render('index', {
    errors:  {},       // no errors on first load
    values:  {},       // no pre-filled values
    success: false
  });
});


/**
 * POST /register
 * Receives form data, runs server-side validation,
 * and either re-renders the form with errors or shows success.
 *
 * IMPORTANT: Passwords are NEVER sent back to the browser.
 */
app.post('/register', (req, res) => {
  const body = req.body;

  // Run validation
  const { errors, isValid } = validateStudent(body);

  if (!isValid) {
    // Re-render form with error messages and safe (non-sensitive) values.
    // Passwords are deliberately excluded from the values object.
    return res.status(400).render('index', {
      errors,
      values: {
        name:   (body.name   || '').trim(),
        email:  (body.email  || '').trim().toLowerCase(),
        phone:  (body.phone  || '').trim(),
        age:    (body.age    || '').trim(),
        course: (body.course || '').trim()
        // password & confirmPassword intentionally omitted
      },
      success: false
    });
  }

  // ── All validation passed ─────────────────────────────────
  // In a real app you would hash the password and save to DB.
  // Here we simply show a success message (no data stored).
  const studentName = (body.name || '').trim();

  res.status(200).render('index', {
    errors:  {},
    values:  {},
    success: true,
    studentName
  });
});


/**
 * 404 handler — catches any route not defined above.
 */
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head><title>404 – Not Found</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h1>404 – Page Not Found</h1>
        <p><a href="/">← Go back to Registration</a></p>
      </body>
    </html>
  `);
});


/**
 * Global error handler — catches any unhandled errors in middleware.
 */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', err);
  res.status(500).send(`
    <html>
      <head><title>500 – Server Error</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:60px;">
        <h1>500 – Internal Server Error</h1>
        <p>Something went wrong on the server. Please try again.</p>
        <p><a href="/">← Go back to Registration</a></p>
      </body>
    </html>
  `);
});


// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('─────────────────────────────────────────────');
  console.log(' Student Registration Portal — Practical 05  ');
  console.log('─────────────────────────────────────────────');
  console.log(` Server running at: http://localhost:${PORT}`);
  console.log(' Press Ctrl + C to stop the server.');
  console.log('─────────────────────────────────────────────');
});
