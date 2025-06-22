# 📖 BookStack Library Management API

## BookStack :

BookStack is a RESTful API built with Express, TypeScript, and MongoDB for managing books in a digital library. It features robust schema validation, availability checks before borrowing, custom methods to update book copies, Mongoose middleware for due date updates, and flexible filtering. Key functionalities include book CRUD operations, borrowing with quantity deduction, and insightful borrow summaries using aggregation. [Live Link](https://github.com/shorif2/bookstack-server.git)

## Technologies are used for this project:

1. **Express**
2. **TypeScript**
3. **MongoDB**
4. **Mongoose**

## 🔧 Key featueres of this project:

- Properly schema validation
- Availability control on before borrow a book
- Summary using aggregation
- Update book copies with costome Instant method
- Mongoose post hook middlewar to update dueDate
- Filtering features

#### 🚀 Getting Started
✅ Prerequisites
Ensure you have the following installed:
-Node.js (v18+ recommended)
-MongoDB (Atlas or local)
-Git
📦 Installation
```sh
# 1. Clone the repository
git clone https://github.com/your-username/bookstack-server.git
cd bookstack-server

# 2. Install dependencies
npm install
```
⚙️ Environment Variables
Create a .env file in the root directory and add your MongoDB URI like below:

```sh
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

```
💻 Development
Run the server with hot-reloading using:

```sh
npm run dev

```
This will use ts-node-dev to watch and restart on file changes.

🛠 Build
To compile the TypeScript code into JavaScript:

```sh
npm run build

```
Compiled files will appear in the dist/ directory.

🌐 Production
To run the compiled server:

```sh
node dist/server.js

```
Compiled files will appear in the dist/ directory.


### 📁 API Endpoints

### Create Book

**POST** `/api/books`

#### Request:

```sh
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

### Get All Books

**GET** `/api/books`

Supports filtering, and sorting.

#### Example Query:

`/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Query Parameters:

- `filter`: Filter by genre
- `sort`: `asc` or `desc`
- `limit`: Number of results (default: 10)

#### Response:

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    {...}
  ]
}
```

---

### Get Book by ID

**GET** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

### Update Book

**PUT** `/api/books/:bookId`

#### Request:

```json
{
  "copies": 50
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

---

### Delete Book

**DELETE** `/api/books/:bookId`

#### Response:

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

---

### Borrow a Book

**POST** `/api/borrow`

### NOTE:

Bfore borrwo this route will verify the book available copies then deduct the requested quantity from book's copies.
If copies become 0 then availability will be false then finally book borrow will be success.

#### Request:

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

---

### Borrowed Books Summary (Using Aggregation)

`GET /api/borrow`

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

### Generic Error Response

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

💡 I face many challage to create this bookstack api however I enjoy this. Hopefully this document is clear to understand. Thank you! 💖

<p align="center">
  Made with 💖 using Express, TypeScript, and MongoDB
</p>

###
