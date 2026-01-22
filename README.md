## Stock-app

Stock-app is a web app for inventory control made for a mobile phone repair shop where I work.  
It helps you register products, manage stock quantities, and track stock movements (IN/OUT).

## Features
- Dashboard with quick info (total products, total stock, recent movements)
- Products CRUD (create, edit, delete)
- Stock movements:
  - IN (stock entry)
  - OUT (stock exit)
- Product photo upload (Vercel Blob) and image URL saved in the database
- Search page to find products faster

## Tech Stack
- Next.js (App Router) + TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Vercel (Deployment)
- Vercel Blob (Image upload)
- Tailwind CSS

## Pages
- `/dashboard` — overview and quick actions
- `/products` — create and manage products
- `/products/[id]` — edit product and change photo
- `/movements` — register stock entries/exits
- `/search` — search products

## Deploy
This project is designed to be deployed on Vercel.  
Database is hosted on Neon, and images are stored using Vercel Blob.

## Screenshots

## About
I built this project to help my daily work in a phone repair shop, to keep stock organized and avoid mistakes.
