### commit and push to Master branch
1. git checkout main        # Switch to safe branch
2. git pull origin main     # Get latest stable code  
3. git checkout franco      # Switch to your work branch
4. git merge main           # Update your branch (main stays unchanged!)
5. # make your changes      # Do your development work
6. git add .                # Stage all changes
7. git commit -m "message"  # Save with clear description
8. git push origin master   # Share with team on development branch



### commit and push Master to Main branch 
1. git checkout master         # Get development branch
2. git pull origin master      # Get latest team work
3. npm start                   # Test backend (keep running)
4. npm run dev                 # Test frontend (new terminal)
5. git checkout main           # Switch to production
6. git pull origin main        # Get latest production
7. git merge master            # Merge development → production
8. git push origin main        # Deploy to production
9. git log --oneline -5        # Verify deployment success
