# 🚚 Parcel Delivery System API

## 👤 Author
**Md. Nazmus Sakib**  
FullStack Engineer  
[LinkedIn](https://www.linkedin.com/in/engrsakib/)

---

## 🌟 Project Overview

This project is a robust, secure, and modular backend API built with Express.js and TypeScript.  
Designed for a parcel delivery system, it allows users to perform various tasks as Senders, Receivers, and Admins.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Database Library:** Mongoose
- **Security:** JWT (JSON Web Tokens), bcrypt
- **Validation:** Zod

---

## 📦 Local Setup

1. **Clone the Repository:**
   ```sh
   git clone <your-repo-url>
   cd delivedge-a-parcel-booking-system
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Create Environment File (.env):**
   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/parcel_db
   JWT_SECRET=YOUR_VERY_SECRET_KEY
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the Server:**
   ```sh
   npm run dev
   ```
   Your server will run at: [http://localhost:3000](http://localhost:3000)

---

## 🧑 User Create Schema (Example)
```json
{
    "email": "sakib.reciver@gamil.com",
    "password": "1445uIoG@",
    "name": "sakib"
}
```

---

## 📦 Parcel Create Schema (Example)
```json
{
  "receiver": {
    "name": "Ashik",
    "phone": "01912345678",
    "address": "Dhaka, Bangladesh",
    "userId": "688e0e2151e927e6300891fb"
  },
  "parcelType": "Electronics",
  "weight": 2.5,
  "deliveryAddress": "Chittagong, Bangladesh",
  "currentStatus": "Pending",
  "isCancelled": false,
  "isDelivered": false,
  "statusLogs": []
}
```

---

## 🚀 API Endpoints

**Base URL:** `http://localhost:3000/api/v1`

### 🔐 Authentication Routes

- **POST /auth/register:** Register a new user (Sender/Receiver)
- **POST /auth/login:** Log in a user
- **POST /auth/reset-password:** Reset the password of the logged-in user
- **POST /auth/logout:** Log out a user

### 🧑 User Routes

- **POST /users/register:** Register a new user (Sender/Receiver)
- **GET /users:** View the list of all users (Admin only)
- **PATCH /users/:id:** Update a user's details (Admin/Receiver/Sender)

### 📦 Parcel Routes

- **POST /parcels:** Create a new parcel (Sender only)
- **GET /parcels/all:** View the list of all parcels (Admin only)
- **GET /parcels/my:** View all parcels sent by you (Sender only)
- **GET /parcels/incoming:** View all parcels addressed to you (Receiver only)
- **GET /parcels/:id:** Get a single parcel's details (Any Authenticated)
- **PATCH /parcels/:id/cancel:** Cancel a parcel (Sender only, before delivery starts)
- **PATCH /parcels/:id/status:** Update a parcel's status (Admin only)

---

## 📝 Demo & Video

**Live Link:** [https://delivedge-r5e7tgc0l-engrsakib-projects.vercel.app/](https://delivedge-r5e7tgc0l-engrsakib-projects.vercel.app/)  
**Demo Video:** [Project Overview & Demo (LinkedIn)](https://www.linkedin.com/posts/engrsakib_delivedge-parcel-booking-system-project-activity-7357434464966238210-KvrE?utm_source=share&utm_medium=member_desktop&rcm=ACoAADVmnvABBjY2I6i0j9pRy_jfxnOKpinccD4)
**PostMan:** [Postman](https://drive.google.com/file/d/143kVUbPJ6fc8TiRfk3WQC2XlijAtn95_/view?usp=sharing)

---