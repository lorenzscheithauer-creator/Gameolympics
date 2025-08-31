# Project Status: Blocked

## Summary of Completed Work

This project contains the complete frontend and backend implementation for a user authentication system as per the initial requirements.

### Backend (`/backend`)
- An Express.js server (`server.js`) has been created.
- API endpoints for user registration (`/register`), login (`/login`), and guest login (`/guest-login`) are fully implemented.
- User data is stored in an SQLite database (`database.db`).
- Password hashing is implemented using `bcrypt`.
- Server-side sessions are used for managing user authentication state.
- The server is configured to serve the frontend static files.

### Frontend (`/frontend`)
- HTML pages for the landing page (`index.html`), registration (`register.html`), login (`login.html`), and a post-login lobby (`lobby.html`) have been created.
- Client-side JavaScript (`main.js`, `auth.js`, `lobby.js`) has been written to handle form submissions, API interactions, and client-side session management (`sessionStorage`).

## Blocking Issue: Broken `npm` Environment

The project is currently blocked and cannot be run or tested due to a fundamental issue with the Node Package Manager (`npm`) in the execution environment.

The `npm` executable appears to be broken. It fails with a `uv_cwd` error (related to getting the current working directory) on most commands, including `npm install` and even `npm -v`. This prevents the project's dependencies from being installed correctly. Without the dependencies, the Node.js server cannot start or run properly, making it impossible to test the application.

## Troubleshooting Steps Taken

Multiple attempts were made to work around this issue, including:
- Running `npm install` from different directories.
- Using the `--prefix` flag with `npm install`.
- Performing clean installs by deleting `package-lock.json` and the `node_modules` directory.
- Chaining commands (`npm install && node server.js`) to ensure execution in the same shell session.
- Adding enhanced crash logging to the server to get more detailed error messages.

Despite these efforts, the underlying `npm` issue persists, making it impossible to proceed. The code itself is complete, but the environment prevents it from running.
