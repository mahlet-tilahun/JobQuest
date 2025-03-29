# Simple Job Search Application

This is a basic job search web application that allows users to search for jobs, filter, and sort results. The application uses the JSearch API from RapidAPI to fetch job listings.

## Features

- Search for jobs by title, keywords, or company
- Filter by location
- Sort by relevance, date, or salary
- Filter by job type (full-time, part-time, etc.)
- View job details including description, salary, and location
- Apply directly through external links

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSearch API from RapidAPI

## Local Setup

## Deployment

### Web Servers (Web01 and Web02)

The application has been deployed to two web servers for redundancy:

1. Created directory `/var/www/html/job-search-app` on both servers
2. Copied all application files to both servers
3. Set permissions to 755 for all files

### Load Balancer (Lb01)

Configured Nginx load balancer to distribute traffic between Web01 and Web02:

1. Created upstream server group including both web servers
2. Configured proxy pass to forward requests to appropriate server
3. Verified configuration using `nginx -t`
4. Restarted Nginx service

### Accessing the Application

The application can be accessed using the load balancer's address:
http://

## Credits

- [JSearch API on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
