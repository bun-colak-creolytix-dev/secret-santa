# Secret Santa 🎅

A modern, full-stack web application for organizing Secret Santa gift exchanges. Create rooms, invite friends, and let the app handle random name assignments with automatic email notifications.

## ✨ Features

- **🎁 Easy Room Creation** - Create a Secret Santa room in seconds with just a name and email
- **👥 Participant Management** - Invite friends via shareable links (no login required for participants)
- **🎲 Random Name Drawing** - Secure Fisher-Yates shuffle algorithm ensures fair random assignments
- **📧 Email Notifications** - Automatic email delivery when names are drawn, including gift preferences
- **🔐 Admin Access** - Secure admin view with unique admin keys for room organizers
- **💾 Local Storage** - Tracks your participation across rooms using browser storage
- **🎨 Modern UI** - Beautiful, responsive interface built with shadcn/ui and Tailwind CSS
- **🌓 Dark Mode** - Built-in theme support with light/dark mode toggle

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Full-stack)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Database**: [Turso](https://turso.tech/) (SQLite) with [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Email**: [Resend](https://resend.com/)
- **Form Handling**: [TanStack Form](https://tanstack.com/form)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Code Quality**: [Biome](https://biomejs.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A [Turso](https://turso.tech/) database account
- A [Resend](https://resend.com/) API key for email functionality

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secret-santa
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Database (Turso)
DATABASE_URL=libsql://your-turso-database-url

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Optional: App Title
VITE_APP_TITLE=Secret Santa
```

4. Run database migrations:
```bash
bun run db:push
```

5. Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build for production
- `bun run serve` - Preview production build
- `bun run test` - Run tests
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run check` - Run all Biome checks (format + lint)
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:pull` - Pull schema from database
- `bun run db:studio` - Open Drizzle Studio

## 📁 Project Structure

```
secret-santa/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Feature components
│   ├── db/                 # Database configuration
│   │   ├── index.ts        # Database connection
│   │   └── schema.ts       # Drizzle schema definitions
│   ├── functions/          # Server functions (API routes)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   ├── lib/                # Utility functions and constants
│   ├── routes/             # TanStack Router routes
│   └── types/              # TypeScript type definitions
├── drizzle/                # Database migrations
├── public/                 # Static assets
└── package.json
```

## 🎯 How It Works

1. **Create a Room**: An organizer creates a Secret Santa room with a name and their contact information
2. **Share the Link**: The organizer shares the participant link with friends
3. **Join the Room**: Participants join by entering their name and email (no account required)
4. **Draw Names**: Once everyone has joined (minimum 3 participants), the organizer can draw names
5. **Automatic Assignment**: The app randomly assigns each participant to another using a circular assignment algorithm
6. **Email Notifications**: Each participant receives an email with their Secret Santa assignment and any gift preferences

## 🔒 Security Features

- **Admin Keys**: Each room has a unique admin key for organizer access
- **Input Validation**: All user inputs are validated using Zod schemas
- **Email Verification**: Prevents duplicate email addresses in the same room

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add new components:

```bash
pnpx shadcn@latest add <component-name>
```

## 📝 Database Schema

### Rooms
- `id` - Unique room identifier
- `name` - Room name
- `organizerName` - Organizer's name
- `organizerEmail` - Organizer's email
- `adminKey` - Secret key for admin access
- `isDrawn` - Whether names have been drawn
- `createdAt` - Creation timestamp

### Participants
- `id` - Unique participant identifier
- `roomId` - Reference to the room
- `name` - Participant's name
- `email` - Participant's email
- `note` - Optional gift preferences/notes
- `assignedToId` - Reference to assigned recipient (after drawing)
- `createdAt` - Join timestamp

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.
