# library_management_system

Pre-requisites
--------------

- Clone the git repo : git@github.com:Mithun05/library_management_system.git
- Make sure docker is running locally on the system

Backend Setup
-------------
- Open Terminal (Window-1).
- Navigate to the backend service directory
  cd libraryservicebackend
- Run the following commands to build and start the backend service:
  docker compose build
  docker compose up -d
- Once the postgres, web service is running, the backend APIs will be available at:
  http://localhost:8000/api/*

Frontend Setup
---------------

- Open Terminal (Window-2).
- Navigate to the frontend service directory
  cd libraryservicefrontend
- Run the following commands to build and start the frontend service:
  docker compose build
- Once the forntend service is running, the frontend application will be available at:
  http://localhost:3000/*

Typical Workflow : 
Remember to use member_id and book_uid while borrowing and returning book. (You will see this id's on the View options button)
  
