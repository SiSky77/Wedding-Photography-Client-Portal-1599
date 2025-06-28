# Sky Photography Wedding Client Management App

A comprehensive wedding photography client management system built with React, Supabase, and Tailwind CSS.

![Sky Photography Logo](./public/logo.png)

## 🎯 Purpose

This application serves as a branded portal where wedding clients can:
- Log in securely with Google, Apple, or email authentication
- Fill out detailed wedding information forms with conditional logic
- Save drafts and return later to complete/update forms
- Track completion progress with visual feedback
- Receive automated email reminders

Photographers can:
- View all client responses in an admin dashboard
- Export data to CSV or integrate with external systems
- Search and filter client information
- Monitor form completion rates

## ✨ Features

### Client Features
- **Secure Authentication**: Google OAuth, Apple Sign-In, and email/password options
- **Smart Forms**: Conditional fields that adapt based on user responses
- **Auto-Save**: Background saving prevents data loss
- **Progress Tracking**: Visual completion percentage with motivational messaging
- **Mobile-First Design**: Responsive design optimized for all devices
- **GDPR Compliant**: Privacy-focused data handling

### Admin Features
- **Client Dashboard**: Overview of all wedding clients and their form status
- **Export Functionality**: CSV export for integration with external systems
- **Search & Filter**: Find clients by name, email, or completion status
- **Real-time Updates**: Live data synchronization

### Design Features
- **Sky Photography Branding**: Custom logo integration and color palette
- **Smooth Animations**: Framer Motion for delightful interactions
- **Celebratory UX**: Confetti animation on form completion
- **Professional Aesthetic**: Clean, warm, and friendly interface

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Authentication**: Supabase Auth (Google, Apple, Email)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: React Icons (Feather Icons)
- **Routing**: React Router DOM with Hash routing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (optional for demo)
- Google OAuth credentials (optional)

### Quick Start (Demo Mode)
```bash
# Clone and install
npm install

# Add your logo
# Place your logo file as public/logo.png

# Run in demo mode (no configuration needed)
npm run dev
```

The app will run in demo mode with mock data if Supabase is not configured.

### Full Setup with Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings > API to get your URL and API key

2. **Setup Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Setup Database**
   - In your Supabase project, go to the SQL Editor
   - Run the SQL script from `database-schema.sql`

4. **Add Your Logo**
   - Place your logo file as `public/logo.png`
   - The app will automatically use your logo throughout the interface
   - If the logo fails to load, it will fallback to a camera icon

5. **Configure Authentication (Optional)**
   - In Supabase dashboard, go to Authentication > Settings
   - Enable Google provider if desired
   - Add your domain to allowed redirect URLs

6. **Run the Application**
   ```bash
   npm run dev
   ```

## 🎨 Logo Integration

Your logo is automatically integrated throughout the application:

- **Header**: Displayed in the navigation bar
- **Footer**: Brand identity section
- **Login Page**: Prominent display on authentication screens
- **Landing Page**: Hero section branding
- **Loading Spinner**: Animated logo during loading states
- **Favicon**: Browser tab icon

The logo implementation includes:
- Automatic fallback to camera icon if logo fails to load
- Responsive sizing for different screen sizes
- Proper alt text for accessibility
- Optimized loading with error handling

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── ui/             # Reusable UI components
│   └── common/         # Common components (SafeIcon)
├── contexts/           # React Context providers
├── lib/                # External service configurations
├── pages/              # Page components
├── utils/              # Utility functions
└── styles/             # Global styles and Tailwind config
public/
├── logo.png           # Your Sky Photography logo
└── ...                # Other static assets
```

## 🔧 Configuration Options

### Demo Mode
The app automatically runs in demo mode when Supabase is not configured:
- Mock authentication with demo user
- Sample wedding data
- All UI functionality works
- Perfect for testing and development

### Production Mode
With Supabase configured:
- Full authentication system
- Real database storage
- Email notifications
- Admin functionality

## 🔒 Security & Privacy

- **Authentication**: Secure OAuth and email verification
- **Data Encryption**: All data encrypted in transit and at rest
- **GDPR Compliance**: Clear privacy policies and data handling
- **Role-based Access**: Admin and client role separation

## 📱 Mobile Experience

- Touch-friendly interface design
- Optimized form layouts for mobile screens
- Swipe gestures for form navigation
- Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Sky Photography. All rights reserved.

---

Built with ❤️ for capturing life's most precious moments.