# Web3 Dashboard Backend

## Overview

The Web3 Dashboard Backend is a NestJS application that provides APIs for user authentication and project management (tokens and NFTs). This application includes user management, project tracking, and authentication using Web3 options.

## Features

- **User Authentication**: Authenticate users via common Web3 options.
- **Project Management**: Manage and track token and NFT projects.

## Getting Started

### Prerequisites

- Node.js
- Docker (for running PostgreSQL)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/edvardg/web3-dashboard-backend.git
   cd web3-dashboard-backend

2. **Install dependencies**:
   ```bash
    npm install

3. **Configure the environment variables**:
   ```env
    TYPEORM_HOST=db
    TYPEORM_PORT=5432
    TYPEORM_USERNAME={db username}
    TYPEORM_PASSWORD={db password}
    TYPEORM_DATABASE={db name}}
    JWT_SECRET={jwt secret}


4. **Start the Docker containers**:
   ```bash
   // Update environment variables in `docker-compose.yml` file and run:
    docker-compose up -d

5. **Run the migrations**:
   ```bash
    npm run migration:run
    
6. **Start the application**:
    ```bash
   npm run start


### API Documentation

For detailed API endpoints and usage, please refer to the Swagger API Documentation available at `/api-doc`.

### Project Structure

#### Modules

- **Users Module**: Manages user-related functionalities including authentication and tracking projects.
- **Projects Module**: Manages project-related functionalities including listing and searching projects.

#### Common

- **Guards**: Security features like JWT authentication.
- **Decorators**: Custom decorators like Ethereum address validation.
- **Strategies**: Passport strategies for authentication.
- **Exceptions**: Custom exceptions for error handling.
- **Types**: Common types used across the application.
