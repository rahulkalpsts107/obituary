# Obituary Website

A responsive Node.js website for memorial services with multilingual support.

## Features

- Obituary display with biography, family details, and tribute
- Funeral details with Google Maps integration and live streaming
- Photo gallery with Cloudinary integration and lazy loading
- Condolence message system with email notifications
- Multilingual support (English/Malayalam)
- Mobile-responsive design

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file with the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017/obituary
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3000
```

### 3. Database Setup
- Install and start MongoDB
- The application will create the database automatically

### 4. Gmail Setup
- Enable 2-factor authentication on your Gmail account
- Generate an App Password for the application
- Use the App Password in the `GMAIL_APP_PASSWORD` environment variable

### 5. Cloudinary Setup
- Create a free Cloudinary account
- Get your cloud name, API key, and API secret from the dashboard

### 6. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 7. Access the Website
Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
obituary/
├── models/          # MongoDB schemas
├── routes/          # Express routes
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── utils/           # Utility functions
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Usage

1. Add obituary data through MongoDB
2. Configure funeral details and photo URLs
3. The website automatically displays the active obituary
4. Users can submit condolence messages
5. Admin receives email notifications for new messages
