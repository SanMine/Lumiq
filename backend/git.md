### Work on Development Branch (franco) and Push
1. git checkout main        # Switch to stable branch
2. git pull origin main     # Get latest stable code  
3. git checkout franco      # Switch to your development branch
4. git merge main           # Update your branch with latest main
5. # make your changes      # Do your development work
6. git add .                # Stage all changes
7. git commit -m "message"  # Save with clear description
8. git push origin franco   # Push to YOUR development branch

### Quick Push to Main (Direct Development)
1. git checkout main        # Make sure you're on main
2. git pull origin main     # Get latest changes
3. # make your changes      # Do your development work
4. git add .                # Stage all changes
5. git commit -m "message"  # Save with clear description
6. git push origin main     # Push directly to main branch



### Merge Development to Main Branch (Production Deploy)
1. git checkout franco         # Get your development branch
2. git pull origin franco      # Get latest work from your branch
3. npm start                   # Test backend (keep running)
4. npm run dev                 # Test frontend (new terminal)
5. git checkout main           # Switch to production branch
6. git pull origin main        # Get latest production code
7. git merge franco            # Merge development → production
8. git push origin main        # Deploy to production
9. git log --oneline -5        # Verify deployment success
