# Self-Pic: A Personal Image Hosting Server

This is a lightweight, self-hosted image server built with Node.js and Express. It allows you to upload images via an API and manage them through a simple web interface. All core logic is contained within this single repository, making it easy to deploy and maintain.

## Features

*   **Upload API**: Securely upload images via a `POST /upload` endpoint.
*   **Web Interface**: Browse, view, and manage your uploaded images through a web-accessible list.
*   **Thumbnail Generation**: Automatically creates thumbnails for uploaded images.
*   **Authentication**: Basic authentication protects your upload and image list endpoints.
*   **HTTPS Support**: Ready for production deployment with SSL/TLS encryption.
*   **Lazy Loading**: Efficiently loads thumbnails on the image list page for better performance.

## Prerequisites

*   Node.js (version 14 or higher recommended)
*   Yarn or npm

## Getting Started

### 1. Installation

Clone the repository and install the necessary dependencies.

```bash
git clone <repository-url>
cd <repository-directory>
yarn install
# or
npm install
```

**Note on `sharp`**: The `sharp` library is used for image processing. If you encounter network issues during installation, configure npm/yarn to use a mirror:

```bash
npm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
npm install
# or for yarn
yarn config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
yarn config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
yarn install
```

### 2. Configuration

The application uses environment variables for configuration. Create a `.env` file in the project root to set the following variables:

*   `PORT`: (Optional) The port the server will listen on. Defaults to `3999`.
*   `SECURE_USERNAME`: (Required) The username for basic authentication.
*   `SECURE_TOKEN`: (Required) The password/token for basic authentication.

Example `.env` file:
```env
PORT=3999
SECURE_USERNAME=myuser
SECURE_TOKEN=mysecretpassword
```

### 3. Running the Server

#### Development Mode

For development and debugging, use the built-in `nodemon` for auto-reloading:

```bash
yarn dev
# or
npm run dev
```

#### Production Mode

For production deployment:

1.  **SSL Certificates**: Place your SSL certificate (`img.pem`) and private key (`img.key`) in a folder named `keys` within the project root.
2.  **Process Manager (Recommended)**: Use a process manager like `pm2` to keep the application running.
    ```bash
    pm2 start npm --name "self-pic" -- run start
    ```
3.  **Direct Start**: Alternatively, you can start the server directly:
    ```bash
    yarn start
    # or
    npm run start
    ```

## Usage

Once the server is running:

1.  **Accessing the Image List**: Navigate to `https://your-domain.com/` in your browser. You will be prompted for the username and password you configured. This page lists all uploaded images.
2.  **Uploading an Image**: Use a tool like `curl` or a programming script to send a `POST` request to `https://your-domain.com/upload`.
    Example using `curl`:
    ```bash
    curl -u myuser:mysecretpassword -F "image=@/path/to/your/image.jpg" https://your-domain.com/upload
    ```
    A successful upload will return a JSON response with the URL of the uploaded image.
3.  **Viewing an Image**: Click the filename link on the image list page, or directly access the image via its URL: `https://your-domain.com/image/filename.jpg`.

## Project Structure

*   `index.js`: Main application entry point.
*   `uploader.js`: Handles image uploading and thumbnail generation.
*   `downloader.js`: Serves images and generates the image list HTML page.
*   `middlewares.js`: Contains Express middleware for CORS, logging, authentication, etc.
*   `const.js`: Defines constants and loads environment variables.
*   `logger.js`: A simple logging utility.
*   `public/`: Contains static assets like the favicon and the image list HTML template.
*   `uploads/`: (Created on first upload) The directory where uploaded images are stored.
*   `uploads/thumbnails/`: (Created on first upload) The directory where generated thumbnails are stored.

## Future Enhancements

- [ ] Automatic `uploads` / `keys` / `logs` folder creation
- [ ] Upload multiple images at once
- [ ] Uploading folder backup
- [ ] Maybe add a standalone upload button in image_list page

