### Work on Development Branch (john) and Push to Master
1. git checkout master      # Switch to team development branch
2. git pull origin master   # Get latest team development code  
3. git checkout john        # Switch to John's personal branch
4. git merge master         # Update John's branch with latest master
5. # make your changes      # Do your development work
6. git add .                # Stage all changes
7. git commit -m "message"  # Save with clear description
8. git push origin john     # Push to John's personal branch

### Quick Push to Master (Direct Team Development)
1. git checkout master      # Make sure you're on master
2. git pull origin master   # Get latest changes
3. # make your changes      # Do your development work
4. git add .                # Stage all changes
5. git commit -m "message"  # Save with clear description
6. git push origin master   # Push directly to master branch

### Merge John's Work to Master Branch (Team Integration)
1. git checkout john           # Get John's development branch
2. git pull origin john        # Get latest work from John's branch
3. npm start                   # Test backend (keep running)
4. npm run dev                 # Test frontend (new terminal)
5. git checkout master         # Switch to team development branch
6. git pull origin master      # Get latest team development code
7. git merge john              # Merge John's work → master
8. git push origin master      # Push to team development branch
9. git log --oneline -5        # Verify merge success

### Deploy Master to Production (Main Branch)
1. git checkout master         # Ensure you're on master
2. git pull origin master      # Get latest team work
3. # Test thoroughly           # Run all tests and manual testing
4. git checkout main           # Switch to production branch
5. git pull origin main        # Get latest production code
6. git merge master            # Merge team work → production
7. git push origin main        # Deploy to production
8. git tag v1.x.x              # Tag the release (optional)

### Team Member Setup (One-time for John)
```bash
# Set up John's branch to track master instead of main
git checkout john
git branch --set-upstream-to=origin/master john

# Or create John's branch from master if it doesn't exist
git checkout master
git checkout -b john
git push -u origin john
```

### Branch Strategy
- **main**: Production/Stable branch (only for releases)
- **master**: Team development branch (all team members work here)
- **john**: John's personal feature branch
- **[member-name]**: Other team members' personal branches

### Daily Workflow for Team Members
1. **Start of day**: `git checkout master && git pull origin master`
2. **Switch to personal branch**: `git checkout john && git merge master`
3. **Work and commit**: Make changes, `git add .`, `git commit -m "message"`
4. **Push personal work**: `git push origin john`
5. **Integrate to team**: Merge back to master when feature is complete
