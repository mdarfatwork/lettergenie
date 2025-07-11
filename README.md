# 📄 LetterGenie

**LetterGenie** is a modern web application that helps users generate tailored cover letters using AI. Whether you're applying for your first job or pivoting careers, LetterGenie creates personalized, concise, and professional letters based on your input and profile.

Built using Next.js 15 and powered by Google Gemini, it simplifies the cover letter process while maintaining flexibility and customization.

---

## ✨ Features

- 🧠 **AI-Powered Generation** using Google Gemini API
- 🔐 **Secure Authentication** with Clerk
- 📁 **Save, View, Download, and Delete** cover letters
- ✍️ **Custom Instructions** to fine-tune tone or focus
- 📄 **User Profile Management**
- 📜 **Legal Pages**: Privacy Policy, Terms of Service, and Contact
- 🌈 **Modern UI** using Tailwind CSS + shadcn

---

## 🧪 Test Credentials

To explore the app without signing up, use the following dummy account:

- **Email**: `jane+clerk_test@gmail.com`
- **Password**: `Test@424242`

> ✅ This account works in test mode with Clerk. Useful for demos and development.

---

## 🧱 Tech Stack

| Category       | Technology                    |
|----------------|-------------------------------|
| Framework      | Next.js 15 (App Router)       |
| Language       | TypeScript                    |
| Styling        | Tailwind CSS, shadcn/ui       |
| Forms          | React Hook Form + Zod         |
| Auth           | Clerk                         |
| Database       | PostgreSQL (via Neon)         |
| ORM            | Prisma                        |
| AI Integration | Google Gemini API             |
| Actions        | next-safe-action              |
| Notifications  | Sonner                        |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mdarfatwork/lettergenie.git
cd lettergenie
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and same as `.env.example`

Replace the placeholders with real values from Clerk, Neon, and Google AI Studio etc.

### 4. Run Local Dev Server

```bash
npm dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Routes Overview

### Public Routes (available to everyone)
- `/contact` - Contact page
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy

### Non-Authenticated Routes (only for non-logged-in users)
- `/` - Home page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Authenticated Routes (login required)
- `/cover` - Cover letter generator
- `/profile` - User profile management

> These are protected using Clerk middleware in `middleware.ts`.

---

## 🚀 Deployment

### Recommended: Vercel

1. Push the project to GitHub
2. Import into Vercel
3. Set environment variables in the dashboard
4. Deploy!

### Also works with:
- Railway
- Netlify (with Next.js adapter)
- Render (using custom serverless config)

---

## 🙋 FAQ

### 🔐 Why Clerk?
Clerk provides easy and secure auth with email/password, social logins, and user management—perfect for modern apps with minimal setup.

### 🧠 Why Google Gemini?
Google Gemini (via GenAI SDK) offers fast and high-quality text generation, suitable for professional writing use cases like cover letters.

---

## 📄 License

MIT License

You are free to use, modify, and distribute this project for personal or commercial purposes.

---

## 📬 Contact

For suggestions or issues, please reach out via the Contact Page or create an issue on GitHub.

---

## 👨‍💻 Made by

**Mohammed Arfat** – Full Stack Developer

[LinkedIn](https://linkedin.com/in/momin-mohammed-arfat) • [Github](https://github.com/mdarfatwork)

---

<div align="center">
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
