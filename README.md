# PricePulse

**Track prices. Save money. Never miss a deal.**

PricePulse is an open-source price tracking platform that monitors product prices across e-commerce websites and sends instant alerts when prices drop below your target value.

Built with **Next.js, TypeScript, Supabase, and modern web scraping techniques**, PricePulse helps users make smarter purchasing decisions by automating price monitoring.

🌐 Live Demo: https://pricepulse-scraper.vercel.app/

---

## Features

### Smart Price Tracking

* Track product prices from supported e-commerce websites
* Monitor multiple products simultaneously
* Real-time price updates

### Instant Price Alerts

* Get notified when prices fall below your desired threshold
* Automated monitoring without manual checking
* Stay ahead of flash sales and discounts

### Robust Web Scraping Engine

* Advanced bot detection handling
* Automatic retry mechanism
* Clean error handling and recovery
* Resilient scraping architecture

### Authentication & User Dashboard

* Secure user authentication
* Personalized dashboard
* Manage tracked products efficiently
* View product history and status

## Modern User Experience

* Responsive design for all devices
* Fast and intuitive interface
* Clean dashboard experience
* Optimized performance

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL

### Scraping & Automation

* Custom Scraper Engine
* Retry Logic System
* Bot Detection Handling

### Deployment

* Vercel

---


## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Lohith848/PricePulse.git

cd PricePulse
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Project Structure

```bash
PricePulse/
├── app/
├── components/
├── lib/
├── public/
├── supabase-schema.sql
├── package.json
└── README.md
```

---

## Key Highlights

### Advanced Scraper Architecture

PricePulse includes a production-ready scraping engine featuring:

* Bot detection handling
* Retry strategies
* Error recovery mechanisms
* Reliable data extraction
* Scalable architecture

### Supabase Integration

* User authentication
* Database management
* Secure API access
* User-specific tracking data

### Modern Dashboard

* Product management
* Price monitoring
* Alert management
* Clean UI/UX

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## Roadmap

* [ ] Browser extension support
* [ ] Telegram notifications
* [ ] WhatsApp alerts
* [ ] Product price history graphs
* [ ] Multi-store comparison
* [ ] AI-powered price prediction
* [ ] Mobile application

---

## 🌟 Open Source Contribution

This project is actively maintained and open for community contributions.

If you find this project useful, consider giving it a ⭐ on GitHub.

---

## Author

### Lohith G


<div align="center">

### ⚡ Track Smarter. Buy Cheaper. Save More.

Made with curiosity, and lots of debugging by **Lohith G**

</div>

