# My Node.js Photo API

This project is a simple Node.js application that provides an API for managing photos. It allows users to retrieve all photos and get a specific photo by its ID.

## Now with Redis Pub/Sub Messaging Support

The application now supports Redis Pub/Sub messaging. When specific events occur (such as adding a new photo), a message is published to a Redis channel. Other services or processes can subscribe to this channel to receive real-time notifications.

### How Pub/Sub Works in This Project

- **Publisher:** Publishes messages when certain actions occur (e.g., a new photo is added).
- **Subscriber:** Listens for messages on specific channels and performs actions or logs notifications when events occur.

## Project Structure

```
my-nodejs-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains the logic for handling requests
│
│
subscriber logic
│       ├── publisher.js
│       └── subscriber.js
├── package.json              # npm configuration file
└── README.md                 # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-nodejs-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start Redis server (if not already running):
   ```
   redis-server
   ```

4. Start the application:
   ```
   npm start
   ```

## Pub/Sub Usage

- The publisher will send a message to the `photo-events` channel whenever a new photo is added.
- The subscriber listens to the `photo-events` channel and logs or handles notifications in real time.

You can run the subscriber separately (for example, in a different terminal):

```
node src/pubsub/subscriber.js
```

## API Usage

### Get All Photos

- **Endpoint:** `GET /photos`
- **Description:** Retrieves a list of all photos.

### Get Photo by ID

- **Endpoint:** `GET /photos/:id`
- **Description:** Retrieves a specific photo by its ID.
- **Parameters:**
  - `id`: The ID of the photo to retrieve.

## License

This project is licensed under the MIT License.
