# LinkedOut - AI-Powered LinkedIn Message Manager

LinkedOut is a modern web application that helps you manage and respond to LinkedIn messages efficiently using AI. Built with Next.js, TypeScript, and Tailwind CSS.

<div align="center">
![  ](docs/assets/preview.png)</div>

## Features

- 🤖 AI-powered message drafts
- 📱 Responsive design for mobile and desktop
- 🔄 Real-time message updates with optimistic UI
- 🎨 Beautiful UI with dark mode support
- ⚡️ Instant message previews
- 🔒 Secure authentication

## Tech Stack

### Frontend
- **Framework:** Next.js  (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Custom auth with JWT

### Backend
- **Database & Auth:** PocketBase
- **Automation:** N8N for workflow automation
- **API:** RESTful N8N endpoints

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PocketBase instance
- N8N instance for automation workflows

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maxt-n8n/linkedout
   cd linkedout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_POCKETBASE_URL=your_pocketbase_url
   NEXT_PUBLIC_API_BASE_URL=your_n8n_url/webhook
   ```

4. **Backend Setup:**
   - Set up a PocketBase instance
   - Configure N8N workflows for message automation
   - Ensure both services are accessible to your frontend

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Backend Setup

### PocketBase
1. One click deploy PocketBase [PocketBase](https://app.cloud-station.io/template-store/pocketbase)
2. Import the schema from [docs/schemas/pocketbase-schema.json](docs/schemas/pocketbase-schema.json)

### N8N
1. Install N8N following instructions at [n8n.io](https://n8n.io)
2. Import the provided workflow templates
3. Configure the LinkedIn and PocketBase integrations

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | N8N URL | Yes |
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase URL | Yes |

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/maxtkacz">Max </a>and <a href="https://github.com/oumnya">Oumnya</a>  
</div>
