# LinkedOut - AI-Powered LinkedIn Inbox

LinkedOut was built to help manage hectic LinkedIn inboxes. 

is a modern web application that helps you manage and respond to LinkedIn messages efficiently using AI. Built with Next.js, TypeScript, and Tailwind CSS.

<div align="center">
  <img src="assets/linkedout-hero-optimized.png" alt="LinkedOut Preview" width="100%" />
</div>

## Features

- 🤖 AI-powered message drafts
- 📱 Responsive design for mobile and desktop
- 🔄 Real-time message updates with optimistic UI
- 🎨 Beautiful UI with dark mode support
- ⚡️ Instant message previews
- 🔒 Secure authentication

## Known Outscope
- Logic breaks if you send the first message (no sendee data set in DB)
- Emoji reactions will not show
- Group threads do not show (only Classic LinkedIN inbox, no Sales navigator either). Should be easy to tweak.
- Draft reply only takes previous message (and name) as context. 
- Text Snippets can be Created/ Updated / Deleted via PocketBase, not yet in-app. 

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
   NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_url
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
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | N8N URL (without /webhook) | Yes |
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase URL | Yes |


---

<div align="center">
  Made with ❤️ by <a href="https://github.com/maxtkacz">Max </a>and <a href="https://github.com/oumnya">Oumnya</a>  
</div>
