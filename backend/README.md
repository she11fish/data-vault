# Data Vault Backend

A FastAPI-based backend service for Data Vault, providing secure data storage, authentication, and data conversion capabilities.

## 🏗️ Architecture

The backend follows a modular architecture with the following components:

```
backend/
├── app/                    # Main application directory
│   ├── api/               # API routes and endpoints
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── data.py       # Data management endpoints
│   │   └── deps.py       # Dependency injection
│   ├── db/               # Database configuration
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   └── utils/            # Utility functions
├── docker-compose.yml     # Docker compose configuration
└── Dockerfile            # Docker build configuration
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL
- Docker (optional)

### Local Development Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Docker Setup

1. Build and run using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## 🔑 Authentication

The backend uses JWT-based authentication:

- `/api/auth/register`: Create a new user account
- `/api/auth/token`: Obtain JWT access token
- Protected routes require a valid JWT token in the Authorization header

## 📚 API Documentation

Once the server is running, access the API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main Endpoints

#### Authentication
- `POST /api/auth/register`: Register new user
- `POST /api/auth/token`: Login and get access token

#### Data Management
- `GET /api/data`: List user's data
- `POST /api/data`: Upload new data
- `GET /api/data/{id}`: Get specific data
- `DELETE /api/data/{id}`: Delete data

#### Data Conversion
- `POST /api/data/convert/{file_id}`: Convert data format
- `POST /api/data/image`: Process image data

## 🔧 Configuration

Key environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Input validation using Pydantic
- SQL injection protection via SQLAlchemy
- CORS middleware configuration
- Rate limiting on sensitive endpoints

## 🐳 Docker Support

The application can be containerized using the provided Dockerfile and docker-compose.yml. 