# OmniCare

## A Revolutionary Healthcare Management System

**OmniCare** is a modern electronic medical record system designed to transform healthcare documentation and patient care. With a focus on intuitive design, AI assistance, and seamless workflows, OmniCare adapts to how healthcare professionals actually work.

Built for physicians, nurses, and patients in both English and Portuguese environments, OmniCare makes healthcare management more efficient, secure, and patient-centered.

## 🌟 Key Features

### 🌐 Bilingual Experience

True bilingual support throughout the entire system:
- Seamless language switching between English and Portuguese
- Context-aware translation preserving medical terminology
- Complete language consistency across all interfaces

### 🔍 Clinical Focus

Designed with healthcare professionals in mind:
- Intuitive patient management
- Comprehensive medical records
- Medication and prescription tracking
- Task and notification management

### 🔒 Security & Compliance

Enterprise-grade security you can trust:
- HIPAA & LGPD Compliant for both U.S. and Brazilian standards
- Row Level Security (RLS) implemented at the database level
- Role-based access controls with granular permissions
- Sector-based access control for organizational units
- Advanced audit logging for complete traceability
- Multi-factor authentication for enhanced security
- Session timeout controls for inactive users
- Encryption for sensitive data at rest and in transit

### 💬 Communication Tools

Streamlined communication across care teams:
- Integrated messaging system
- Real-time notifications
- Task assignment and tracking
- Secure information sharing

## 📊 Project Statistics

### Database Statistics
- **Total Tables**: 35+ tables in the Supabase database
- **Key Tables**: users, patients, appointments, visits, medications, prescriptions
- **Authentication Tables**: users, permissions, user_permissions
- **Clinical Tables**: vital_signs, clinical_notes, allergies
- **Operational Tables**: tasks, messages, alerts, audit_logs
- **Database Functions**: 40+ defined PostgreSQL functions
- **Triggers**: 25+ database triggers for data integrity
- **Indexes**: Extensive use of indexes for performance optimization
- **Views**: Materialized views for performance (e.g., patient_latest_vitals)

### Code Structure
- **Components**: 501 React components organized by domain/feature
- **Hooks**: 72 custom hooks for various functionalities
- **Services**: 69 service modules with multiple sub-services
- **Utility Files**: Numerous utility functions for permissions, authentication, and data processing
- **Total Source Files**: 1018 files (92.3% TypeScript/JavaScript)
- **Total Lines of Code**: 88,493 lines in src directory

### Medical System Features
- **RxNorm Integration**: Complete medication database with translation support (English/Portuguese)
- **Alert System**: Comprehensive medication alert system with multiple severity levels
- **Role-Based Access**: Doctor, Nurse, Admin role-specific dashboards and permissions
- **Vitals Tracking**: Charts and monitoring for multiple vital signs
- **Patient Management**: Complete patient records with medical history

### Performance Indicators
- **Caching**: Implementation of local and database caching for medication searches
- **Translation Support**: Bilingual interface with complete language-switching capabilities
- **Security Features**: MFA support, audit logging, and session timeout controls
- **Optimization Techniques**:
  - React.memo for pure components
  - useMemo and useCallback for performance-critical sections
  - Code splitting for optimized bundle size
  - Virtualization for long lists

### Technical Highlights
- Intelligent drug interaction detection system
- Vital signs module with reference ranges and abnormal value identification
- FHIR data model support for healthcare interoperability
- Comprehensive audit logging for regulatory compliance
- Fluid balance tracking for clinical care
- Provider Pattern with React Context for global state management
- Repository Pattern for data access abstraction
- Component Composition for building complex UI from smaller parts
- Role-Based Access Control with fine-grained permissions

## 🛠️ Developer Tools

### Orphaned Pages Management

OmniCare includes a unified system for managing orphaned pages (pages that exist but are not properly referenced in the application's routing configuration):

- **Unified Script**: `orphaned-pages-manager.js` provides a command-line interface for analyzing, reintegrating, and validating orphaned pages
- **Modular Architecture**: The system is built with a modular architecture in `src/tools/orphaned-pages/`
- **Comprehensive Documentation**: `Orphaned-Pages-Management.md` provides detailed information about the system

#### Usage

```bash
# Analyze orphaned pages
node orphaned-pages-manager.js analyze

# Reintegrate pages by category
node orphaned-pages-manager.js reintegrate --category=clinicalWorkflow

# Validate integration status
node orphaned-pages-manager.js validate --verbose
```

> Note: Legacy orphaned pages documentation and scripts have been archived in `archive/orphaned-pages/`

## 🚀 Production Deployment Guide

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- A Supabase account and project
- PostgreSQL knowledge for database management
- Domain name (for production deployment)
- SSL certificate (required for HIPAA compliance)
- Vitest for running tests (configured in the project)

### 1. Environment Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-organization/omnicare.git
   cd omnicare
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ENCRYPTION_KEY=your-secure-encryption-key
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

### 2. Database Configuration

1. **Set up Supabase tables and schemas**
   Navigate to your Supabase project and run the SQL scripts located in:
   ```
   supabase/migrations/
   ```
   Execute these in the order of their prefixed dates.

2. **Configure Row Level Security (RLS) policies**
   Apply the security policies from:
   ```
   src/utils/fhir/setupPolicies.sql
   ```

3. **Deploy Edge Functions**
   ```sh
   cd supabase
   npx supabase functions deploy rxnorm-sync
   npx supabase functions deploy rxnorm-anvisa-map
   npx supabase functions deploy rxnorm-portuguese-mapping
   ```

### 3. Application Build

1. **Create a production build**
   ```sh
   npm run build
   ```
   This creates optimized files in the `dist` directory.

2. **Test the production build locally**
   ```sh
   npm run preview
   ```
   
### 4. Deployment Options

#### Option 1: Traditional Web Hosting

1. **Upload to a web server**
   Transfer the contents of the `dist` directory to your web server's public directory.

2. **Configure server for SPA routing**
   For Apache, create a `.htaccess` file in the root directory:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
   
   For Nginx, update your server configuration:
   ```
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

#### Option 2: Cloud Platform Deployment

1. **Deploy to Netlify**
   ```sh
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

2. **Deploy to Vercel**
   ```sh
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Deploy to AWS Amplify**
   ```sh
   npm install -g @aws-amplify/cli
   amplify configure
   amplify init
   amplify add hosting
   amplify publish
   ```

### 5. Post-Deployment Steps

1. **Configure domain and SSL**
   Set up your custom domain and SSL certificate through your hosting provider.

2. **Set up monitoring**
   Implement application monitoring using services like Sentry, LogRocket, or AWS CloudWatch.

3. **Setup backup procedures**
   Configure regular database backups from your Supabase project.

4. **HIPAA Compliance Verification**
   - Ensure all PHI data is encrypted at rest and in transit
   - Verify access controls and authentication mechanisms
   - Test audit logging functionality
   - Review and document compliance with HIPAA Technical Safeguards

### 6. Scaling Considerations

1. **Database Performance**
   - Monitor query performance
   - Implement database indexing for frequently accessed tables
   - Consider read replicas for high-traffic deployments

2. **Application Performance**
   - Implement CDN for static assets
   - Consider server-side rendering for improved initial load times
   - Optimize bundle size with code splitting

### 7. Testing Framework

1. **Testing Tools**
   - Vitest configured as the primary testing framework
   - Testing utilities from @testing-library/react
   - Test configuration in vitest.config.ts

2. **Current Test Coverage**
   - Unit tests for critical components
   - Integration tests for key workflows
   - Opportunity for expanded test coverage

3. **Running Tests**
   ```sh
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   ```

## 💻 Technology Stack

OmniCare is built with modern technologies:

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn-ui components, Radix UI (accessible primitives)
- **State Management**: React Context API, TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Form Handling**: React Hook Form, Zod (schema validation)
- **Data Visualization**: Recharts
- **Utilities**: date-fns (date manipulation), crypto-js (encryption)
- **Routing**: React Router with role-based access control

---

<p align="center">
  <b>OmniCare</b><br>
  Transforming Healthcare Management<br>
</p>
