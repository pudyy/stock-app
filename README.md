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
<img width="960" height="497" alt="{D3DB6EEF-C362-4632-B652-3DEE295BB78F}" src="https://github.com/user-attachments/assets/bbc0ce2f-e3b8-4955-b86b-6fe2c92ff431" />
<img width="960" height="496" alt="{63C0F4A7-3A7E-46E3-820D-964953DFF896}" src="https://github.com/user-attachments/assets/f75dfa8c-f413-4f00-b16e-1954f5c10aff" />
<img width="960" height="500" alt="{D80B517A-0E75-405A-B53A-9B7F5E0F857D}" src="https://github.com/user-attachments/assets/55e2990f-fdce-4ada-90a6-2db713a11b52" />
<img width="960" height="501" alt="{8778C505-6861-4B04-8390-9453F055EF05}" src="https://github.com/user-attachments/assets/eb943bde-c646-473e-853e-ba6bf36968cb" />






## About
I built this project to help my daily work in a phone repair shop, to keep stock organized and avoid mistakes.
