# Level 2 - Task 4: Login Authentication System

A secure client-side **Login & Registration Authentication System** built using HTML5, CSS3, and Vanilla JavaScript with `localStorage` state management and session guards. Developed as part of the **OASIS Infobyte Summer Internship Program (OIBSIP)**.

## Project Demo
- **Live Preview:** [View Project](https://vaishnavithorat6852.github.io/-OIBSIP/OIBSIP/WebDevelopment-Level2-Task4-LoginAuthenticationSystem/)

## Features
- **Dynamic Portal Swapping**: Single-Page visual transition slides toggling between the Sign In and Register Account states.
- **Client-Side SHA-256 Hashing**: Implements native cryptographic hashing via the browser's **Web Crypto API** (`crypto.subtle.digest`) to store passwords securely, preventing plain-text data storage.
- **Form Input Validation**:
  - Fields validation prevents empty submissions.
  - Password strength validation checks for a minimum of 8 characters and at least 1 number.
  - Confirmation password validation prevents typos.
- **Security Check Redirection**: The protected dashboard `dashboard.html` executes an immediate inline verification script in the head to detect a session. Direct navigation without a valid session automatically redirects users to `index.html`.
- **Abstracted Login Errors**: Generalizes credential matching failure messages ("Invalid username/email or password") to prevent username enumeration exploits.
- **Database Duplicate Checks**: Disallows registration of usernames or email addresses already present in local storage.
- **Session Expiry (Logout)**: Clears the current active session state and routes back to the entry portal.

## Tech Stack
- **HTML5**: Form labels, layout dividers, structure.
- **CSS3**: Glassmorphic styling, floating input labels, alert card transitions.
- **Vanilla JavaScript**: Web Crypto hashing, session routes validation, local database sync.

## Running Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/vaishnavithorat6852/-OIBSIP.git
   ```
2. Navigate to the project directory and open `index.html` in your web browser:
   ```bash
   cd -OIBSIP/OIBSIP/WebDevelopment-Level2-Task4-LoginAuthenticationSystem
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

---

## Intern Details
- **Name:** Vaishnavi Thorat
- **Program:** OASIS Infobyte Summer Internship Program (OIBSIP)
- **Track:** Web Development and Designing
- **Level:** Level 2, Task 4
- **GitHub Profile:** [vaishnavithorat6852](https://github.com/vaishnavithorat6852)
