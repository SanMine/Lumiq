# 🌟 Frontend Development Guide for Beginners

Welcome to the Lumiq frontend development! This guide will teach you everything you need to know to start building the user interface and connecting it to our database.

## 🚀 Quick Start Setup

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/SanMine/Lumiq.git
cd Lumiq

# Run the setup script
./setup-dev.sh

# Start development servers (open 2 terminals)
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Your app will be running at: **http://localhost:5173**

---

## 📁 Project Structure Explained

```
frontend/
├── src/                    # Your main development folder
│   ├── App.jsx            # Main app component (start here!)
│   ├── main.jsx           # App entry point (don't touch)
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility functions
│   │   └── api.js         # Database connection helper
│   └── assets/            # Images, icons, etc.
├── public/                # Static files
├── .env                   # Environment variables (don't commit!)
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
└── vite.config.js         # Build configuration
```

### 🎯 Where to Start Coding

**Start with these files in order:**

1. **`src/App.jsx`** - Main component (already has user management example)
2. **`src/components/`** - Create new components here
3. **`src/lib/api.js`** - Database API calls

---

## 🗄️ Database Connection Guide

### Understanding the Database Setup

```
Frontend (you) → Backend API → Railway Database
localhost:5173   localhost:3001   remote MySQL
```

### 🔌 How to Connect to Database

**All database operations go through `src/lib/api.js`:**

```javascript
// src/lib/api.js

// Import axios library - this helps us make HTTP requests to the backend
// axios is like a messenger that carries data between frontend and backend
import axios from "axios";

// Create an api object that we can use to talk to our backend
// This is like creating a phone line to call the backend
export const api = axios.create({
  // Set the base URL where our backend lives
  // import.meta.env.VITE_API_BASE_URL gets the URL from our .env file
  // If .env doesn't have it, use "http://localhost:3001/api" as backup
  // This tells axios: "when I say '/users', actually go to 'http://localhost:3001/api/users'"
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"
});
```

### 📊 Available Database Operations

Our database has a `users` table with these fields:
- `id` - Unique user ID
- `email` - User email (required, unique)
- `name` - User name (required)
- `password_hash` - Password (optional)
- `role` - User role (optional)
- `created_at` - When user was created
- `updated_at` - When user was last updated

---

## 💻 Easy Code Examples

### 1. Get All Users
```javascript
// Import the api object we created in lib/api.js (this is our database messenger)
import { api } from '../lib/api';
// Import React hooks - useState stores data, useEffect runs code when component loads
import { useState, useEffect } from 'react';

// Create a component (a piece of the website) called UserList
function UserList() {
  // Create a variable called 'users' that starts as an empty array []
  // setUsers is a function that can change the 'users' variable
  // Think of it like: users = the current list, setUsers = function to update the list
  const [users, setUsers] = useState([]);
  
  // Create a variable called 'loading' that starts as true
  // setLoading is a function that can change the 'loading' variable
  // We use this to show "Loading..." text while waiting for data
  const [loading, setLoading] = useState(true);

  // useEffect runs code when the component first appears on screen
  // The empty [] at the end means "only run this once when component loads"
  useEffect(() => {
    // Make a GET request to /users endpoint (this calls backend/src/routes/users.js)
    // api.get('/users') becomes a call to 'http://localhost:3001/api/users'
    api.get('/users')
      // .then() runs if the request succeeds (we got the data)
      .then(response => {
        // response.data contains the actual user data from the database
        // Update our 'users' variable with the data we received
        setUsers(response.data);
        // Set loading to false because we're done loading
        setLoading(false);
      })
      // .catch() runs if something goes wrong (network error, server error, etc.)
      .catch(error => {
        // Print the error to browser console so we can see what went wrong
        console.error('Error fetching users:', error);
        // Set loading to false even if there was an error
        setLoading(false);
      });
  }, []); // Empty array means this effect only runs once when component mounts

  // If loading is still true, show "Loading..." text
  // This shows while we wait for the database to respond
  if (loading) return <div>Loading...</div>;

  // Return the HTML that will be shown on the website
  return (
    <div>
      <h2>All Users</h2>
      {/* Loop through each user in the users array */}
      {/* .map() creates a new element for each user */}
      {users.map(user => (
        // Create a div for each user, key={user.id} helps React track each user
        // user.id comes from the database - it's the unique ID column
        <div key={user.id}>
          {/* Show the user's name - user.name comes from database 'name' column */}
          <h3>{user.name}</h3>
          {/* Show the user's email - user.email comes from database 'email' column */}
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Create New User
```javascript
// Import our database messenger from lib/api.js
import { api } from '../lib/api';
// Import useState to store form data
import { useState } from 'react';

// Create a component that lets users create new accounts
function CreateUser() {
  // Create a 'form' variable to store what user types in the form
  // It starts with empty name and email
  // setForm is the function to update this data
  const [form, setForm] = useState({ name: '', email: '' });
  
  // Create a 'loading' variable to track if we're currently saving to database
  // Starts as false (not loading)
  // setLoading changes this value
  const [loading, setLoading] = useState(false);

  // Function that runs when user clicks "Submit" button
  // 'e' is the event object (information about the click)
  const handleSubmit = async (e) => {
    // Prevent the page from refreshing (default form behavior)
    // Without this, the page would reload and lose our data
    e.preventDefault();
    
    // Set loading to true to show "Creating..." text on button
    setLoading(true);

    // try/catch handles errors - try runs the code, catch runs if there's an error
    try {
      // Send a POST request to create a new user
      // api.post() calls backend/src/routes/users.js POST endpoint
      // We send the form data (name and email) to the backend
      const response = await api.post('/users', {
        name: form.name,    // Get name from our form state
        email: form.email   // Get email from our form state
      });
      
      // Print success message to console - response.data contains the new user info
      console.log('User created:', response.data);
      
      // Clear the form by setting name and email back to empty strings
      setForm({ name: '', email: '' });
      
      // Show success message to user
      alert('User created successfully!');
    } catch (error) {
      // This runs if something went wrong (network error, validation error, etc.)
      console.error('Error creating user:', error);
      alert('Error creating user');
    } finally {
      // 'finally' always runs, whether success or error
      // Set loading back to false so button shows normal text again
      setLoading(false);
    }
  };

  // Return the HTML form that users will see
  return (
    // Form element with onSubmit calling our handleSubmit function
    <form onSubmit={handleSubmit}>
      {/* Input for user's name */}
      <input
        type="text"
        placeholder="Name"                    // Gray text shown when input is empty
        value={form.name}                     // Current value from our form state
        onChange={(e) => setForm({           // Function that runs when user types
          ...form,                           // Keep existing form data (spread operator)
          name: e.target.value              // Update only the name with what user typed
        })}
        required                             // HTML validation - form won't submit if empty
      />
      
      {/* Input for user's email */}
      <input
        type="email"                         // Email type gives email validation
        placeholder="Email"
        value={form.email}                   // Current email from form state
        onChange={(e) => setForm({          // Update email when user types
          ...form,                          // Keep name, update email
          email: e.target.value            // New email value
        })}
        required                            // Must be filled to submit
      />
      
      {/* Submit button */}
      <button 
        type="submit"                       // Makes this button submit the form
        disabled={loading}                  // Disable button while saving (prevents double-clicks)
      >
        {/* Show different text based on loading state */}
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### 3. Update User
```javascript
// Function to update an existing user in the database
// userId = which user to update (the ID number from database)
// newData = object containing the new information (like {name: "New Name"})
const updateUser = async (userId, newData) => {
  try {
    // Send PUT request to backend - PUT means "update existing data"
    // api.put() calls backend/src/routes/users.js PUT /:id endpoint
    // Template literal `users/${userId}` creates URL like "users/1" or "users/5"
    const response = await api.put(`/users/${userId}`, newData);
    
    // Print the updated user data to console
    console.log('User updated:', response.data);
    
    // Return the updated user data so other code can use it
    return response.data;
  } catch (error) {
    // If update fails, print error and re-throw it
    console.error('Error updating user:', error);
    throw error;  // Pass the error up so calling code can handle it
  }
};

// Example of how to use the updateUser function
const handleUpdateUser = () => {
  // Call updateUser function with user ID 1 and new name
  updateUser(1, { name: 'New Name' })
    // .then() runs if update succeeds
    .then(updatedUser => {
      // updatedUser contains the user data after the update
      console.log('Success!', updatedUser);
    })
    // .catch() runs if update fails
    .catch(error => {
      // Show error message to user
      console.log('Failed to update');
    });
};
```

### 4. Delete User
```javascript
// Function to delete a user from the database
// userId = the ID number of the user we want to delete
const deleteUser = async (userId) => {
  try {
    // Send DELETE request to backend
    // api.delete() calls backend/src/routes/users.js DELETE /:id endpoint
    // Template literal creates URL like "users/1" to delete user with ID 1
    await api.delete(`/users/${userId}`);
    
    // Print success message - no data returned for delete operations
    console.log('User deleted successfully');
  } catch (error) {
    // If delete fails, print error and pass it up
    console.error('Error deleting user:', error);
    throw error;  // Let calling code handle the error
  }
};

// Example function that safely deletes a user with confirmation
// userId = the ID of user to delete
const handleDeleteUser = (userId) => {
  // Show confirmation dialog - confirm() returns true if user clicks "OK"
  if (confirm('Are you sure you want to delete this user?')) {
    // Only delete if user confirmed
    deleteUser(userId)
      // .then() runs if delete succeeds
      .then(() => {
        // Show success message to user
        alert('User deleted!');
        // Call fetchUsers() function to refresh the user list
        // (fetchUsers would be defined elsewhere to reload all users)
        fetchUsers();
      })
      // .catch() runs if delete fails
      .catch(() => {
        // Show error message to user
        alert('Error deleting user');
      });
  }
  // If user clicked "Cancel", nothing happens
};
```

### 5. Get Single User
```javascript
// Function to get information about one specific user
// userId = the ID number of the user we want to get
const getUser = async (userId) => {
  try {
    // Send GET request for one specific user
    // api.get() calls backend/src/routes/users.js GET /:id endpoint
    // Template literal creates URL like "users/1" to get user with ID 1
    const response = await api.get(`/users/${userId}`);
    
    // Return the user data so other code can use it
    return response.data;
  } catch (error) {
    // If getting user fails, print error and pass it up
    console.error('Error fetching user:', error);
    throw error;  // Let calling code handle the error
  }
};

// Example of using getUser inside a React component
// This code would go inside a component function
useEffect(() => {
  // When component loads, get user with ID 1
  getUser(1)
    // .then() runs if we successfully got the user
    .then(user => {
      // user contains all the user data (name, email, id, etc.)
      // setSelectedUser() would update a state variable to store this user
      // (setSelectedUser would be defined earlier with useState)
      setSelectedUser(user);
    })
    // .catch() runs if user doesn't exist or there's an error
    .catch(error => {
      // Show message that user wasn't found
      console.log('User not found');
    });
}, []); // Empty array means this runs once when component loads
```

---

## 🧩 Creating New Components

### Step 1: Create Component File
Create new files in `src/components/` folder:

```javascript
// src/components/UserCard.jsx

// Import useState to track loading state
import { useState } from 'react';
// Import our database messenger from lib/api.js
import { api } from '../lib/api';

// Create a component that displays one user's information
// Props = data passed from parent component
// user = object containing user data (name, email, id, etc.)
// onUserDeleted = function to call when user is deleted (passed from parent)
function UserCard({ user, onUserDeleted }) {
  // Create loading state to track if we're currently deleting
  // Starts as false (not deleting)
  const [loading, setLoading] = useState(false);

  // Function that runs when user clicks delete button
  const handleDelete = async () => {
    // Show confirmation dialog with user's name
    // Template literal creates message like "Delete John Smith?"
    if (!confirm(`Delete ${user.name}?`)) return;
    
    // Set loading to true to show "Deleting..." on button
    setLoading(true);
    
    try {
      // Delete the user from database
      // user.id comes from the user object passed as prop
      // Template literal creates URL like "users/5"
      await api.delete(`/users/${user.id}`);
      
      // Call the onUserDeleted function passed from parent component
      // This tells the parent "hey, this user was deleted, update your list"
      // user.id is passed so parent knows which user to remove
      onUserDeleted(user.id);
    } catch (error) {
      // If delete fails, show error message
      alert('Error deleting user');
    } finally {
      // Set loading back to false whether success or error
      setLoading(false);
    }
  };

  // Return the HTML that shows this user's information
  return (
    <div className="user-card">
      {/* Show user's name - user.name comes from props */}
      <h3>{user.name}</h3>
      
      {/* Show user's email - user.email comes from props */}
      <p>{user.email}</p>
      
      {/* Show user's role, or "No role" if role is empty/null */}
      {/* user.role || 'No role' means: if user.role exists, show it, otherwise show 'No role' */}
      <p>Role: {user.role || 'No role'}</p>
      
      {/* Delete button */}
      <button 
        onClick={handleDelete}           // Call handleDelete when clicked
        disabled={loading}               // Disable button while deleting
      >
        {/* Show different text based on loading state */}
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

// Export the component so other files can import and use it
export default UserCard;
```

### Step 2: Use Component in App
```javascript
// src/App.jsx

// Import the UserCard component we just created
// The path '../components/UserCard' points to src/components/UserCard.jsx
import UserCard from './components/UserCard';

// Main App component
function App() {
  // Create state to store array of all users
  // This would be populated by fetching users (see earlier examples)
  const [users, setUsers] = useState([]);

  // Function that runs when a user is deleted
  // deletedUserId = the ID of the user that was just deleted
  const handleUserDeleted = (deletedUserId) => {
    // Remove the deleted user from our users array
    // .filter() creates a new array containing only users whose ID doesn't match deletedUserId
    // For example: if deletedUserId is 3, keep all users except the one with id 3
    setUsers(users.filter(user => user.id !== deletedUserId));
  };

  // Return the main app HTML
  return (
    <div>
      {/* Loop through each user in the users array */}
      {users.map(user => (
        // Create a UserCard component for each user
        <UserCard 
          key={user.id}                          // Unique key for React (user.id from database)
          user={user}                            // Pass the entire user object as prop
          onUserDeleted={handleUserDeleted}      // Pass our delete handler function as prop
        />
      ))}
    </div>
  );
}
```

---

## 🎨 Styling Components

### Using Tailwind CSS (Already Installed)
```javascript
// Example of a button with Tailwind CSS classes
function StyledButton() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {/* 
      Breaking down the className:
      - bg-blue-500: Background color blue, medium shade
      - hover:bg-blue-700: When mouse hovers, change to darker blue
      - text-white: Text color white
      - font-bold: Make text bold
      - py-2: Padding top and bottom (y-axis) = 8px
      - px-4: Padding left and right (x-axis) = 16px  
      - rounded: Round the corners slightly
      */}
      Click Me
    </button>
  );
}
```

### Common Tailwind Classes
```css
/* Layout */
flex flex-col items-center justify-center
grid grid-cols-2 gap-4
p-4 m-2 (padding, margin)

/* Colors */
bg-blue-500 text-white
bg-red-500 text-red-100
bg-gray-100 text-gray-800

/* Responsive */
sm:text-lg md:text-xl lg:text-2xl
```

---

## 🔄 Development Workflow

### 1. **Planning Phase**
- Decide what feature to build
- Look at the database structure (users table)
- Plan which components you need

### 2. **Development Cycle**
```
1. Create component file
2. Write basic structure
3. Add database calls using api.js
4. Test in browser (localhost:5173)
5. Style with Tailwind CSS
6. Test edge cases (errors, loading)
7. Commit your changes
```

### 3. **Testing Your Code**
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# View frontend
open http://localhost:5173

# Check browser console for errors
# Open Developer Tools (F12) → Console
```

---

## 🛠️ Common Development Tasks

### Adding a New Feature
1. **Create new component** in `src/components/`
2. **Import and use** in `src/App.jsx`
3. **Add database calls** using `api.get/post/put/delete`
4. **Style with Tailwind** CSS classes
5. **Test thoroughly**

### Working with Forms
```javascript
// Component that handles a form with multiple inputs
function MyForm() {
  // Create state to store all form data in one object
  // Starts with empty name and email
  const [data, setData] = useState({ name: '', email: '' });

  // Function that runs whenever user types in any input field
  // 'e' is the event object containing information about what happened
  const handleChange = (e) => {
    // Update the form data
    setData({
      ...data,                           // Keep existing data (spread operator)
      [e.target.name]: e.target.value   // Update the specific field that changed
      // e.target.name = the 'name' attribute of the input (like "name" or "email")
      // e.target.value = what the user typed
      // [e.target.name] uses bracket notation to set object property dynamically
    });
  };

  // Function that runs when user submits the form
  const handleSubmit = (e) => {
    // Prevent page from refreshing (default form behavior)
    e.preventDefault();
    
    // Send form data to database using our api
    // data object contains {name: "...", email: "..."}
    api.post('/users', data);
  };

  // Return the form HTML
  return (
    <form onSubmit={handleSubmit}>
      {/* Name input */}
      <input 
        name="name"                    // This name matches the key in our data object
        value={data.name}              // Show current value from state
        onChange={handleChange}        // Call handleChange when user types
      />
      
      {/* Email input */}
      <input 
        name="email"                   // This name matches the key in our data object  
        value={data.email}             // Show current value from state
        onChange={handleChange}        // Call handleChange when user types
      />
      
      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Error Handling
```javascript
// Create state to store any error messages
// Starts as null (no error)
const [error, setError] = useState(null);

// Example of making API call with error handling
try {
  // Try to get users from database
  const result = await api.get('/users');
  
  // If successful, update users state with the data
  setUsers(result.data);
  
  // Clear any previous errors since this call succeeded
  setError(null);
} catch (err) {
  // This runs if the API call failed
  // Set error message that we can show to user
  setError('Failed to load users');
  
  // Print detailed error to console for debugging
  console.error(err);
}

// In your component's return statement, show error to user:
return (
  <div>
    {/* Only show error message if error exists */}
    {/* error && means "if error is not null, then show the div" */}
    {error && <div className="error">{error}</div>}
    
    {/* Rest of your component... */}
  </div>
);
```

---

## 📚 Learning Path

### Week 1: Basics
- [ ] Understand the project structure
- [ ] Run the development setup
- [ ] Modify the existing App.jsx
- [ ] Create your first component

### Week 2: Database Integration
- [ ] Learn all API operations (GET, POST, PUT, DELETE)
- [ ] Create a user management system
- [ ] Add form validation
- [ ] Handle loading states and errors

### Week 3: Advanced Features
- [ ] Create multiple components
- [ ] Add user authentication (login/register)
- [ ] Build a dashboard
- [ ] Add responsive design

### Week 4: Polish
- [ ] Improve styling
- [ ] Add animations
- [ ] Test edge cases
- [ ] Deploy your features

---

## 🆘 Common Issues & Solutions

### "Cannot read properties of undefined"
```javascript
// ❌ WRONG - This might crash if users is undefined or null
// If users is undefined, calling .map() will cause an error
users.map(user => ...)

// ✅ CORRECT - Safe with fallback
// If users is null/undefined, use empty array [] instead
// This prevents crashes and shows nothing instead of breaking
(users || []).map(user => ...)

// ✅ ALSO CORRECT - Using optional chaining (newer JavaScript)
// users?.map means "if users exists, call map(), otherwise return undefined"
// || [] means "if the result is undefined, use empty array instead"
users?.map(user => ...) || []
```

### API Call Not Working
1. Check if backend is running: `curl http://localhost:3001/api/health`
2. Check browser console for errors
3. Verify the API endpoint in `api.js`
4. Check your `.env` file has correct backend URL

### Component Not Updating
```javascript
// ❌ WRONG - This doesn't trigger re-render
// Directly modifying the array doesn't tell React that something changed
// React won't know to update the screen
users.push(newUser);

// ✅ CORRECT - Creates new array, triggers re-render
// The spread operator (...) creates a brand new array
// React sees it's a different array and updates the screen
// ...users means "include all existing users"
// newUser is added at the end
setUsers([...users, newUser]);
```

---

## 🤝 Getting Help

1. **Console Logs** - Add `console.log()` to debug
2. **Browser DevTools** - Check Network tab for API calls
3. **Team Members** - Ask for help on Slack/Discord
4. **Documentation** - Check React and Tailwind docs

---

## 🎯 Your First Task

Try creating a simple component that:
1. Displays "Hello, [Your Name]!"
2. Shows the current time
3. Has a button that fetches and displays all users

```javascript
// src/components/MyFirstComponent.jsx

// Import React hooks we need
import { useState, useEffect } from 'react';
// Import our database connection helper
import { api } from '../lib/api';

// Create your first component
function MyFirstComponent() {
  // State to store the list of users from database
  // Starts as empty array
  const [users, setUsers] = useState([]);
  
  // State to store current time as a string
  // new Date().toLocaleTimeString() gets current time like "2:30:45 PM"
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // useEffect runs when component first loads
  useEffect(() => {
    // setInterval runs a function every 1000 milliseconds (1 second)
    const timer = setInterval(() => {
      // Update the time every second
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup function - runs when component is removed from page
    // clearInterval stops the timer to prevent memory leaks
    return () => clearInterval(timer);
  }, []); // Empty array = only run once when component loads

  // Function to get users from database
  const fetchUsers = async () => {
    try {
      // Make GET request to /users endpoint
      // This calls backend/src/routes/users.js GET /users
      const response = await api.get('/users');
      
      // Update users state with data from database
      // response.data contains the array of user objects
      setUsers(response.data);
    } catch (error) {
      // If something goes wrong, print error to console
      console.error('Error:', error);
    }
  };

  // Return the HTML that will be shown on screen
  return (
    // Main container with padding (p-4 = 16px padding all around)
    <div className="p-4">
      {/* Main heading - replace [Your Name] with your actual name */}
      {/* text-2xl = large text, font-bold = bold font */}
      <h1 className="text-2xl font-bold">Hello, [Your Name]!</h1>
      
      {/* Show current time - text-gray-600 = gray color */}
      {/* currentTime variable is updated every second by our timer */}
      <p className="text-gray-600">Current time: {currentTime}</p>
      
      {/* Button to fetch users */}
      <button 
        onClick={fetchUsers}                    // Call fetchUsers function when clicked
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        // mt-4 = margin top, bg-blue-500 = blue background
        // text-white = white text, px-4 py-2 = padding
        // rounded = rounded corners, hover:bg-blue-600 = darker blue on hover
      >
        Fetch Users
      </button>

      {/* Section to display users */}
      <div className="mt-4">
        {/* Heading showing number of users */}
        {/* users.length counts how many users are in the array */}
        <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        
        {/* Loop through each user and display them */}
        {users.map(user => (
          // Container for each user
          // key={user.id} helps React track each user (user.id from database)
          <div key={user.id} className="mt-2 p-2 bg-gray-100 rounded">
            {/* Show user name in bold, then email */}
            {/* user.name and user.email come from database columns */}
            <strong>{user.name}</strong> - {user.email}
          </div>
        ))}
      </div>
    </div>
  );
}

// Export component so other files can import it
export default MyFirstComponent;
```

**Good luck with your frontend development journey! 🚀**
