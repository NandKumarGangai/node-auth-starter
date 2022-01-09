# Node JS starter app with all authentication methods.

## Tech stack:
1. Node
2. Express
3. JWT
4. Cookies
5. MongoDB
6. Mongoose

### Prerequisite:
1. Basic knowledge of Nodejs, ExpressJS and MongoDB.
2. To test this starter, we need `POSTMAN` app to be installed on your local machine.
3. For `MongoDB` database you either choose local databse or you can use `MongoDB Atlas` clous databse.
4. Make sure you have correct database `connection` string.

### To use this starter app follow below instructions.
1. Clone the repo `<url to clone repo>`.
2. `cd <repo name>` and run `npm i`.
3. Initially this may throw error for Database connectivity.
4. Before moving we need to set some configurations.  
  - Create a new directory `config` in root (if already not exist).
  - Create a new file `config/config.env`.

```sh
# Create config directory if not present already
mkdir config

# Create a new config file
touch ./config/config.env
```
5. In `config.env` file add below content/ variables.

```yml
# APP Config
# Port on which node app runs
PORT=4000
# NODE_ENV
NODE_ENV=development

# MongoDB config URL's
# MongoDB cloud database connection URL will be used in production env
# You can use the same for local env.(Check code config/db.js).
# <username> : Your MongoDb altas databse username.
# <password> : Password for your MongoDb altas databse username.
# <cluster_name> : Name of the cluster where you want to store the data.
# <db_name> : Name of database on where you want to store the data.
MONGO_URI=mongodb+srv://<username>:<password>@<cluster_name>.mongodb.net/<db_name>
MONGO_URL_DEV=mongodb://localhost:27017/<db_name>

# Encryption handles
# <salt> : The value to be used by JWT algorithms. Minimum it should be 10.
# <secret> : The secret value to be used for encrypt the password.
SALT=<salt>
JWT_SECRET=<secret>
JWT_EXPIRE=30m
JWT_COOKIE_EXPIRE=1
```

6. Once you have all the `config env` variables are set you can start exploring the app.
7. This app includes total 7 functionalities related to auth.
  Which we will be checking one by one.

#### Register new user 

```js
---- ---- ---- ---- ----
title: Register New User
---- ---- ---- ---- ----
/**
 * @description Register new user
 * @route       POST /api/v1/auth/register
 * @access      PUBLIC
 */

/* 
test request body:
*/
{
    "name": "My Name Is Nandkumar",
    "email": "myname@test.com",
    "password": "Str0ngp@ssword",
    "mobile": "9632587410"
}
```

#### Login as a existing user 

```js
---- --- --- ----
title: Login user
---- --- --- ----
/**
 * @description Login user
 * @route       POST /api/v1/auth/login
 * @access      Public
 */

/* 
test request body:
*/
{
    "email": "myname@test.com",
    "password": "Str0ngp@ssword",
}
```

#### Log out

```js
---- --- --- ------ --- --- ----
title: Logout of current session
---- --- --- ------ --- --- ----
/**
 * @description Log user out / clear cookie
 * @route       GET /api/v1/auth/logout
 * @access      Public
 */

/* 
test request body:
*/
{}
```

#### Get user details

```js
---- --- --- ------ ---- ---- ----
title: Get details of current user
---- --- --- ------ ---- ---- ----
/**
 * @description Get current logged in user
 * @route       GET /api/v1/auth/me
 * @access      Protected
 */

/* 
test header should include JWT token received after login in headers as below.
*/
{ Authorization: `Bearer ${token}`}
/* 
test request body:
*/
{}
```

#### Update user details

```js
---- ---- ----- ------ ---- ---- ----
title: Update details of current user
---- ---- ----- ------ ---- ---- ----
/**
 * @description Update user details
 * @route       PUT /api/v1/auth/updatedetails
 * @access      Protected
 */

/* 
test header should include JWT token received after login in headers as below.
*/
{ Authorization: `Bearer ${token}`}
/* 
test request body:
*/
{
    "name": "My new name",
    "mobile": "9988774455"
}
```

#### Update user password

```js
---- ---- ----- ------ ---- ---- ----
title: Update password of current user
---- ---- ----- ------ ---- ---- ----
/**
 * @description Update password of logged in user
 * @route       PUT /api/v1/auth/updatepassword
 * @access      Protected
 */

/* 
test header should include JWT token received after login in headers as below.
*/
{ Authorization: `Bearer ${token}`}
/* 
test request body:
*/
{
    "currentPassword": "Str0ngP@ssword",
    "newPassword": "Str0ngerP@ss0rd"
}
```

#### Forgot password

```js
---- ---- ----- ------ ---- ---- ----
title: Forgot password
---- ---- ----- ------ ---- ---- ----
/**
 * @description Forgot password, send password reset link
 * @route       POST /api/v1/auth/forgotpassword
 * @access      Public
 */

/* 
test request body:
*/
{
    "email": "myname@test.com",
}
```

<sub>NOTE: This will return a reset password link with reset token. Use that link in below reset password method.</sub>

#### Reset password

<sup>NOTE: You should have reset link which is created in above method.</sup>

```js
---- ---- ----- ------ ---- ---- ----
title: Reset password
---- ---- ----- ------ ---- ---- ----
/**
 * @description Reset password
 * @route       PUT /api/v1/auth/resetpassword/:resettoken
 * @access      Public
 */

/* 
test request body:
*/
{
    "newPassword": "Str0ngerP@ss0rd"
}
```