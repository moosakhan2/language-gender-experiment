# 🌐 Language Gender Experiment

A **browser-based linguistic experiment** built using **jsPsych** and **Firebase**.  
Participants are shown objects and asked to provide the name of each object in their language, followed by selecting its grammatical gender.  
Responses are securely stored in **Firebase Storage** for later analysis.

---

## Overview

This web app allows researchers to **collect and analyze** how people assign gender to nouns across different languages.

---

## Tech Stack

- **Frontend:** HTML, JavaScript (**jsPsych 8.0.0**)  
- **Backend:** Firebase Cloud Functions (**Node.js 22**)  
- **Storage:** Firebase Cloud Storage (**JSON response files**)  
- **Hosting:** Firebase Hosting  
- **Deployment:** Firebase CLI  

Each participant’s data (including language responses, gender selections, and Prolific IDs) is saved as a `.json` file in your Firebase bucket.

---

## How to Use

### ➕ Add More Languages

1. Open `public/languages.json`.
2. Add a new language following this structure:

   ```json
   {
     "English": ["Masculine", "Feminine", "Neuter"],
     "Spanish": ["Masculino", "Femenino"],
     "German": ["Maskulin", "Feminin", "Neutrum"],
     "French": ["Masculin", "Féminin"]
   }
   ```

3. Save the file — the new language will appear automatically in the dropdown.

---

### Add More Images

1. Add your new image files to `public/img/`.

   **Example:**
   ```
   apple.jpg  
   car.png  
   tree.webp
   ```

2. Run the following script in your terminal:
   ```bash
   node generateImageList.js
   ```

   This updates `public/images.json` automatically with all image names and paths.

3. Redeploy your app to make the new images appear in the experiment.

---

## Cloning Into Your Own Firebase Project

### 1. Clone the Repository

```bash
git clone https://github.com/moosakhan2/language-gender-experiment.git
cd language-gender-experiment
```

### 2. Install Dependencies

```bash
cd functions
npm install
cd ..
```

### 3. Initialize Firebase

```bash
firebase init
```

When prompted, choose:

- **Hosting**
- **Functions**

Use an existing project or create a new one.

### 4. Set Up Your Firebase Bucket

In `functions/index.js`, replace the storage bucket name with your own:

```js
initializeApp({
  storageBucket: "language-gender-experiment.firebasestorage.app",
});
```

You can find your bucket under **Build → Storage → Bucket URL** in the Firebase Console.

### 5. Deploy Your App

```bash
firebase deploy
```

Access your live URL:

```
https://your-project-name.web.app/language-gender.html
```

---

## 📊 Data Format & Research Ideas

Each participant’s data is saved under `responses/` in your Firebase Storage as a `.json` file:

```json
{
  "prolificPID": "abcd1234",
  "studyID": "study5678",
  "sessionID": "xyz987",
  "jspsychData": [
    {
      "stimulus": "img/apple.jpg",
      "user_input": "Apfel",
      "selected_gender": "Masculine",
      "rt": 2450,
      "trial_type": "image-button-response"
    }
  ]
}
```

---

## Ideas for Analysis

### Linguistic & NLP Research
- Predict grammatical gender from morphology or phonetic patterns  
- Compare gender assignment across languages

### Cognitive Modeling
- Study reaction times (`rt`) to measure decision speed in language processing

### Machine Learning Applications
- Train models on multilingual gender data to explore biases or grammar rules

---


✅ This project is designed for **open, reproducible linguistic research**.  
Fork, adapt, and deploy your own version easily!
