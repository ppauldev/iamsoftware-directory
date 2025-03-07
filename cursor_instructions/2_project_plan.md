# The IAM Directory - Project Plan

## Project Summary
The IAM Directory is a static Next.js website for listing Identity and Access Management companies. The site uses Hygraph CMS as its content backend, with the following key features:

- Client-side filtering of company listings
- Traditional pagination
- Company submission feature using Resend for email notifications
- Light/dark theme switching
- SEO optimization for marketing

## Target Audience
- Corporate IAM managers
- IAM business consultants

## Technical Specifications

### Framework & Libraries
- **Framework**: Next.js with TypeScript and React
- **UI Components**: Shadcn
- **Data Management**: GraphQL queries to Hygraph CMS
- **Email Service**: Resend

### Feature Details
- **Filtering**: Client-side implementation without URL changes
- **Pagination**: Traditional numbered pages with 20 items default + dropdown for more
- **Theme**: System default initially, persisted in localStorage
- **Company Submission**: Dialog form with Resend email integration
- **Deployment**: Vercel with standard build process

### Environment Variables
- `ADMIN_EMAIL`: Email address to receive company submissions
- `RESEND_API_KEY`: API key for the Resend email service
- `HYGRAPH_API_TOKEN`: Authentication token for Hygraph CMS
- `HYGRAPH_API_URL`: GraphQL endpoint URL for Hygraph CMS

## Implementation Plan

### 1. Setup Phase
- Initialize Next.js project with TypeScript
- Configure Shadcn UI
- Set up environment variables
- Create GraphQL client configuration

### 2. Core Components Development
- Layout components (Navbar, Footer, Theme toggle)
- Company tile component
- Filter sidebar component
- Pagination component
- "Propose Company" dialog and form

### 3. Data Integration
- Create GraphQL queries for different page types
- Implement data fetching and static generation
- Connect data to UI components

### 4. Feature Implementation
- Client-side filtering functionality
- Theme switching and persistence
- Email submission functionality
- SEO optimization

### 5. Testing & Optimization
- Responsive design testing
- Performance optimization
- Build process verification

## Data Model
The data model is defined in Hygraph CMS and includes the following primary entities:
- **Taxonomy**: Groups, Categories, and Tags for organizing content
- **Company**: Main entity with details about IAM companies
- **Post**: Blog or content entries related to IAM topics
- **Content**: Reusable content blocks with markdown support

## Page Types
- **Main page**: Company listing with filter sidebar
- **Post overview page**: Grid of post tiles
- **Post page**: Individual post with markdown content
- **Company page**: Detailed company information

## Design Guidelines
- Responsive design for mobile compatibility
- Minimalistic, professional, and modern aesthetic
- Beautiful UI with optimal user experience 