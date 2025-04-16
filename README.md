# JobQuest - A Simple Job Search Application

This is a basic job search web application that allows users to search for jobs, filter, and sort results. The application uses the JSearch API from RapidAPI to fetch job listings.

## Features

- Search for jobs by title, keywords, or company
- Filter by location
- Sort by relevance, date, or salary
- Filter by job type (full-time, part-time, etc.)
- View job details including description, salary, and location
- Apply directly through external links

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript
- API Integration: JSearch API from RapidAPI
- Deployment: Nginx, Load Balancer (Lb01)

## Local Setup

Click [here](https://www.youtube.com/watch?v=GWvZeSn8z5k) for a short demo video.

To run the application locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone <repository_url>
   cd JobQuest
   ```

2. **Set up the API key:**

   - Create a `config.js` file in the root directory.
   - Add the following line, replacing `your_api_key_here` with your actual API key:
     ```js
     const config = { API_KEY: "your_api_key_here" };
     export default config;
     ```

3. **Start a local web server:**
   - You can use Python’s built-in server:
     ```sh
     python3 -m http.server 8000
     ```
   - Then open your browser at `http://localhost:8000/index.html`

## Deployment

### Web Servers (Web01 and Web02)

The application has been deployed to two web servers for redundancy:

1. Created directory `/var/www/html/jobquest` on both servers

mkdir -p /var/www/html/jobquest

2. Copied all application files to both servers

```
scp -r ./jobquest/* ubuntu@52.91.14.9:/var/www/html/jobquest/
scp -r ./jobquest/* ubuntu@54.196.81.191:/var/www/html/jobquest/
```

3. Set permissions to 755 for all files, for security and execution

```
sudo chmod -R 755 /var/www/html/jobquest
```

### Load Balancer (Lb01)

HAProxy is used to load balance traffic between Web01 and Web02 with support for both HTTP and HTTPS.

#### HAProxy Config (/etc/haproxy/haproxy.cfg):

```
frontend http
    bind *:80
    default_backend web-server

frontend https
    bind *:443 ssl crt /etc/ssl/private/haproxy.pem
    default_backend web-server

backend web-server
    balance roundrobin
    server web01 52.91.14.9:80 check
    server web02 54.196.81.191:80 check

```

- HTTPS is enabled using the SSL certificate at `/etc/ssl/private/haproxy.pem`

- Traffic is load-balanced using the `roundrobin` method

- `check` ensures backend servers are health-checked regularly

### Accessing the Application

The application can be accessed using the address:
http://mahlet.tech


## Credits

- [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)

