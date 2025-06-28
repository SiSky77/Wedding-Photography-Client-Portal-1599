# Sky Photography Wedding Client Management App - Technical Specification

## 1. System Architecture

### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Supabase      │    │  External APIs  │
│   (React SPA)   │◄──►│   (Backend)     │◄──►│  (Google, etc.) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   PostgreSQL    │    │   Email Service │
│   Storage       │    │   Database      │    │   (Future)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Technology Stack
- **Frontend**: React 18.3.1 with Vite 5.4.2
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS 3.4.17
- **Animation**: Framer Motion 11.0.8
- **Form Management**: React Hook Form 7.48.2 + Zod 3.22.4
- **Icons**: React Icons 5.4.0 (Feather Icons)
- **Routing**: React Router DOM 7.1.0 (Hash Router)
- **State Management**: React Context + useReducer
- **Build Tool**: Vite with React plugin

## 2. Database Design

### 2.1 Entity Relationship Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    profiles     │    │ wedding_forms   │    │ form_autosave   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──►│ user_id (FK)    │    │ user_id (FK)    │
│ email           │    │ form_data       │    │ section         │
│ full_name       │    │ completion_%    │    │ data            │
│ role            │    │ is_completed    │    │ updated_at      │
│ created_at      │    │ wedding_date    │    └─────────────────┘
└─────────────────┘    │ bride_name      │           │
                       │ groom_name      │           │
                       │ venue_name      │           │
                       └─────────────────┘           │
                               │                     │
                               ▼                     ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │email_reminders  │    │additional_forms │
                    ├─────────────────┤    ├─────────────────┤
                    │ user_id (FK)    │    │ user_id (FK)    │
                    │ reminder_type   │    │ form_type       │
                    │ scheduled_for   │    │ form_data       │
                    │ sent_at         │    │ is_completed    │
                    │ is_sent         │    └─────────────────┘
                    └─────────────────┘
```

### 2.2 Data Types and Constraints
- **UUID**: Primary keys and foreign keys
- **JSONB**: Form data storage for flexibility
- **TIMESTAMP WITH TIME ZONE**: All datetime fields
- **TEXT**: String fields with no length limit
- **BOOLEAN**: Boolean flags
- **INTEGER**: Completion percentages
- **ENUM**: User roles (client, admin)

## 3. Authentication & Authorization

### 3.1 Authentication Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │  Supabase   │    │   OAuth     │
│   Login     │    │    Auth     │    │  Provider   │
└─────────────┘    └─────────────┘    └─────────────┘
        │                   │                   │
        ├─── Email/Pass ───►│                   │
        ├─── Google ────────┼──────────────────►│
        ├─── Apple ─────────┼──────────────────►│
        │                   │                   │
        │◄──── JWT ─────────│                   │
        │                   │                   │
        ├─── API Calls ────►│                   │
        │    (with JWT)      │                   │
```

### 3.2 Role-Based Access Control (RBAC)
- **Client Role**: Can access own data only
- **Admin Role**: Can access all client data
- **Row Level Security (RLS)**: Database-level access control
- **API Authorization**: Context-based permission checking

## 4. Form Management System

### 4.1 Form Structure
```javascript
const formSections = {
  basic: {
    fields: ['bride_name', 'groom_name', 'wedding_date', 'venue_name'],
    required: true,
    weight: 30 // % of total completion
  },
  ceremony: {
    fields: ['ceremony_time', 'ceremony_style', 'special_traditions'],
    required: false,
    weight: 15
  },
  reception: {
    fields: ['reception_time', 'first_dance', 'cake_cutting'],
    required: false,
    weight: 15
  }
  // ... other sections
}
```

### 4.2 Conditional Logic Engine
```javascript
const conditionalFields = {
  confetti_shot: {
    condition: (formData) => formData.confetti_shot === true,
    shows: ['confetti_type']
  },
  getting_ready_photos: {
    condition: (formData) => formData.getting_ready_photos === true,
    shows: ['bride_getting_ready_location', 'bride_getting_ready_time']
  }
}
```

### 4.3 Auto-Save Mechanism
- **Debounced Saving**: 2-second delay after user stops typing
- **Section-Based Storage**: Each form section saved separately
- **Conflict Resolution**: Last-write-wins strategy
- **Offline Support**: Browser storage fallback (future enhancement)

## 5. User Experience (UX) Design

### 5.1 Design Principles
- **Mobile-First**: Responsive design starting from 320px width
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: < 3 second initial load time
- **Offline-Ready**: Service worker for offline form editing (future)

### 5.2 Micro-Interactions
```javascript
const microInteractions = {
  formCompletion: {
    trigger: 'completionPercentage === 100',
    animation: 'confetti + success message',
    duration: 5000
  },
  autoSave: {
    trigger: 'form field change',
    animation: 'subtle save indicator',
    duration: 2000
  },
  sectionProgress: {
    trigger: 'section completion',
    animation: 'progress bar fill + checkmark',
    duration: 800
  }
}
```

### 5.3 Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 6. Performance Optimization

### 6.1 Frontend Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Size**: < 500KB gzipped
- **Caching Strategy**: Service worker + browser cache
- **Tree Shaking**: Unused code elimination

### 6.2 Database Optimization
- **Indexing Strategy**: Composite indexes on frequently queried fields
- **Query Optimization**: Efficient joins and aggregations
- **Connection Pooling**: Supabase built-in connection management
- **Data Pagination**: Cursor-based pagination for large datasets

## 7. Security Implementation

### 7.1 Data Protection
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Row-level security policies
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content Security Policy (CSP)
- **CSRF Protection**: SameSite cookies

### 7.2 Privacy Compliance (GDPR)
- **Data Minimization**: Collect only necessary data
- **Purpose Limitation**: Clear data usage policies
- **Data Retention**: Automatic deletion after 2 years
- **Right to Erasure**: User data deletion functionality
- **Data Portability**: CSV export for users
- **Consent Management**: Explicit consent for data processing

## 8. API Design

### 8.1 RESTful Endpoints
```
GET    /api/profile              # Get user profile
PUT    /api/profile              # Update user profile
GET    /api/wedding-form         # Get wedding form data
POST   /api/wedding-form         # Create wedding form
PUT    /api/wedding-form         # Update wedding form
POST   /api/autosave             # Auto-save form section
GET    /api/admin/clients        # Get all clients (admin)
POST   /api/admin/export         # Export client data (admin)
```

### 8.2 Real-time Features
- **Form Auto-save**: Real-time draft synchronization
- **Admin Dashboard**: Live client progress updates
- **Collaboration**: Multiple users editing same form (future)

## 9. Testing Strategy

### 9.1 Testing Pyramid
```
           ┌─────────────────┐
           │   E2E Tests     │  ← 10% (Critical user flows)
           └─────────────────┘
         ┌───────────────────────┐
         │  Integration Tests    │  ← 20% (API + DB interactions)
         └───────────────────────┘
       ┌─────────────────────────────┐
       │     Unit Tests              │  ← 70% (Components + Utils)
       └─────────────────────────────┘
```

### 9.2 Test Coverage Goals
- **Unit Tests**: 80% code coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys
- **Performance Tests**: Load testing for 100 concurrent users
- **Security Tests**: OWASP Top 10 vulnerability scanning

## 10. Deployment & DevOps

### 10.1 Deployment Pipeline
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │    │   Vercel    │    │  Supabase   │    │ Production  │
│ Repository  │───►│   Build     │───►│   Deploy    │───►│   Domain    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 10.2 Environment Configuration
- **Development**: Local development with Supabase local
- **Staging**: Preview deployments for testing
- **Production**: Optimized build with CDN
- **Monitoring**: Error tracking and performance monitoring

## 11. Monitoring & Analytics

### 11.1 Key Metrics
- **Form Completion Rate**: % of users completing forms
- **Time to Complete**: Average time to fill form
- **Drop-off Points**: Where users abandon forms
- **User Engagement**: Session duration and return visits
- **Error Rates**: JavaScript errors and API failures

### 11.2 Monitoring Tools
- **Error Tracking**: Sentry or similar
- **Performance**: Web Vitals monitoring
- **Analytics**: Privacy-focused analytics
- **Uptime**: Status page and alerts
- **Database**: Query performance monitoring

## 12. Future Enhancements

### 12.1 Phase 2 Features
- **Mobile Apps**: React Native iOS/Android apps
- **Advanced Forms**: Conditional logic builder
- **Email Automation**: Customizable reminder templates
- **Integration API**: Webhook support for external systems
- **Advanced Analytics**: Completion funnel analysis

### 12.2 Phase 3 Features
- **AI Assistant**: Smart form completion suggestions
- **Multi-language**: Internationalization support
- **Advanced Collaboration**: Real-time multi-user editing
- **Vendor Network**: Integration with wedding vendors
- **Client Portal**: Photo delivery and selection

## 13. Maintenance & Support

### 13.1 Maintenance Schedule
- **Daily**: Automated backups and monitoring
- **Weekly**: Security updates and dependency updates
- **Monthly**: Performance review and optimization
- **Quarterly**: Feature updates and user feedback review

### 13.2 Support Channels
- **Email Support**: Technical and user support
- **Documentation**: Comprehensive user guides
- **Video Tutorials**: Form completion walkthroughs
- **FAQ Section**: Common questions and solutions

This technical specification provides a comprehensive blueprint for building and maintaining the Sky Photography Wedding Client Management App, ensuring scalability, security, and excellent user experience.