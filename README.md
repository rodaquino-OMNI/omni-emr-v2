
# MedCare EMR

## A Revolutionary Healthcare Management System

**MedCare EMR** is a modern electronic medical record system designed to transform healthcare documentation and patient care. With a focus on intuitive design, AI assistance, and seamless workflows, MedCare adapts to how healthcare professionals actually work.

Built for physicians, nurses, and patients in both English and Portuguese environments, MedCare EMR makes healthcare management more efficient, secure, and patient-centered.

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
- Role-based access controls with granular permissions
- Advanced audit logging for complete traceability
- Multi-factor authentication for enhanced security
- Session timeout controls for inactive users

### 💬 Communication Tools

Streamlined communication across care teams:
- Integrated messaging system
- Real-time notifications
- Task assignment and tracking
- Secure information sharing

## 📊 Project Statistics

### Database Statistics
- **Total Tables**: 31 tables in the Supabase database
- **Key Tables**: patients, observations, prescriptions, medications_inventory, clinical_notes
- **Database Functions**: 41 defined PostgreSQL functions
- **Triggers**: 24 database triggers for data integrity

### Code Structure
- **Components**: Approximately 250+ React components
- **Hooks**: 30+ custom hooks for various functionalities
- **Services**: Multiple service layers for data access (RxNorm, patients, prescriptions)
- **Utility Files**: Numerous utility functions for permissions, authentication, and data processing

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

### Technical Highlights
- Intelligent drug interaction detection system
- Vital signs module with reference ranges and abnormal value identification
- FHIR data model support for healthcare interoperability
- Comprehensive audit logging for regulatory compliance
- Fluid balance tracking for clinical care

## 🚀 Production Deployment Guide

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- A Supabase account and project
- PostgreSQL knowledge for database management
- Domain name (for production deployment)
- SSL certificate (recommended for HIPAA compliance)

### 1. Environment Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-organization/medcare-emr.git
   cd medcare-emr
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

## 💻 Technology Stack

MedCare EMR is built with modern technologies:

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn-ui components
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

---

<p align="center">
  <b>MedCare EMR</b><br>
  Transforming Healthcare Management<br>
</p>
