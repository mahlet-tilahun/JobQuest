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

Click [here](https://www.youtube.com/watch?v=GWvZeSn8z5k) for the demo video.


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
     python3 -m http.server 8080
     ```
   - Then, open `http://localhost:8080` in your browser.
     
## Deployment

### Web Servers (Web01 and Web02)

The application has been deployed to two web servers for redundancy:

1. Created directory `/var/www/html/jobquest` on both servers
2. Copied all application files to both servers
3. Set permissions to 755 for all files

### Load Balancer (Lb01)

Configured Nginx load balancer to distribute traffic between Web01 and Web02:

1. Created upstream server group including both web servers
2. Configured proxy pass to forward requests to appropriate server
3. Verified configuration using `nginx -t`
4. Restarted Nginx service

### Accessing the Application

The application can be accessed using the address:
http://mahlet.tech

## Credits

- [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
