# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- SEO-friendly category URLs with proper slugs
- Middleware for URL normalization and redirects
- Multiple demo users, reviews, and ratings for better sorting
- Proper data seeding for meaningful sorting functionality

### Changed
- Updated category navigation to handle active states correctly
- Enhanced sorting functionality with proper data structure
- Improved schema and seed script for better demo data
- Removed category page breadcrumbs for cleaner UI

### Fixed
- Unique constraint handling in ratings
- Category filter state now matches URL
- Sorting persistence when navigating categories
- URL structure for better SEO

### Technical
- Added proper TypeScript types for components
- Updated Prisma schema for better data relationships
- Improved error handling in data fetching
- Enhanced middleware for URL handling

### Dependencies
- Added required packages for development
- Updated existing packages to latest versions
- Added new UI components for better user experience 