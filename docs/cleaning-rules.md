# Cleaning Rules

Title normalization maps messy titles such as `MERN Ninja`, `Fullstack JS Engineer`, `Jr Backend Dev` and `React Front-End Developer` into normalized product roles.

Role classification supports Backend Developer, Frontend Developer, Full Stack Developer, Data Analyst, Data Scientist, AI Engineer, DevOps Engineer, Mobile Developer, QA Engineer, Software Engineer and Unknown.

Salary parsing handles formats such as `PKR 80k - 120k`, `Rs. 100,000 per month`, `1.5 lac`, `$500 - $900` and `200k+`. Competitive or undisclosed salaries intentionally become null values.

Skill extraction uses aliases such as `reactjs -> React`, `nodejs -> Node.js`, `postgres -> PostgreSQL`, `mongo -> MongoDB`, `dotnet -> .NET` and `ci cd -> CI/CD`.

Duplicate detection uses source job ID when available, then normalized title, company, city and description hash.
