# 3D Printing Materials API

This API allows you to manage materials used in 3D printing, including adding, updating, retrieving, and deleting materials. It also supports image upload for each material using imgbb.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Documentation URL: [Postman API Documentation](https://documenter.getpostman.com/view/25442205/2sA3drHaC5)
## Features

- Add new materials with image uploads.
- Update existing materials and optionally update their images.
- Retrieve all materials or a single material by ID.
- Delete materials by ID.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine.
- MongoDB Atlas account (or a local MongoDB instance).
- An imgbb account with an API key.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/3d-printing-materials-api.git
    cd 3d-printing-materials-api
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root of the project and add the following environment variables:

    ```env
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    IMGBB_API=your_imgbb_api_key
    ```

2. Ensure you have a MongoDB Atlas cluster or a local MongoDB instance running. If using MongoDB Atlas, your connection URI should look something like this:

    ```env
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    ```

    Replace `<username>`, `<password>`, and other parameters with your actual MongoDB Atlas credentials.

## Running the Server

1. Start the server:

    ```bash
    node index.js
    ```

2. The server will start on the port specified in the `.env` file (default is 5000). You should see a message like this:

    ```bash
    Running on port: 5000
    Pinged your deployment. You successfully connected to MongoDB!
    ```

## API Endpoints

### Get All Materials

- **Endpoint:** `GET /materials`
- **Description:** Retrieve a list of all materials.
- **Response:**

    ```json
    [
        {
            "_id": "60c72b2f9b1d8a001c8e4b77",
            "name": "PLA",
            "technology": "FDM",
            "colors": ["Red", "Blue", "Green"],
            "pricePerGram": 0.03,
            "applicationTypes": ["Prototyping", "Educational"],
            "imageUrl": "https://example.com/images/pla.jpg"
        },
        ...
    ]
    ```

### Get Material by ID

- **Endpoint:** `GET /materials/:id`
- **Description:** Retrieve a material by its ID.
- **Response:**

    ```json
    {
        "_id": "60c72b2f9b1d8a001c8e4b77",
        "name": "PLA",
        "technology": "FDM",
        "colors": ["Red", "Blue", "Green"],
        "pricePerGram": 0.03,
        "applicationTypes": ["Prototyping", "Educational"],
        "imageUrl": "https://example.com/images/pla.jpg"
    }
    ```

### Create a New Material

- **Endpoint:** `POST /materials`
- **Description:** Create a new material.
- **Request:**

    ```json
    {
        "name": "PLA",
        "technology": "FDM",
        "colors": ["Red", "Blue", "Green"],
        "pricePerGram": 0.03,
        "applicationTypes": ["Prototyping", "Educational"],
        "imageUrl": file // Upload image file
    }
    ```

- **Response:**

    ```json
    {
        "acknowledged": true,
        "insertedId": "60c72b2f9b1d8a001c8e4b77"
    }
    ```

### Update a Material by ID

- **Endpoint:** `PUT /materials/:id`
- **Description:** Update an existing material's details, optionally updating its associated image.
- **Request:**

    ```json
    {
        "name": "PLA Updated",
        "technology": "FDM",
        "colors": ["Red", "Blue"],
        "pricePerGram": 0.04,
        "applicationTypes": ["Prototyping"],
        "imageUrl": file // Optional: Upload new image file
    }
    ```

- **Response:**

    ```json
    {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
    }
    ```

### Delete a Material by ID

- **Endpoint:** `DELETE /materials/:id`
- **Description:** Delete a material by its ID.
- **Response:**

    ```json
    {
        "acknowledged": true,
        "deletedCount": 1
    }
    ```

## License

This project is licensed under the MIT License.
