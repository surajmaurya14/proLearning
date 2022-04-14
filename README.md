<p align="center">
  <img src="https://res.cloudinary.com/surajmaurya/image/upload/v1646301645/proLearning/logo.png" height="100" width="100" />
</p>
<h1 align="center">proLearning</h1>

<h3 align="center">proLearning is an online learning Web Application</h3>
 
 <p align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" />
  <img src=" https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" />
  
 </p>
 
----
<h3 align="center">Features</h3>

<div align="center">
  <p>⚡ Server-side rendering for course page with Next.js<br />
  🍪 Cookie-based authorization with JWT<br />
  👤 Dashboard for students and instructors<br />
  🖼️ Images, videos, notes in PDF format upload with AWS-S3<br />
  💳 Payments using Stripe with connect accounts for instructors<br />
  💻 Playground for HTML, CSS, JS<br />
  👨‍💻 Practice programming in C, C++, Java, Python, Javascript<br />
  🪵 Logging with winston<br />
  and a lot more..</p>
</div>

## Running Locally

Clone this repository and install dependencies by running:

```
npm install
#or
yarn install
#or
pnpm install
```

Create a new file named `config.env` with the following environment variables in the root of the project folder:

```
PORT = 3000
API = http://localhost:3000/api
DOMAIN = http://localhost:3000
MONGO_URI = mongodb://127.0.0.1:27017/proLearning
JWT_SECRET =

AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY =
AWS_REGION = ap-south-1
AWS_API_VERSION = 2010-12-01
AWS_BUCKET =

STRIPE_PUBLISHABLE_KEY =
STRIPE_SECRET_KEY =

STRIPE_REDIRECT_URL = http://localhost:3000/stripe/callback
STRIPE_SETTINGS_REDIRECT_URL = http://localhost:3000/instructor/earnings
STRIPE_PAYMENT_SUCCESS_URL = http://localhost:3000/stripe/success
STRIPE_PAYMENT_CANCEL_URL = http://localhost:3000/stripe/cancel

REDIS_CONNECTION = {redis: { port: 6379, host: "127.0.0.1", password: "" } }

EMAIL_FROM =
ADMIN_EMAIL =
```

Create a new file named `.env.local` with following configuration:

```
NEXT_PUBLIC_DOMAIN = http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
```

For development mode, run:

```
npm run dev
```

For production mode, run:

```
npm run build
npm start
```

Visit http://localhost:3000 or your custom port environment variable to view the app.

## Screenshots

![Banner Image](https://i.imgur.com/3BDmo0L.png)

|            Search Courses            |               Settings               |
| :----------------------------------: | :----------------------------------: |
| ![](https://i.imgur.com/K9uTJm9.png) | ![](https://i.imgur.com/b1Pcnok.png) |

|              Playground              |               Practice               |
| :----------------------------------: | :----------------------------------: |
| ![](https://i.imgur.com/2LPwLBM.png) | ![](https://i.imgur.com/EccOFfU.png) |

|           Enrolled Courses           |             Course Page              |
| :----------------------------------: | :----------------------------------: |
| ![](https://i.imgur.com/hBTwsMs.png) | ![](https://i.imgur.com/15OXVT0.png) |

|             Course Video             |        Course Coding Question        |
| :----------------------------------: | :----------------------------------: |
| ![](https://i.imgur.com/CENqzww.png) | ![](https://i.imgur.com/3NqnYo8.png) |

|             Course Notes             |             Course Quiz              |
| :----------------------------------: | :----------------------------------: |
| ![](https://i.imgur.com/4ZCjDTc.png) | ![](https://i.imgur.com/Jwetm20.png) |
