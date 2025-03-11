Task Manager
Task Manager is a modern, responsive web application built with Next.js, designed to help users manage tasks efficiently. It features task creation, reminders with audio notifications, weather integration for outdoor tasks, and a customizable user interface with light/dark mode support. The app leverages TypeScript for type safety, Redux for state management, and a robust ESLint configuration for code quality.

Features
Task Management:
Add, delete, and mark tasks as complete.
Filter tasks by categories like "Today," "Upcoming," and "Important."
Search tasks by title, location, or reminder time.
Reminders:
Set reminders with audio alerts and browser notifications.
Automatically dismiss reminders when tasks are completed or expired.
Weather Integration:
Display real-time weather for outdoor tasks based on location (fetched from a weather API).
Visual weather icons for quick reference (e.g., ☀️ for clear, 🌧️ for rain).
User Interface:
Responsive design with a collapsible sidebar for mobile and desktop.
Light and dark mode toggle using next-themes.
Progress tracking with a circular completion chart.
User Experience:
Avatar generation using DiceBear Avatars for personalized user profiles.
Smooth transitions and hover effects with Tailwind CSS.
Development Tools:
TypeScript for static typing and improved developer experience.
ESLint with Next.js and TypeScript rules for code consistency.
Prettier integration for automatic code formatting.
Technologies Used
Framework: Next.js (React framework with App Router)
Language: TypeScript
State Management: Redux with Redux Toolkit
Styling: Tailwind CSS
Theming: next-themes
UI Components: Shadcn/ui (assumed based on component naming like Avatar, Button)
Icons: Lucide React
Avatar Generation: DiceBear Avatars
Linting: ESLint with eslint-plugin-next, @typescript-eslint, and eslint-config-prettier
Build Tool: Node.js with npm
Miscellaneous:
Web APIs for browser notifications and audio playback.
Weather data integration (assumed via an external API, e.g., OpenWeatherMap).
Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v18.x or later recommended)
npm (v9.x or later, comes with Node.js)
A code editor like VS Code
(Optional) Git for cloning the repository
Setup Project Environment
Follow these steps to set up and run the project locally:

1. Clone the Repository
bash

Collapse

Wrap

Copy
git clone https://github.com/your-username/task-manager.git
cd task-manager
Replace https://github.com/your-username/task-manager.git with your actual repository URL.

2. Install Dependencies
Install the required npm packages:

bash

Collapse

Wrap

Copy
npm install
This will install Next.js, Redux, Tailwind CSS, and other dependencies listed in package.json.

3. Configure Environment Variables
Create a .env.local file in the root directory to store environment variables. For example:

text

Collapse

Wrap

Copy
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WEATHER_API_KEY: Required for weather data (get one from OpenWeatherMap).
NEXT_PUBLIC_BASE_URL: Base URL for the app (optional, adjust for production).
4. Run the Development Server
Start the Next.js development server:

bash

Collapse

Wrap

Copy
npm run dev
Open your browser and navigate to http://localhost:3000 to see the app in action.

5. Build for Production
To create an optimized production build:

bash

Collapse

Wrap

Copy
npm run build
Then start the production server:

bash

Collapse

Wrap

Copy
npm start
6. Lint and Format Code (Optional)
Run ESLint to check for linting issues:
bash

Collapse

Wrap

Copy
npm run lint
Fix linting issues automatically (if configured):
bash

Collapse

Wrap

Copy
npm run lint -- --fix
Ensure Prettier is set up (if not, install it with npm install --save-dev prettier and configure it).
7. Additional Setup Notes
Audio Files: Ensure the /public/sounds/alert.mp3 file exists for reminders. Add it to the public/sounds directory if missing.
Redux Store: Verify that src/redux/store.ts and related action files (src/redux/actions.ts) are correctly set up.
Type Definitions: Check src/types/task.ts for the Task interface used in TaskList.tsx.
Project Structure
text

Collapse

Wrap

Copy
task-manager/
├── public/              # Static assets (e.g., alert.mp3)
├── src/
│   ├── app/            # Next.js App Router pages (e.g., page.tsx)
│   ├── components/     # Reusable components (e.g., TaskList.tsx, TaskInput.tsx)
│   ├── lib/            # Utility functions (e.g., cn.ts for Tailwind)
│   ├── redux/          # Redux store, actions, and reducers
│   ├── types/          # TypeScript type definitions (e.g., task.ts)
│   └── styles/         # Global styles (if any)
├── eslint.config.mjs    # ESLint configuration
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
Usage
Add a Task: Click "Add Task" to create a new task with optional reminder and location.
Set Reminders: Specify a date/time for reminders; you’ll hear an audio alert and see a notification when due.
View Weather: For outdoor tasks, enter a location to see current weather conditions.
Toggle Theme: Switch between light and dark modes using the theme button (☀️/🌙).
Filter Tasks: Use the sidebar to filter tasks by category or search via the top bar.
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.
License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.

Notes
Customization: Replace placeholders like your-username, your-email@example.com, and the repository URL with your actual details.
Weather API: If you’re not using OpenWeatherMap, update the NEXT_PUBLIC_WEATHER_API_KEY description with your chosen API.
Missing Files: If your project has additional files (e.g., next.config.js, tailwind.config.js), mention them in the setup or structure sections.
Enhancements: Add screenshots or a demo link if available to make the README more engaging.