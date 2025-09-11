# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
Work on Development Branch (franco) and Push
1.  git checkout main        # Switch to stable branch
2.  git pull origin main     # Get latest stable code  
3.  git checkout franco      # Switch to your development branch
4.  git merge main           # Update your branch with latest main
5.  # make your changes      # Do your development work
6.  git add .                # Stage all changes
7.  git commit -m "message"  # Save with clear description
8.  git push origin franco   # Push to YOUR development branch
git checkout master # Switch to team development branch
git pull origin master # Get latest team development code
git checkout john # Switch to John's personal branch
git merge master # Update John's branch with latest master
make your changes # Do your development work
git add . # Stage all changes
git commit -m "message" # Save with clear description
git push origin john # Push to John's personal branch