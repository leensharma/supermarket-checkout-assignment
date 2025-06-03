# Supermarket Checkout System

A TypeScript implementation of a supermarket checkout system with dynamic pricing rules stored in MongoDB.

## Features

- Scan items by SKU
- Calculate totals with special pricing rules
- Rules stored in MongoDB (can be updated without code changes)
- Dockerized environment

## Setup

## Clone repository

```
git clone https://github.com/yourusername/supermarket-checkout.git

cd supermarket-checkout
```

# Install dependencies

```
npm install
```

## Configuration

Create a .env file in the root and put your env as given in .env.example

## Running the Application

## 🔧 Development Mode

npm run dev

## 🏭 Production Mode

```
npm run build

npm start
```

## 🐳 With Docker

```
docker-compose up -d
```

## API Endpoints

```
- `POST /checkout/scan` - Scan an item
  - Body: `{ "sku": "A" }`

- `GET /checkout/total` - Get current total

- `GET /checkout/reset` - reset current total
```

## Testing

```
Run tests with: `npm test`
```

## Run Tests with Coverage Report

```
npm test -- --coverage
```

## Sample Pricing Rules

- A: 50 each, 3 for 130
- B: 30 each, 2 for 45
- C: 20 each (no special)
- D: 15 each (no special)

## Example Calculations

| Items Scanned | Total Price |
| ------------- | ----------- |
| A, B          | 80          |
| A, A, A       | 130         |
| B, B, B       | 75          |
