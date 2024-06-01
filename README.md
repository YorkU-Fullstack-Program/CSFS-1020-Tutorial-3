# Tutorial #3 - MySQL Integration, and Unit Tests

This exercise is going to once again build on the same nodejs server that we've slowly been building throughout these tutorial sessions.

In this tutorial the main focus is going to be to replace all of the logic we currently have which uses the `users` object in our constants file, and replace that with a database that we can use to persist data. That'll make sure we don't have re-create users when we start up our application

## Exercise #1 - Connecting Your Application to MySQL

### Introduction:

In this exercise we are going to setup the initial MySQL connection between our application and an instance of MySQL running in a container

### Setup:

Make sure you have the latest MySQL Docker image. Running the following command will accomplish this:
`docker pull mysql`
Start up your MySQL instance. The following command will start MySQL in a docker container. Note the below command sets your database password as `password`. Pick something secure for you're application and don't hide it in plain text:
`docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=mydb -p 3306:3306 -d mysql:latest`

Install the `mysql2-async` using npm install `mysql2-async`

After you've setup MySQL to run in a docker container try connecting with your database client of choice. I use TablePlus(https://tableplus.com/). Which has a very usable free tier.

### Instructions:

- Create a new folder in our application at the same level as `middleware` and `routes`. Call it `models`
- In `models`. Create two files, an `index.js` file which we will use to export the classes we write in `models` to the rest of our application, and `dbConnection.js`, which is where we will setup our database connection.
- In `dbConnection.js`, use the `mysql2-async` to create a `db` object which will be the connection point to the database in our application.
- Using a SQL client of your choice run a `CREATE TABLE` query to create a `user` which matches the schema of the User objects in constants

## Exercise #2 - Incorporate the User table in your Application

### Introduction:

Now that we have a database that we can connect to, and we have a table in our database. Now we need an extensible way to work with the data in our database. In this exercise we are going to be creating an extensible modular pattern (lots of buzz words), so that we can easily incorporate our database into our application.

### Instructions

- Create a new file in the models directory and call it User
- Write a javascript class called user, that will have the following static methods
  - `findById` - This function will take a number input and returns a user object
  - `findByUsername` - This function should take a User's username and returns a user object
- And the following instance methods
  - `save` - This function should save the content of the user object to the database
  - `update` - This function should should update the content of the user object in the database
  - `isPasswordCorrect` - This function will take in a string (password) and validate if it correctly matches the User's password
  - `logout` - This function should change the value on users `uuid` column, so that it no longer matches the value in the jwt.
  - `toJSON` - This function will return an JSON object with the content of the user object. That we can return in an API setting. AKA don't return the hashed password
- Use this new class to replace the Users constant that we have been using up until this point.

## Exercise #3 - Create a framework for Running SQL Migrations against your Database

### Introduction:

When you're working on an application for a long time, you're database will grow and change over time. As your development team grows you can't give everyone permission to run SQL against the production database to create table. We need to build out a system so that can handle modifying the schema of our database for us.

### Instructions:

- Install the `db-migrate` and `db-migrate-mysql` npm packages.
- In the migrations folder create a new `.sql` file that starts with the number `001` and then a name. Include the SQL to create our users table in there.
- In `migrate.js`, write a function that runs the SQL in our migrations folder in sequential file name order
- To ensure we don't run migrations against a database more than once, we will make our first migration called `000-initial.sql`. In that migration create a table with 3 columns. An `id` column, a `name` column to track the name of the last migration applied to the database, and a `applied_at` column to track the time it was applied.
- Run your migrations by called `node migrate.js`
- Update the rest of your application to use that `.env` file.

## Exercise #4 - Write Unit tests for our Existing APIs and our User model

### Introduction:

At this point we have a pretty functional application. We have Authorization, a few APIs with specific business logic, a way to store data, and a way to deploy and run migrations. We are missing one key component to our application before we can create the next billion dollar start up. We need to write tests for our code to ensure we can prevent developers from merging code.

### Setup:

Install the following libraries to help us write our unit tests:
`npm install --save-dev jest sinon supertest`

### Instructions:

- Write Unit tests for the API's we have wrote in our application.
- Ensure we have a way to mock the connection to the database.
- For APIs that have multiple paths, make sure our tests capture the "happy path" and the failure paths
