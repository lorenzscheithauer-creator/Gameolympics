import re
from playwright.sync_api import Page, expect, sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the app
        page.goto("http://localhost:5173/")

        # === Test Case 1: Invalid Login ===
        print("Testing invalid login...")
        page.get_by_placeholder("E-Mail").fill("wrong@test.com")
        page.get_by_placeholder("Passwort").fill("wrongpassword")
        page.get_by_role("button", name="Login").click()
        error_message_locator = page.locator(".message")
        expect(error_message_locator).to_have_text("Ungültige Anmeldedaten")
        print("Invalid login test passed.")

        # === Test Case 2: Successful Registration and Login ===
        print("Testing registration...")
        page.get_by_role("link", name="Hier registrieren").click()
        expect(page).to_have_url(re.compile(r'.*/register'))

        timestamp = int(time.time())
        unique_email = f"testuser_{timestamp}@example.com"
        unique_username = f"testuser_{timestamp}"

        page.get_by_placeholder("Username").fill(unique_username)
        page.get_by_placeholder("E-Mail").fill(unique_email)
        page.get_by_placeholder("Passwort").fill("password123")
        page.get_by_role("button", name="Registrieren").click()

        expect(page.locator(".message")).to_contain_text("Registrierung erfolgreich")
        expect(page).to_have_url(re.compile(r'.*/login'), timeout=10000)
        print("Registration successful.")

        print("Testing valid login with new user...")
        page.get_by_placeholder("E-Mail").fill(unique_email)
        page.get_by_placeholder("Passwort").fill("password123")
        page.get_by_role("button", name="Login").click()

        expect(page).to_have_url(re.compile(r'.*/$'))
        welcome_locator = page.get_by_test_id("welcome-message")
        expect(welcome_locator).to_have_text(f"Willkommen zurück, {unique_username}!")
        print("Valid login test passed.")

        # === Test Case 3: Duplicate Registration ===
        print("Logging out to test duplicate registration...")
        page.get_by_role("button", name="Logout").click()
        expect(page).to_have_url(re.compile(r'.*/login'))

        print("Testing duplicate username registration...")
        page.get_by_role("link", name="Hier registrieren").click() # Go to register page
        expect(page).to_have_url(re.compile(r'.*/register'))

        page.get_by_placeholder("Username").fill(unique_username) # Use same username
        page.get_by_placeholder("E-Mail").fill("another_email@example.com")
        page.get_by_placeholder("Passwort").fill("password123")
        page.get_by_role("button", name="Registrieren").click()
        expect(error_message_locator).to_have_text("Dieser Benutzername ist bereits vergeben.")
        print("Duplicate username test passed.")

        print("Testing duplicate email registration...")
        page.get_by_placeholder("Username").fill("another_username")
        page.get_by_placeholder("E-Mail").fill(unique_email) # Use same email
        page.get_by_placeholder("Passwort").fill("password123")
        page.get_by_role("button", name="Registrieren").click()
        expect(error_message_locator).to_have_text("Diese E-Mail-Adresse wird bereits verwendet.")
        print("Duplicate email test passed.")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
