# 💬 FRANKLY

**FRANKLY** is a modern anonymous feedback platform that allows users to receive honest, anonymous messages through a unique and shareable profile link.

Create your account, share your personal link, and let anyone send you anonymous feedback — no login required for senders.

Built with **Next.js, TypeScript, MongoDB, NextAuth.js, Tailwind CSS, and AI-powered message suggestions**.

🔗 **Live Demo:** [getfrankly.vercel.app](https://getfrankly.vercel.app)

---


## ✨ Features

- 🔐 **Secure Authentication** — Sign up, verify your account, and log in securely.
- 🔗 **Unique Public Profile Link** — Every user gets a personal shareable URL:

  ```text
  /u/username
  ```

- 🕵️ **Anonymous Messaging** — Anyone can send anonymous messages without creating an account.
- 📥 **Personal Dashboard** — View and manage all received messages from one place.
- 🗑️ **Delete Messages** — Remove unwanted messages directly from your dashboard.
- 🔔 **Message Preferences** — Toggle whether you want to accept or stop receiving new messages.
- ✅ **Username Availability Check** — Checks whether a username is already taken before registration.
- 📧 **Email Verification** — Verify user accounts through email-based OTP verification.
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile devices.
- 🌙 **Dark Mode Support** — Seamless light and dark theme experience.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **Next.js** | Full-stack React framework using the App Router |
| **TypeScript** | Type-safe JavaScript development |
| **MongoDB** | NoSQL database for users and messages |
| **Mongoose** | MongoDB object modeling and schema management |
| **NextAuth.js** | Authentication and session management |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Reusable and accessible UI components |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation and type-safe form validation |

---

## 🚀 How It Works

1. **Create an account** and choose a unique username.
2. **Verify your email** using the verification code sent to your inbox.
3. Get your unique public profile URL:

   ```text
   /u/your-username
   ```

4. **Share your profile link** with friends or on social media.
5. Anyone with the link can send you an **anonymous message without logging in**.
6. View and manage all received messages from your personal dashboard.
7. Enable or disable incoming messages whenever you want.

---

## 📂 Project Structure

```text
📦 frankly
├── 📁 components/
├── 📁 emails/
├── 📁 lib/
├── 📁 public/
└── 📁 src/
    ├── 📁 app/
    ├── 📁 context/
    ├── 📁 helpers/
    ├── 📁 lib/
    ├── 📁 model/
    ├── 📁 schemas/
    └── 📁 types/
```

### Folder Overview

| Folder | Description |
| --- | --- |
| `components/` | Reusable UI components used throughout the application |
| `emails/` | Email templates for account verification and other transactional emails |
| `lib/` | Root-level utility and configuration files |
| `public/` | Static assets such as images, icons, and SVG files |
| `src/app/` | Next.js App Router pages, layouts, and API routes |
| `src/context/` | React context providers for global application state |
| `src/helpers/` | Helper functions such as email sending utilities |
| `src/lib/` | Database connections and application-specific utilities |
| `src/model/` | Mongoose models and database schemas |
| `src/schemas/` | Zod validation schemas |
| `src/types/` | Shared TypeScript interfaces and type definitions |

---

## ⚙️ Getting Started

Follow these steps to run **FRANKLY** locally.

### Prerequisites

Make sure you have the following installed:

- **Node.js 18+**
- **npm**, **pnpm**, or **yarn**
- A **MongoDB database**
- Required API keys for email verification and AI-powered suggestions

### 1. Clone the Repository

```bash
git clone https://github.com/himanshuverse/frankly.git
cd frankly
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

Depending on your email provider, you may also need additional environment variables for sending verification emails.

> **Important:** Never commit your `.env` or `.env.local` file to GitHub. Make sure it is included in your `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

Open the application in your browser at:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB database connection string | Yes |
| `NEXTAUTH_SECRET` | Secret used for authentication and JWT signing | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |

Add any additional email-service credentials required by your implementation.

---

## 📜 Available Scripts

```bash
# Start the development server
npm run dev

# Create a production build
npm run build

# Start the production server
npm start

# Run ESLint
npm run lint
```

---

## 🛡️ Security & Privacy

FRANKLY is designed around anonymous communication while maintaining secure user authentication.

- Senders do not need to create an account to submit anonymous messages.
- Passwords should be securely hashed before being stored in the database.
- Authentication sessions are managed securely through NextAuth.js.
- User inputs are validated using Zod.
- Sensitive credentials are stored in environment variables and should never be committed to version control.

> **Note:** Anonymous messaging platforms can be misused. Production deployments should consider implementing rate limiting, content moderation, spam prevention, and abuse-reporting mechanisms.

---

## 🗺️ Future Improvements

Potential features planned for future versions:

- [ ] Rate limiting and spam protection
- [ ] Report abusive messages
- [ ] Block specific users or IP addresses
- [ ] AI-powered content moderation
- [ ] Message reactions
- [ ] Custom profile pages
- [ ] Analytics for profile views and messages
- [ ] Social sharing integration
- [ ] Progressive Web App support

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "feat: add your feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

---

## 👨‍💻 Author

**Himanshu Mittal**

- GitHub: [@himanshuverse](https://github.com/himanshuverse)
- Live Project: [getfrankly.vercel.app](https://getfrankly.vercel.app)

---

## ⭐ Support

If you find **FRANKLY** useful or interesting, consider giving the repository a ⭐ on GitHub. It helps support the project and motivates further development.

---

<p align="center">
  Built with ❤️ using Next.js, TypeScript, and MongoDB.
</p>
