Here's the corrected README markdown:

---

# Tutorial #3 - MySQL Integration, Unit Tests, and Docker

This exercise will once again build on the Node.js server we've been developing throughout these tutorials.

In this tutorial, our main focus will be to replace the logic that uses the `users` object in our constants file. We'll replace it with a database to persist data, ensuring we don't need to recreate users every time we start our application.

## Exercise #1 - Connecting Your Application to MySQL

### Introduction:
In this exercise, we'll set up the initial MySQL connection between our application and an instance of MySQL running in a container.

### Setup:
Ensure you have the latest MySQL Docker image. Execute the following command to do this:
```
docker pull mysql
```
Start your MySQL instance using the command below. Note: This command sets your database password as `password`. Choose a secure password for your application and avoid storing it in plain text:
```
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=mydb -p 3306:3306 -d mysql:latest
```

Install `mysql2-async` with:
```
npm install mysql2-async
```

After setting up MySQL in a Docker container, try connecting with your preferred database client. I use [TablePlus](https://tableplus.com/), which offers a generous free tier.

### Instructions:
1. Create a new folder in our application at the same level as `middleware` and `routes`. Name it `models`.
2. Within `models`, create two files: `index.js` (to export classes we write in `models` to the rest of our application) and `dbConnection.js` (to set up our database connection).
3. In `dbConnection.js`, utilize `mysql2-async` to create a `db` object, which will serve as our connection point to the database.
4. Using a SQL client of your choice, execute a `CREATE TABLE` query to create a `users` table, ensuring it matches the schema of the User objects in constants.

## Exercise #2 - Incorporate the User Table into Your Application

### Introduction:
With our database connection established and a table ready, we need an extensible pattern to interact with our database data. This exercise focuses on creating a scalable modular pattern to effortlessly integrate our database into the application.

### Instructions:
1. Create a new file in the `models` directory named `User.js`.
2. Write a JavaScript class named `User`. This class should have the following static methods:
   - `findById`: Accepts a number and returns a user object.
   - `findByUsername`: Accepts a username and returns a user object.
3. The class should also have these instance methods:
   - `save`: Saves the user object to the database.
   - `update`: Updates the user object in the database.
   - `isPasswordCorrect`: Validates if the input password matches the User's password.
   - `logout`: Alters the value in the user's `uuid` column, ensuring it doesn't match the JWT value.
   - `toJSON`: Returns a JSON representation of the user object without exposing sensitive data like the hashed password.
4. Use this new class to replace the `Users` constant we've been employing.

## Exercise #3 - Create a Framework for Running SQL Migrations Against Your Database

### Introduction:
As your application evolves and your team grows, database modifications will become frequent. Not everyone should have direct access to make changes in the production database. Thus, we need a system to manage schema modifications.

### Extra Info:
For production applications, consider using a professional-grade library, like Prisma, instead of building this from scratch. Prisma is an ORM (Object-Relational Mapper) with an excellent migration sub-library. If you're unfamiliar with ORM, explore this concept; it's a prevalent industry pattern for applications interfacing with databases.

### Instructions:
1. Create a file named `migrate.js` and a directory called `migrations`.
2. In the `migrations` folder, make a new `.sql` file starting with the number `001` followed by a descriptive name. Write the SQL to create our `users` table in this file.
3. In `migrate.js`, design a function that executes SQL files from the `migrations` folder in sequential order.
4. To avoid applying migrations multiple times, our first migration should be `000-initial.sql`. This migration should create a table with three columns: `id`, `name` (to track the last applied migration), and `applied_at` (to record the application time).
5. Execute your migrations with:
```
node migrate.js
```

## Exercise #4 - Write Unit Tests for Our Existing APIs and the User Model

### Introduction:
Our application now has authorization, various APIs with specific business logic, data storage capabilities, deployment, and migration management. However, one crucial component is missing: unit tests. We need these tests to prevent the integration of faulty code.

### Setup:
Install the required libraries for unit testing:
```
npm install --save-dev mocha chai chai-http sinon
```

### Instructions:
1. Write unit tests for the APIs in our application.
2. Implement a mechanism to mock the database connection.
3. For multi-path APIs, ensure tests cover both the "happy path" and potential failure paths. 
