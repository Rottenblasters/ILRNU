# ILRNU


### System Requirements

- You should have NodeJs and Postman installed
- After installation, come into the root directory of the assignment (having README.md file)
- In the command line run - npm install package.json
- Then run the server

### How to test
- There are two main endpoints user & admin both have similar functionality
- POST (to create a user/admin) request to localhost:3000/user localhost:3000/admin -
    body of the request = { name, email, password, phoneNo }
- GET (to login a user/admin) request to localhost:3000/user or localhost:3000/admin -
    body of the request = { email, password }
- PUT (to update a user/admin) request to localhost:3000/user or localhost:3000/admin -
    body of the request = { oldPassword, newPassword }
- DELETE (to delete a user/admin) request to localhost:3000/user or localhost:3000/admin
