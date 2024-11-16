export function emailTemplate(jobs) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .job-listing {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <h1>Daily Job Listings</h1>
        ${jobs
          .map(
            (job) => `
          <div class="job-listing">
            <h2>${job.title}</h2>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Source:</strong> ${job.source}</p>
            <a href="${job.link}">View Job</a>
          </div>
        `
          )
          .join("")}
      </body>
    </html>
  `;
}
