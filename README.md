# IPO Engine / Instant Campaign HQ - Week 1 MVP

This is the Week 1 MVP for the "Instant Campaign HQ" platform. It allows users to build a political campaign website in under 5 minutes using a mobile-first wizard.

## Prerequisites

- Python 3.10+
- Node.js 18+

## Setup & Run

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Install dependencies
pip install django djangorestframework django-cors-headers pillow

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Start Server
python manage.py runserver
```
Backend runs at http://localhost:8000

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

## Testing the Flow (Week 1 Scope)

1. **Start Wizard**: Go to http://localhost:5173/start
2. **Step 1 (Identity)**: Enter Name, Email, Phone. Click "Send OTP". Check Console for code (Stub). Enter code to Verify.
3. **Step 2 (Pillars)**: Select 3 pillars or type custom ones.
4. **Step 3 (Visuals)**: Select Template. Pick Colors. **Upload Headshot** (required).
5. **Step 4 (Details)**: Enter Bio, Donation URL.
6. **Step 5 (Submit)**: Click "Launch My HQ".
7. **Success**: You will be redirected to the Success Page.
8. **Mirror Site**: Click "View My Site". You should see the generated campaign page at `/temp/{slug}` with your data and colors.

## Notes

- **Slug Logic**: Duplicate names (e.g. John Smith) will auto-increment (`john-smith-1`).
- **Image Compression**: Images are compressed client-side to <0.5MB before upload.
- **OTP**: Currently a console-log stub.
- **GHL Integration**: Not included in Week 1.
