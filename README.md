# Project Status: Blocked by Unusable Node.js Environment

## Summary of Completed Work

The source code for a complete frontend and backend user authentication system is present in this repository. All logic for registration, login, guest access, password hashing, and frontend views is implemented.

**However, the application cannot be run or tested due to a severely broken execution environment.**

## The Core Blocker: Broken Node.js / NPM / Docker Environment

All attempts to install the required Node.js dependencies have failed. The environment exhibits multiple, fundamental issues:

1.  **`npm` is Unusable:** The `npm` client is broken. It consistently fails with a `uv_cwd` error unless the current working directory is first reset with `cd ~`. Even when it runs, it produces a corrupted `node_modules` directory, causing the server to crash immediately with `Error: Cannot find module 'express'`.
2.  **Alternative Package Managers are Unusable:** Attempts to use `pnpm` also failed. The installation via `npm` was successful, but the `node_modules` directory it created was also broken, leading to the same crash. The issue seems to be with Node.js's module resolution itself, not just `npm`.
3.  **Docker is Inaccessible:** An attempt to bypass the host environment entirely using Docker failed with a `permission denied` error when connecting to the Docker daemon socket. The agent does not have the required permissions to use Docker.

## Exhaustive Troubleshooting Steps Taken

The following strategies have been attempted and have all failed, confirming the environment is the root cause:

*   **Standard Installation:** `npm install` and `npm ci` both produce broken dependency trees.
*   **Alternative Package Managers:** `pnpm` was successfully installed but also produced a broken dependency tree.
*   **Environment Resets:** The `uv_cwd` error was temporarily fixed by running `cd ~` before `npm` commands, but this did not fix the underlying installation corruption.
*   **Cache Cleaning:** `npm cache clean --force` was attempted but also failed due to the `uv_cwd` error.
*   **Containerization:** A complete Docker setup (`Dockerfile`, `docker-compose.yml`) was created, but could not be launched due to lack of permissions.

**Conclusion:** This task is impossible to complete in the current environment. The code is written, but cannot be run or verified. The environment needs to be repaired or replaced by the platform provider.
