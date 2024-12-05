**Project Goal:**
Develop a responsive, user-friendly app to track employee moods, with data stored in LocalStorage and designed for future integration with Firestore.

**Key Features:**
1. **User Interaction:**
   - Employees can select an emoji to express their current mood, limited to once per hour.
   - After emoji selection, display a confirmation message with animation.
   - Prompt users with optional questions about their tasks and daily experiences.

2. **Data Management:**
   - Store mood data and user responses in LocalStorage, structured for easy transition to Firestore.
   - Ensure data is organized for generating charts, summaries, and analyses.

3. **User Interface:**
   - Create a dashboard for each user at `/in/u/[uid]` to track their mood data.
   - Develop a company dashboard at `/in/c/[cid]` for owners to manage employees and view mood statistics.
   - Implement an admin area at `/in/a` for adding companies and managing moods.

4. **Additional Features:**
   - Allow company owners to add employees, departments, and tasks.
   - Ensure the app is PWA-enabled with a network-first caching strategy.
   - Implement push notifications for app updates.

**Design and Development Guidelines:**
- Follow Atomic Design principles for component structure.
- Use CSS-based styling with scoped component styles.
- Ensure accessibility and responsive design across all devices.
- Minimize external dependencies, using vanilla JavaScript and built-in browser APIs.

**Technical Requirements:**
- Implement error boundaries, loading states, and form validation.
- Optimize for SEO and performance.
- Use code splitting and proper event handling.

**Data Structure:**
1. User Data:
   - User ID
   - Name
   - Current Company ID
   - Current Department ID
   - Mood History

2. Company Data:
   - Company ID
   - Name
   - Departments List
   - Employee List
   - Tasks List

3. Mood Entry:
   - Timestamp
   - Selected Emoji
   - Current Task
   - Day's Highlights
   - Day's Challenges
   - Department ID
   - User ID

**Outcome:**
A fully functional, responsive PWA that enhances employee engagement and provides valuable insights into workplace satisfaction.

**Project Architecture:**
1. **File Structure:**
   - Routes in src/routes
   - Components in src/lib/components/{atomic-level}
   - Utilities in src/lib/utils
   - Stores in src/lib/stores
   - Database operations in src/lib/db
   - Static assets in src/static

2. **Component Standards:**
   - Implement single responsibility principle
   - Include proper props validation
   - Add ARIA labels and semantic HTML
   - Include loading states
   - Implement error boundaries
   - Add form validation where needed

3. **Styling Guidelines:**
   - Use CSS variables from src/app.css
   - Implement scoped styles for components
   - Follow established color system and typography variables
   - Ensure responsive design
   - Follow accessibility guidelines

4. **PWA Requirements:**
   - Network-first caching strategy
   - Offline support capabilities
   - Push notification implementation
   - Service worker configuration
   - App manifest setup

5. **Performance Optimization:**
   - Code splitting strategy
   - Asset optimization
   - State management patterns
   - Loading state handling
   - Error boundary implementation

**Development Workflow:**
1. Component Development:
   - Write meaningful comments
   - Implement error handling
   - Add loading states
   - Include usage examples
   - Document dependencies
   - Test accessibility compliance

2. Quality Assurance:
   - Cross-browser testing
   - Responsive design verification
   - Accessibility testing
   - Performance benchmarking
   - PWA functionality validation

**Image:**
1. Inspiration image
    - Use the attached image as inspiration for the design of the app.