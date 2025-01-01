# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Website submission form with category and tag selection
- Admin panel for managing website submissions
- Approval workflow for new website submissions
- Toast notifications for submission status
- Confirmation dialogs for admin actions
- SEO-friendly category URLs with proper slugs
- Middleware for URL normalization and redirects
- Multiple demo users, reviews, and ratings for better sorting
- Proper data seeding for meaningful sorting functionality
- Search functionality with real-time suggestions
- Search highlighting for matched terms
- Debounced search input
- Tag and website search suggestions
- Search functionality across all pages (main, category, and categories views)
- Unified search bar placement next to sorting controls
- Consistent search experience throughout the application

### Changed
- Improved website submission UX with validation
- Enhanced admin interface with better controls
- Updated category navigation to handle active states correctly
- Enhanced sorting functionality with proper data structure
- Improved schema and seed script for better demo data
- Removed category page breadcrumbs for cleaner UI
- Improved search UX with loading states
- Optimized search queries for better performance

### Fixed
- Unique constraint handling in ratings
- Category filter state now matches URL
- Sorting persistence when navigating categories
- URL structure for better SEO
- React JSX type issues in utils
- Search suggestion type safety

### Technical
- Added server actions for website approval/rejection
- Implemented toast notifications system
- Added dialog components for confirmations
- Added proper TypeScript types for components
- Updated Prisma schema for better data relationships
- Improved error handling in data fetching
- Enhanced middleware for URL handling
- Added debounce hook for search optimization
- Implemented shadcn/ui components

### Dependencies
- Added required packages for development
- Updated existing packages to latest versions
- Added new UI components for better user experience 