User Manual and Feature Guide ⏺ G208 - DevAsk
Sarah Abeywardena, Arjun Avinash, Maxwell Cossill, Rohan Thomas

Building DevStack:
To clone the repository, run the following command in the terminal:
git clone https://github.com/neu-cs4530/fall24-team-project-group-208.git

Open the folder in the terminal, cd into the client folder, and run: npm install

Repeat the same in the server folder

Create a .env file in the client folder and paste the following:

REACT_APP_SERVER_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=AIzaSyBvsGnFSTJRazCva9RgboIOIzwZmMAl2tI
REACT_APP_FIREBASE_AUTH_DOMAIN=fall24-swe-208.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=fall24-swe-208
REACT_APP_FIREBASE_STORAGE_BUCKET=fall24-swe-208.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=467463805200
REACT_APP_FIREBASE_APP_ID=1:467463805200:web:641f480533a943b69ded95

Create a .env file in the server folder and paste in the following:

MONGODB_URI=<your MongoDB Atlas connection string>
CLIENT_URL=http://localhost:3000
PORT=8000
AUTH_KEY=./<AUTH_KEY_PATH>

In each folder, run: npm run start (server first, then client)
Deployed render build can be found here: https://cs4530-f24-208.onrender.com/
To View MongoDB Database:
Make sure you have the MongoDB application installed on your machine.
Click add a new connection
Paste the MONGODB_URI found in your server/.env
You should now be able to connect and view the entries in the database.

User Story Guide:
User Story 1: Login and Karma System
User story one can be exercised initially by logging in (first-time users create an account at the account creation screen they are greeted with)
Account creation involves setting an email, username, and password
The karma system is integrated into the actions a user can take on the site: posting, answering, upvoting/downvoting, etc. all contribute towards a user's karma. Current karma, level, and remaining needed to level up can be viewed in the user profile page accessed from the side bar, another part of user story 1 which gives users a unique page to view progress, depending on the logged-in user and updated in real-time.
To test, try looking at your profile and noting your current karma, then upvote an existing question or post a new one. Going back to your profile should show a change in karma and highlight how users level up.
account creation and profile screen


User Story 2: Quizzes
User story two can be exercised in multiple ways:
To simply try the quiz system, you can try an existing quiz which you can access from the Quizzes button on the sidebar
This will take you to a list of existing quizzes to try, and from there you can select the answer you want to try and see your result after submitting
\*this is where you will notice the partially complete implementation of COS 2.3, you can submit an answer and on the back-end it will correctly verify its correctness, but the front-end defaults to a wrong answer submission.
To test the question-to-quiz functionality, will require a couple more steps since the site isn't actually an active site:
For questions posted to the site, if there are 3 or more answers, the author of that question, when viewing it, will see a new button called Make Quiz. To replicate this, post a question, and then post 3 answers to the new question.
Once the third is posted, the button will appear. Click the button to be given the option to set the correct answer and submit.
You will notice a new tag added to the question, and if you navigate to the quizzes tab on the side, a new entry will be listed: the nelly generated quiz based on the new question. From there, you can take the quiz as described above.
Making a Quiz and Setting Answer
Quiz Page


User Story 3: UI Updates
The third user story will be naturally exercised as you interact with the site. The UI has been completely overhauled, so the navigation, aesthetics, forms to submit, and so on have all been updated to reflect Material UI guidelines.
Navigation should be fluid and responsive between different pages as you traverse the site
The color scheme has been updated
Interactive elements like forms and buttons are clear and easily accessible
The site can be set to dark mode by clicking sun icon next to the logout button
