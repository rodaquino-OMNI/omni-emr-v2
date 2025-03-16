
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

## 🚀 Getting Started

### Project Setup

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```sh
   npm i
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

## 💻 Technology Stack

MedCare EMR is built with modern technologies:

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn-ui components
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## 📱 Deployment

Simply open [Lovable](https://lovable.dev/projects/d020a766-3e82-435e-a30b-6267c420b937) and click on Share -> Publish to deploy your application.

For custom domains, we recommend using Netlify. Visit our [docs](https://docs.lovable.dev/tips-tricks/custom-domain/) for more details.

## 🔧 Development

You can edit this code in several ways:

- **Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/d020a766-3e82-435e-a30b-6267c420b937) and start prompting.
- **Use your preferred IDE**: Clone this repo and push changes.
- **Edit directly in GitHub**: Navigate to files and use the edit button.
- **Use GitHub Codespaces**: Launch a new codespace from the repository.

---

<p align="center">
  <b>MedCare EMR</b><br>
  Transforming Healthcare Management<br>
</p>
