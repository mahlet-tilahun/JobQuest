import config from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const apiKey = config.API_KEY; // Get API key from config.js
  // DOM elements
  const jobTitleInput = document.getElementById("job-title");
  const locationInput = document.getElementById("location");
  const searchBtn = document.getElementById("search-btn");
  const sortBySelect = document.getElementById("sort-by");
  const jobTypeSelect = document.getElementById("job-type");
  const loadingElement = document.getElementById("loading");
  const errorMessageElement = document.getElementById("error-message");
  const resultsCountElement = document.getElementById("results-count");
  const jobsCountElement = document.getElementById("jobs-count");
  const jobsContainer = document.getElementById("jobs-container");

  // Store job listings globally so we can filter/sort them
  let allJobs = [];

  // Event listeners
  searchBtn.addEventListener("click", searchJobs);
  sortBySelect.addEventListener("change", applySortAndFilter);
  jobTypeSelect.addEventListener("change", applySortAndFilter);

  // Function to search for jobs
  function searchJobs() {
    const jobTitle = jobTitleInput.value.trim();
    const location = locationInput.value.trim();

    if (!jobTitle) {
      showError("Please enter a job title, keyword, or company name");
      return;
    }

    // Show loading indicator
    loadingElement.classList.remove("hidden");
    errorMessageElement.classList.add("hidden");
    resultsCountElement.classList.add("hidden");
    jobsContainer.innerHTML = "";

    // API call parameters
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };

    // Build query string
    let query = jobTitle;
    if (location) {
      query += ` in ${location}`;
    }

    // Fetch job listings from the API
    fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
        query
      )}&page=1&num_pages=1`,
      options
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then((data) => {
        loadingElement.classList.add("hidden");

        if (!data.data || data.data.length === 0) {
          showError("No jobs found. Try different keywords or location.");
          return;
        }

        // Store job data globally
        allJobs = data.data;

        // Show results count
        jobsCountElement.textContent = allJobs.length;
        resultsCountElement.classList.remove("hidden");

        // Apply initial sort and filter
        applySortAndFilter();
      })
      .catch((error) => {
        loadingElement.classList.add("hidden");
        showError("Error fetching job listings. Please try again later.");
        console.error("Error:", error);
      });
  }

  // Function to apply sorting and filtering
  function applySortAndFilter() {
    // If no jobs, do nothing
    if (allJobs.length === 0) return;

    // Make a copy of the job array for manipulation
    let filteredJobs = [...allJobs];

    // Apply job type filtering
    const selectedJobType = jobTypeSelect.value;
    if (selectedJobType !== "all") {
      filteredJobs = filteredJobs.filter((job) => {
        const jobType = job.job_employment_type.toLowerCase();
        return jobType.includes(selectedJobType.toLowerCase());
      });
    }

    // Apply sorting
    const sortBy = sortBySelect.value;
    if (sortBy === "date") {
      filteredJobs.sort((a, b) => {
        const dateA = new Date(a.job_posted_at_datetime_utc || 0);
        const dateB = new Date(b.job_posted_at_datetime_utc || 0);
        return dateB - dateA; // newer jobs first
      });
    } else if (sortBy === "salary") {
      filteredJobs.sort((a, b) => {
        const salaryA = a.job_min_salary || 0;
        const salaryB = b.job_min_salary || 0;
        return salaryB - salaryA; // higher salary first
      });
    }

    // Update UI with filtered/sorted jobs
    displayJobs(filteredJobs);

    // Update count
    jobsCountElement.textContent = filteredJobs.length;
  }

  // Function to display jobs in the UI
  function displayJobs(jobs) {
    jobsContainer.innerHTML = "";

    jobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";

      // Format date
      const postedDate = job.job_posted_at_datetime_utc
        ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
        : "Unknown date";

      // Format salary
      let salaryText = "Salary not specified";
      if (job.job_min_salary && job.job_max_salary) {
        salaryText = `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`;
      } else if (job.job_min_salary) {
        salaryText = `From $${job.job_min_salary.toLocaleString()}`;
      } else if (job.job_max_salary) {
        salaryText = `Up to $${job.job_max_salary.toLocaleString()}`;
      }

      // Create job card HTML
      jobCard.innerHTML = `
                <div class="date">Posted: ${postedDate}</div>
                <div class="job-title">${job.job_title}</div>
                <div class="company">${job.employer_name}</div>
                <div class="location">${job.job_city || ""} ${
        job.job_state || ""
      } ${job.job_country || ""}</div>
                <div class="job-type">${
                  job.job_employment_type || "Not specified"
                }</div>
                <div class="salary">${salaryText}</div>
                <div class="description">${
                  job.job_description
                    ? job.job_description.substring(0, 200) + "..."
                    : "No description available"
                }</div>
                <a href="${job.job_apply_link}" target="_blank">
                    <button class="apply-btn">Apply Now</button>
                </a>
            `;

      jobsContainer.appendChild(jobCard);
    });

    if (jobs.length === 0) {
      jobsContainer.innerHTML =
        '<p style="text-align: center; padding: 20px;">No jobs match your filters. Try changing your search criteria.</p>';
    }
  }

  // Function to show error messages
  function showError(message) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.remove("hidden");
  }
});
