# LinkedOut - AI-Powered LinkedIn Inbox 
<div align="center">
  <img src="assets/linkedout-hero-optimizied.png" alt="LinkedOut Preview" width="100%" />
</div>

LinkedOut was built to help manage hectic LinkedIn inboxes on mobile and desktop. It includes AI draft replies and static text snippets library, making it a nimble assistant without being ChatGPT. Front-end built with Next.js, TypeScript, and Tailwind CSS. Backend runs on n8n and PocketBase. Clone it, tweak it, make it yours.


## Features

- AI-powered message drafts
- Responsive design for mobile and desktop
- Beautiful UI with dark mode support
- Secure authentication
- Setup wizard to deploy backend and set up database
- Open source: Self-host it, fork it.

## Known Outscope
- Logic breaks if you send the first message (no sendee data set in DB)
- Emoji reactions will not show
- Group threads do not show (only Classic LinkedIN inbox, no Sales navigator either). Should be easy to tweak.
- Draft reply only takes previous message (and name) as context. 
- Text Snippets can be Created/ Updated / Deleted via PocketBase, not yet in-app. 

## Tech Stack
<div align="center">
  <img src="assets/linkedout-arch-optimized.png" alt="LinkedOut Preview" width="100%" />
</div>

### Frontend
- **Framework:** Next.js  (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Custom auth with JWT

### Backend
- **Database & Auth:** PocketBase
- **Workflows as Backend:** n8n via webhook endpoints, and n8n api for /setup
- **LinkedIn API Access:** Unipile

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PocketBase instance
- n8n instance for automation workflows. Get 50% off [n8n cloud](https://app.n8n.cloud/register?utm_campaign=linkedout) for 12 months with MAX50. Enter coupon after free trial when choosing a plan.
- A [Unipile account for](https://www.unipile.com/linkedin-api-a-comprehensive-guide-to-integration/?utm_source=youtube&utm_campaign=MAXFROMN8N) LinkedIn API access. Get 50% off Unipile for 3 months with MAXFROMN8N code (message support with code after sign up)

## Installation

1. **Set up PocketBase:**
   - **Recommended:** Use the one-click LinkedOut + PocketBase template on CloudStation: [LinkedOut Template](https://app.cloud-station.io/template-store/linkedout-pocketbase)
   - Or deploy PocketBase separately: [PocketBase Template](https://app.cloud-station.io/template-store/pocketbase)
   - Or run it locally:
     ```bash
     # Create a superuser account
     ./pb/pocketbase superuser upsert $POCKETBASE_USER $POCKETBASE_PASSWORD
     
     # Start PocketBase server
     ./pb/pocketbase serve --http=0.0.0.0:8090
     ```
   - Note your PocketBase URL
 
2. **Clone this repository:**
   - Skip this step if using the LinkedOut + PocketBase CloudStation template
   ```bash
   git clone https://github.com/maxt-n8n/linkedout
   cd linkedout
   ```
   - Then run `npm install`

3. **Set up n8n:**
   - Deploy [n8n.io](https://n8n.io) using your preferred method (n8n.cloud, docker, etc.)
   - Note your n8n URL and create an API key in the n8n settings (not available on cloud trial, self-host or upgrade)
   - You'll need this API key during the setup process
   Get 50% off [n8n cloud](https://app.n8n.cloud/register?utm_campaign=linkedout) for 12 months with MAX50. Enter coupon after free trial when choosing a plan.

4. **Set up Unipile:**
   - Create a Unipile account at [unipile.com](https://unipile.com)
   - Get your API key and DSN URL
   - You'll need these during the setup process
   Get 50% off Unipile for 3 months with coupon code #TODO:ADDCODE

5. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_POCKETBASE_URL=your_pocketbase_url
   NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_url
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Complete the setup process:**
   - Open your browser and navigate to your deployed frontend URL or http://localhost:3000
   - Sign in with your PocketBase superuser credentials
   - You'll be redirected to the setup wizard
   - Follow the steps to configure:
     - Enter your n8n API key
     - Enter your Unipile API key and DSN
     - The wizard will automatically load n8n with backend workflows and credentials. It will also populate PocketBase with collections and a service user for backend.

8. **Start using LinkedOut:**
   - After setup is complete, you can start using the application
   - There is no historical syncing at this time, message will show as they come in. 

## Troubleshooting
Nothing here yet

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | N8N URL (without /webhook) | Yes |
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase URL | Yes |


---

<div align="center">
  Made with ❤️ by <a href="https://github.com/maxtkacz">Max </a>and <a href="https://github.com/oumnya">Oumnya</a>  
</div>
