# Code.AI - Use Cases and Test Cases

## 1. Use Cases

### UC-01: User Authentication
**Actor:** User (Guest or Registered)
**Description:** Allows users to access the platform either anonymously or via secure email authentication.
**Preconditions:** User is on the Landing or Auth page.
**Flow:**
1. **Guest:** User clicks "Continue as Guest". System logs them in anonymously.
2. **Email:** User enters email. System sends OTP. User enters OTP. System logs them in.
**Postconditions:** User is redirected to the Code Editor with an active session.

### UC-02: Code Execution
**Actor:** Authenticated User
**Description:** User writes code in a specific language and executes it to see the output.
**Preconditions:** User is logged in and on the Code Editor page.
**Flow:**
1. User selects a programming language (e.g., Python, JavaScript).
2. User types code into the editor.
3. User clicks the "Run Code" button.
4. System sends code to Judge0 API.
5. System displays output or errors in the Output Panel.
**Postconditions:** Execution result is visible to the user.

### UC-03: AI Assistance
**Actor:** Authenticated User
**Description:** User utilizes AI to explain code, debug errors, or generate code edits.
**Preconditions:** User has code in the editor.
**Flow:**
1. **Explain:** User clicks "Explain Code". AI analyzes and returns a natural language explanation.
2. **Edit:** User types a request (e.g., "Add error handling") and clicks the wand icon. AI generates modified code.
3. **Chat:** User asks a general coding question. AI responds.
**Postconditions:** AI response is displayed in the Assistant panel.

### UC-04: Project Management
**Actor:** Authenticated User
**Description:** User saves, organizes, and retrieves code snippets.
**Preconditions:** User is logged in.
**Flow:**
1. **Save:** User clicks "My Projects" -> "Save Current Code". Enters title. System saves snippet.
2. **Load:** User opens "My Projects", selects a snippet, and clicks "Load". System populates the editor.
3. **Organize:** User creates folders and organizes snippets within them.
**Postconditions:** Data is persisted in the database.

---

## 2. Test Cases

### TC-01: Verify Guest Login
**Test Scenario:** Ensure a user can access the editor without providing an email.
**Steps:**
1. Navigate to the Auth page (`/auth`).
2. Click "Continue as Guest".
**Expected Result:** User is immediately redirected to `/editor`. User email shows as "Guest" or similar identifier.

### TC-02: Verify Code Execution (Happy Path)
**Test Scenario:** Run a simple "Hello World" program in Python.
**Steps:**
1. Select "Python" from the language dropdown.
2. Enter `print("Hello from Test")` in the editor.
3. Click "Run Code".
**Expected Result:** Output panel at the bottom displays `Hello from Test` with no errors.

### TC-03: Verify Code Execution (Error Handling)
**Test Scenario:** Run code with a syntax error.
**Steps:**
1. Select "JavaScript".
2. Enter `console.log("Missing paren"` (syntax error).
3. Click "Run Code".
**Expected Result:** Output panel displays a syntax error message in red text.

### TC-04: Verify AI Code Explanation
**Test Scenario:** Ask AI to explain the current code.
**Steps:**
1. Enter valid code in the editor.
2. Click the "Explain Code" button in the AI Assistant panel.
**Expected Result:** AI Assistant panel displays a text breakdown of what the code does.

### TC-05: Verify Theme Toggle
**Test Scenario:** Switch between Light and Dark modes.
**Steps:**
1. Click the Sun/Moon icon in the header.
**Expected Result:** 
- Application background and text colors invert.
- Code Editor theme switches between `vs` (light) and `vs-dark`.
- Preference persists after page reload.

### TC-06: Verify Saving a Snippet
**Test Scenario:** Save a piece of code to the project manager.
**Steps:**
1. Write some unique code.
2. Click "My Projects".
3. Click "Save Current Code".
4. Enter a title "Test Snippet" and save.
**Expected Result:** "Test Snippet" appears in the list of snippets. Loading it restores the code in the editor.
