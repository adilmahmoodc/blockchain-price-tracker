# Blockchain Price Tracker

A NestJS application that tracks cryptocurrency prices and sends alerts when the price exceeds a set threshold. The app integrates PostgreSQL for data storage and uses MailDev to simulate email notifications during development.

## Features

- Tracks prices of cryptocurrencies (Ethereum and Polygon)
- Sets price alerts for upward/downward movement
- Sends email alerts when price exceeds the set threshold
- Uses MailDev for email previews during development
- Built using NestJS, TypeORM, PostgreSQL, and Nodemailer

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.x or higher)
- **yarn** (v1.22.x or higher)
- **PostgreSQL** (for the database)

---

## Installation

Follow these steps to set up and run the project locally:

### 1. Clone Project

```shell
  git clone <repository-url>
  cd blockchain-price-tracker
```

### 2. Install PostgreSQL

  You need to have PostgreSQL installed to store the price tracker data. If PostgreSQL is not installed, you can install it using the following commands:

  **On Ubuntu:**

  - sudo apt update
  - sudo apt install postgresql postgresql-contrib

  **On macOS (using Homebrew):**

  - brew install postgresql

  **On Windows:**
  Download and install PostgreSQL from the official website:
  https://www.postgresql.org/download/windows/

### 3. Create a PostgreSQL Database

  After installing PostgreSQL, create a database named "price_tracker"

### 4.  Environment Variables
  In order to properly connect to your PostgreSQL database and external services, you need to configure the environment variables in the .env file. There is a .env.example file.
  First you need to create a new .env file and copy .env.emaple content in .env file and update the following:

  **1**. Database Configuration:
    Add your own PostgreSQL credentials in the .env file. Specifically, you'll need to update the following:
  ```shell
    - DB_USERNAME: Your PostgreSQL username (default is often postgres).
    - DB_PASSWORD: The password for your PostgreSQL user.
    - DB_HOST: The host where your database is running (typically localhost for local development).
    - DB_DATABASE: The name of the database, which should be price_tracker (or any name you have chosen).
    - SMTP_HOST: host for email sevice
    - SMTP_PORT: port for email sevice
  ```

  **2**. Moralis API Key:
    A free Moralis API key is already included in the .env.example file for fetching cryptocurrency data, but you can change it if you prefer to use your own API key. Simply sign up for a Moralis account and get your API key, then update the following line in the .env file.

### 5. Docker Setup

Install [Docker](https://docs.docker.com/) for [Mac](https://docs.docker.com/desktop/install/mac-install/) or [Windows](https://docs.docker.com/desktop/install/windows-install/), then go to the project folder and run:

```shell
docker compose build
```

```shell
docker compose up
```

### 6. Accessing the Application

  **Swagger UI**
    Once the app is running, you can access the Swagger UI to explore the API at:

    http://localhost:3000/api/

  **MailDev Email Preview**
    For email testing, visit:

    http://localhost:1080/

    MailDev intercepts all emails sent by the app and displays them in the browser. No emails will be sent to real recipients during development.
