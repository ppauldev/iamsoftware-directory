# Directory Listing Website
This project is about building a template for a directory listing website.
To develop this template a practical example is used.

## Practical example name
The IAM Directory

## Practical example description
The IAM Directory lists companies in the "Identity and Access Management" market ind its submarkets, e.g. "Identity Governance and Administration", "Privileged Access Management", etc. The IAM Directory targets the personas corporate IAM manager and IAM business consultants by helping them find the right IAM solution for their business and company. The IAM Directory offers multiple features for this goal. The marketing strategy primarily relies on SEO. THe web URL of The IAM Directory is "https://www.iamsoftware.directory".

## General Pages
- Main page with: Navigation bar, footer, filter sidebar, grid with company tiles, pagination
- Post overview page with: Navigation bar, footer, grid with post tiles, pagination
- Post page with: Navigation bar, footer, post information and markdown content
- Company page with: Navigation bar, footer, company information

## Features
- Hygraph CMS is used to provide data for rendering: company information, company details page information, post information, website title, taxonomy (groups, categories, tags) for populating the filter sidebar
- Filter sidebar which dynamically filters the company tiles grid based on several filter options: company rating (0-5, whereas 0 is showing all companies even those without rating value), matching categories of a company, matching tags of a company, free text search input field for a company
- Navigation bar with: website logo and name on the left side, post link in the middle, contribute call-to-action button to submit company for listing, light-dark theme toggle
- Footer with: year + rihts reserved disclaimer in the middle, "Made by Acrima" on the right sie
- Tile with information: title of company, top categories (max. 3) shown as badges, rest of categories shown as badge with counter (e.g. "+ 3 more"), company description (max. 200 words), rating (1-5, a 0 rating is not shown), a button to view details page of company
- Static website with prefetched data from Hygraph to populate the pages before deploying via Vercel

## Tech Stack
- Next.js
- React + Typescript
- Shadcn
- Hygraph CMS
- GraphQL API