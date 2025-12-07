# ASMI Tech - SAP Consulting Website

A modern, multi-language website for ASMI Tech, a premier SAP consulting company. This application provides information about services, industries, careers, and includes an admin panel for content management.

## 🚀 Project Overview

ASMI Tech is a full-stack web application built with React and Vite, featuring:
- **Multi-language support** (English, Dutch, German)
- **Admin dashboard** for managing jobs, applications, inquiries, case studies, and services
- **Dynamic service pages** with SEO optimization
- **Translation management** system with AI-powered translations via Hugging Face
- **Responsive design** with modern UI components
- **Supabase integration** for backend services and database

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 7** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Hugging Face API** - AI-powered translation services
- **Vercel Serverless Functions** - API routes for production

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** (for database and backend services)

## 🔧 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd "ASMI TECH/AsmiTech"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   The Supabase configuration is already set in `src/integrations/supabase/client.ts`. If you need to use a different Supabase instance, update the following:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

   For local development with environment variables, create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**:
   
   The project includes SQL migration files in the `supabase/migrations/` directory. Apply these migrations to your Supabase project:
   - Connect to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in order (check file names for sequence)

## 🏃 Running the Project Locally

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

**Features in development mode:**
- Hot Module Replacement (HMR) for instant updates
- Vite proxy for `/api/hf` routes (Hugging Face API)
- Vite plugin for `/api/save-translation` endpoint
- Source maps for debugging

### Preview Production Build

To preview the production build locally:

```bash
npm run build
npm run preview
```

This builds the project and serves it locally, simulating the production environment.

## 📁 Project Structure

```
AsmiTech/
├── api/                          # Vercel serverless functions
│   ├── hf/v1/chat/              # Hugging Face API proxy
│   └── save-translation.js      # Translation file saving endpoint
├── dist/                         # Production build output
├── public/                       # Static assets
│   └── logos/                   # Company logos
├── scripts/                      # Build scripts
│   └── copy-htaccess.js         # Copies .htaccess to dist
├── src/
│   ├── assets/                  # Images and static assets
│   ├── components/              # React components
│   │   ├── admin/              # Admin panel components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── Header.jsx          # Site header
│   │   ├── Footer.jsx          # Site footer
│   │   └── LanguageSwitcher.tsx # Language selector
│   ├── contexts/               # React contexts
│   │   └── LanguageContext.tsx # Language state management
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.tsx         # Authentication hook
│   │   └── useTranslation.ts   # Translation hook
│   ├── i18n/                   # Internationalization setup
│   ├── integrations/           # Third-party integrations
│   │   └── supabase/           # Supabase client and types
│   ├── locales/                # Translation files
│   │   ├── en.json             # English translations
│   │   ├── nl.json             # Dutch translations
│   │   └── de.json             # German translations
│   ├── pages/                  # Page components
│   │   ├── admin/              # Admin panel pages
│   │   ├── Home.jsx            # Homepage
│   │   ├── About.jsx           # About page
│   │   ├── Services.jsx        # Services listing
│   │   ├── Industries.jsx      # Industries page
│   │   ├── Careers.jsx         # Careers page
│   │   ├── Contact.jsx         # Contact page
│   │   └── Resources.jsx       # Resources page
│   ├── services/               # Business logic services
│   │   ├── translationService.ts      # Translation API service
│   │   └── staticTranslationService.ts # Static translation service
│   ├── App.jsx                 # Main app component with routes
│   └── main.jsx                # Application entry point
├── supabase/                   # Supabase configuration
│   ├── config.toml            # Supabase config
│   └── migrations/            # Database migrations
├── .htaccess                   # Apache configuration for SPA routing
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment configuration
```

## 🎯 Key Features

### Public Website
- **Homepage** - Hero section, services overview, client testimonials
- **About** - Company story, vision, mission, team
- **Services** - Detailed service offerings with dynamic pages
- **Industries** - Industry-specific solutions
- **Careers** - Job listings and application system
- **Contact** - Contact form and inquiry submission
- **Resources** - Case studies and downloadable resources

### Admin Panel
- **Dashboard** - Overview of applications, inquiries, and jobs
- **Jobs Management** - Create, edit, and manage job postings
- **Applications Management** - Review and manage job applications
- **Inquiries Management** - Handle contact form submissions
- **Case Studies Management** - Manage case study content
- **Service Pages Management** - Create and edit dynamic service pages
- **Translation Management** - AI-powered translation tools with diagnostics

### Internationalization
- Support for English (en), Dutch (nl), and German (de)
- Language switcher component
- Dynamic translation loading
- AI-powered translation assistance for admins

## 🔌 API Endpoints

### Development (via Vite Proxy/Plugin)
- `/api/hf/v1/chat/completions` - Hugging Face API proxy (handled by Vite proxy)
- `/api/save-translation` - Save translation files (handled by Vite plugin)

### Production (Vercel Serverless Functions)
See `api/README.md` for detailed API documentation.

## 🏗️ Building for Production

### Standard Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build for GoDaddy Hosting

```bash
npm run build:godaddy
```

This builds the project and automatically copies the `.htaccess` file to the `dist/` directory for Apache server configuration.

## 🚢 Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard (if needed)
3. **Deploy** - Vercel will automatically detect and deploy:
   - Frontend React application
   - Serverless functions from `api/` directory
   - Configure routing from `vercel.json`

### Other Hosting Providers

For other hosting providers (e.g., GoDaddy, Apache servers):

1. Build the project: `npm run build:godaddy`
2. Upload the `dist/` directory contents to your server
3. Ensure `.htaccess` is in the root directory for SPA routing
4. Configure your server to serve `index.html` for all routes

## 🧪 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:godaddy` - Build and copy .htaccess for Apache servers
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Authentication

The admin panel uses Supabase authentication. Admin users must be authenticated to access admin routes. Authentication is handled via the `useAuth` hook and `AuthProvider` context.

## 📝 Database Schema

The project uses Supabase (PostgreSQL) with the following main tables:
- Jobs
- Applications
- Inquiries
- Case Studies
- Service Pages
- Translations

See `supabase/migrations/` for the complete database schema.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Add your license information here]

## 📞 Support

For issues or questions:
- Check the `api/README.md` for API-specific documentation
- Review Supabase migration files for database setup
- Contact the development team

---

**Built with ❤️ for ASMI Tech**
