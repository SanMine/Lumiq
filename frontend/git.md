### commit and push to Master branch

1. git checkout main        # Switch to safe branch
2. git pull origin main     # Get latest stable code  
3. git checkout franco      # Switch to your work branch
4. git merge main           # Update your branch (main stays unchanged!)
5. # make your changes      # Do your development work
6. git add .                # Stage all changes
7. git commit -m "message"  # Save with clear description
8. git push origin master   # Share with team on development branch



_______________________________________________________________________________


## 🌿 Git Workflow & Branch Management

### **Our Branch Strategy**

```
main branch    = 🔒 PRODUCTION (safe, stable, never break this!)
master branch  = 🚧 DEVELOPMENT (team works here, can have bugs)
feature branches = 👨‍💻 INDIVIDUAL WORK (your personal workspace)
```

### **Why This Strategy?**

```javascript
// Our workflow protects the main branch:

main branch:
// ✅ Always working and stable
// ✅ Safe to deploy to production
// ✅ Only receives tested code from master
// ✅ Rollback point if something goes wrong

master branch:
// 🚧 Development integration branch
// 🚧 Where team combines their work
// 🚧 Can have temporary bugs while features are being developed
// 🚧 Gets tested before merging to main

your-name-feature branch:
// 👨‍💻 Your personal workspace
// 👨‍💻 You can experiment safely
// 👨‍💻 Won't affect anyone else
// 👨‍💻 Can be messy during development
```

### **Team Workflow: Step by Step**

#### **Step 1: Initial Setup (Do Once)**
```bash
# Clone the repository
git clone https://github.com/SanMine/Lumiq.git
cd Lumiq

# Check what branches exist
git branch -a
# Shows:
# * main                    (you start here)
#   remotes/origin/main
#   remotes/origin/master
#   remotes/origin/franco

# Switch to master branch (our development branch)
git checkout master
# Now you're on: master branch

# Make sure you have the latest master
git pull origin master
```

#### **Step 2: Create Your Feature Branch (For Each New Feature)**
```bash
# Create and switch to your personal branch
# Use format: yourname-feature-description
git checkout -b john-user-login-feature

# Example branch names:
# sarah-database-setup
# mike-frontend-styling  
# anna-api-validation
# tom-bug-fix-email

# Verify you're on your branch
git branch
# Shows:
#   main
#   master  
# * john-user-login-feature    (← you are here)
```

#### **Step 3: Do Your Work**
```bash
# Work on your feature...
# Edit files, write code, test locally

# Check what you changed
git status
# Shows:
# On branch john-user-login-feature
# Changes not staged for commit:
#   modified:   frontend/src/components/Login.jsx
#   modified:   backend/src/routes/auth.js
```

#### **Step 4: Stay Updated (Pull from main regularly)**
```bash
# Every day or before starting work, get latest from main
git checkout main           # Switch to main branch
git pull origin main        # Get latest stable code

git checkout john-user-login-feature  # Switch back to your branch
git merge main              # Bring main's changes into your branch

# Alternative method (recommended):
git checkout john-user-login-feature
git pull origin main        # Pull main directly into your branch
```

#### **Step 5: Commit Your Changes**
```bash
# Add your changes to staging area
git add .                   # Add all changed files
# OR add specific files:
git add frontend/src/components/Login.jsx
git add backend/src/routes/auth.js

# Commit with descriptive message
git commit -m "Add user login form with validation"

# More examples of good commit messages:
git commit -m "Fix email validation bug in user registration"
git commit -m "Add password reset functionality"
git commit -m "Update user dashboard with new styling"
git commit -m "Connect login form to backend API"
```

#### **Step 6: Push to Master Branch (Not Main!)**
```bash
# IMPORTANT: Push to master, NOT main!
git push origin master

# This pushes your feature branch commits to the master branch
# master branch = where team integrates their work
# main branch = stays safe and stable

# If you get an error, pull latest master first:
git pull origin master      # Get latest team changes
git push origin master      # Try pushing again
```

### **Complete Daily Workflow**

```bash
# 🌅 Start of day routine:
git checkout main
git pull origin main        # Get latest stable code
git checkout your-feature-branch
git merge main              # Update your branch with latest

# 💻 During development:
# ... write code, test, etc ...
git add .
git commit -m "Descriptive message about what you did"

# 🌆 End of day routine:
git push origin master      # Share your work with team

# 🔄 When feature is complete:
# Create pull request: master → main
# After code review and testing, feature goes to production
```

### **Git Commands Reference**

#### **Branch Management**
```bash
# See all branches (local and remote)
git branch -a

# Create new branch and switch to it
git checkout -b branch-name

# Switch to existing branch
git checkout branch-name

# Delete branch (after feature is done)
git branch -d branch-name
```

#### **Getting Updates**
```bash
# Get latest from main (safe, stable code)
git pull origin main

# Get latest from master (team development code)
git pull origin master

# See what changed
git log --oneline -10      # Show last 10 commits
```

#### **Saving Your Work**
```bash
# See what you changed
git status                 # Show modified files
git diff                   # Show exact changes

# Stage changes for commit
git add .                  # Add all changes
git add filename.js        # Add specific file

# Commit changes
git commit -m "Clear description of what you did"

# Push to master branch (team development)
git push origin master
```

#### **Fixing Common Issues**
```bash
# Undo last commit (keep changes in files)
git reset --soft HEAD~1

# Undo all changes in a file
git checkout -- filename.js

# See commit history
git log --oneline

# Compare your branch with master
git diff master
```

### **Branch Protection Rules**

```javascript
// ❌ NEVER do these:
git push origin main        // DON'T push directly to main
git checkout main           // Don't work directly on main
git commit -m "fix"         // Don't use vague commit messages

// ✅ ALWAYS do these:
git push origin master      // Push to master (development branch)
git pull origin main        // Pull from main (get stable updates)
git commit -m "Add user login validation with error handling"  // Clear messages
```

### **Team Collaboration Examples**

#### **Scenario 1: Sarah starts new feature**
```bash
# Sarah creates user registration feature
git checkout main
git pull origin main
git checkout -b sarah-user-registration
# ... writes code ...
git add .
git commit -m "Add user registration form with email validation"
git push origin master
```

#### **Scenario 2: Mike gets Sarah's updates**
```bash
# Mike wants Sarah's latest code
git checkout mike-frontend-styling
git pull origin master     # Gets Sarah's registration code
# ... continues his styling work ...
git commit -m "Update login page styling to match registration"
git push origin master
```

#### **Scenario 3: Emergency fix needed**
```bash
# Bug found in production (main branch)
git checkout main
git pull origin main
git checkout -b hotfix-critical-bug
# ... fix the bug ...
git commit -m "Fix critical security vulnerability in login"
git push origin master     # Goes to master first for testing
# After testing: create pull request master → main for immediate deployment
```

### **Pull Request Workflow**

When your feature is ready for production:

```bash
# 1. Make sure your code is in master
git push origin master

# 2. Go to GitHub website
# 3. Create Pull Request: master → main
# 4. Add description of what your feature does
# 5. Request code review from team
# 6. After approval, merge to main
# 7. Deploy main to production
```

### **Commit Message Best Practices**

```bash
# ✅ GOOD commit messages:
git commit -m "Add user authentication with JWT tokens"
git commit -m "Fix database connection timeout issue"
git commit -m "Update user dashboard to show recent activities"
git commit -m "Remove deprecated API endpoints"

# ❌ BAD commit messages:
git commit -m "fix"
git commit -m "update"  
git commit -m "changes"
git commit -m "work"

# Format: Action + What + Why (if needed)
git commit -m "Add email validation to prevent invalid registrations"
git commit -m "Optimize database queries to improve page load speed"
git commit -m "Update dependencies to fix security vulnerabilities"
```

### **Emergency Procedures**

#### **If you accidentally pushed to main:**
```bash
# Don't panic! Contact team lead immediately
# We can revert the changes
git log origin/main         # Find your commit
git revert commit-hash      # Undo your changes safely
```

#### **If your branch is behind master:**
```bash
git checkout your-branch
git pull origin master     # Get latest team changes
git push origin master     # Push updated branch
```

#### **If you have merge conflicts:**
```bash
git pull origin master
# Git will show conflict files
# Open each file, fix conflicts (look for <<<< ==== >>>> markers)
git add .
git commit -m "Resolve merge conflicts with master"
git push origin master
```

### **Quick Reference Card**

```bash
# Daily commands you'll use most:
git checkout your-branch    # Switch to your work
git pull origin main        # Get latest stable code  
git add .                   # Stage your changes
git commit -m "message"     # Save your work
git push origin master      # Share with team

# Branch management:
git branch -a               # See all branches
git checkout -b new-branch  # Create new branch
git checkout branch-name    # Switch branches

# Safety commands:
git status                  # What did I change?
git diff                    # Show exact changes
git log --oneline          # Recent commits
```

Remember: **main = safe**, **master = development**, **your-branch = your workspace**! 🚀
