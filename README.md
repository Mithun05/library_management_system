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
  docker compose up 
  (if faces any issues to start up the server then simply run npm install from the command line first if you don't see node_modules folder in the directory itself)
- Once the forntend service is running, the frontend application will be available at:
  http://localhost:3000/*

Typical Workflow : 
Remember to use member_id and book_uid while borrowing and returning book. (You will see this id's on the View options button)


Few of the locally tested screenshots are attached here.
<img width="1560" height="864" alt="Screenshot 2026-02-20 at 10 45 01 PM" src="https://github.com/user-attachments/assets/7434026b-38c7-4f25-86df-a748dec4cdd1" />

<img width="1669" height="726" alt="Screenshot 2026-02-20 at 10 44 50 PM" src="https://github.com/user-attachments/assets/ea9babb8-e311-400c-8776-b53c7b780f1c" />

<img width="1723" height="614" alt="Screenshot 2026-02-20 at 10 44 39 PM" src="https://github.com/user-attachments/assets/6514cf51-5149-4b7e-b63e-83f79938d5c6" />

<img width="1703" height="715" alt="Screenshot 2026-02-20 at 10 44 14 PM" src="https://github.com/user-attachments/assets/f4c37b7c-df79-4a1a-8f70-c8cbf38ce0db" />

Please reach out to if any questions. 
  
