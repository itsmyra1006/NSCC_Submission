# 🚀 Event Gateway - QR Code Attendance System

A full-stack web application designed to streamline event registration and attendance tracking. This project replaces manual sign-in sheets with a modern, digital system using unique QR codes that are emailed to participants, providing real-time data for event organizers.

### Deployment links:
* **Registration page:** `https://event-gateway-app.onrender.com` 
* **Scanner page:** `https://event-gateway-app.onrender.com/scanner.html` 
* **Admin Dashboard:** `https://event-gateway-app.onrender.com/admin.html` 

---

### Demo Screenshot

![event-gateway-app-demo - Made with Clipchamp (1)](https://github.com/user-attachments/assets/a272b90a-fe5d-458f-b89c-347493ac4ea8)
<img width="1919" height="962" alt="Screenshot 2025-09-14 193908" src="https://github.com/user-attachments/assets/ade22e77-8ab8-4994-bc7d-940c8ed6fcd6" />
<img width="1918" height="955" alt="Screenshot 2025-09-14 193849" src="https://github.com/user-attachments/assets/c02cc45a-1ce2-419e-8d0b-120503d0b4f7" />

## ✨ Features

* **Seamless User Registration:** A clean, user-friendly form for event registration.
* **Unique QR Code Generation:** Each participant receives a unique QR code.
* **Email Integration:** QR codes are automatically emailed to participants, ensuring they have a copy.
* **Duplicate Registration Handling:** Re-registering with the same email/ID re-sends the original QR code instead of creating a duplicate entry.
* **Web-Based QR Scanner:** A mobile-friendly scanner page for organizers to mark attendance in real-time.
* **Live Admin Dashboard:** A dashboard that auto-refreshes every 5 seconds to show live attendance statistics.
* **Export to Excel:** Admins can download the complete attendance list as an `.xlsx` file with one click.
* **Secure Database Clearing:** A hidden button on the admin dashboard, accessible only with a secret key, allows for wiping all entries before a new event.
* **Light/Dark Mode:** A persistent theme toggle (☀️/🌙) for user preference across all pages.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (with CSS Variables), Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Production on Render)
* **Key Libraries:**
    * `nodemailer` for sending emails.
    * `qrcode` for generating QR code images.
    * `pg` for the PostgreSQL database connection.
    * `html5-qrcode` (frontend) for the scanner UI.
    * `xlsx` (frontend) for the Excel export functionality.
* **Deployment:** Deployed as a Web Service on **Render** connected to a free-tier Render PostgreSQL database.

---

## 🚀 Usage

* **Registration Page:** The main registration form is at the root URL (`/`).
* **Scanner Page:** Organizers can access the scanner at `/scanner.html`.
* **Admin Dashboard:** The attendance dashboard is at `/admin.html`.
* **Clear Database:** To reveal the "Clear All Entries" button, an admin must visit the dashboard with the secret key as a query parameter: `/admin.html?key=your_secret_key_here`.

---

## ⚙️ Setup for Local Development

To run this project on your own machine for further development:

1.  **Clone the repository** and navigate to the project folder.
    ```bash
    git clone [https://github.com/itsmyra1006/NSCC_Submission.git](https://github.com/itsmyra1006/NSCC_Submission.git)
    cd NSCC-Submission/Event-Gateway
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    * Create a file named `.env` in the `Event-Gateway` root directory.
    * This file stores the secret credentials needed to run the application. Add the following, replacing the placeholder values:
        ```
        # Connect to your cloud DB for local development
        DATABASE_URL=your_external_database_url_from_render

        # Your Gmail credentials
        EMAIL_USER=your-email@gmail.com
        EMAIL_PASS=your-16-digit-gmail-app-password

        # Secret key to reveal the 'Clear Database' button
        ADMIN_SECRET_KEY=choose_a_very_secret_password
        ```
    * You can get the `DATABASE_URL` from your PostgreSQL instance on Render under the **"Connect"** tab (use the **"External Database URL"**).

4.  **Add Development Script:**
    * For a better development experience with auto-restarting, add a `"dev"` script to your `package.json`:
        ```json
        "scripts": {
          "start": "node index.js",
          "dev": "nodemon index.js"
        },
        ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3001`.
