### Framework
- Express.js

### Packages

- bcryptjs 
Using it to store passwords in form of **hash** in database (MongoDB).

- express-validator
Using is to **validate user input** such as email, password length and more.

- jsonwebtoken
Using it to generate token for **authentication**.
- multer
Using it to handling multipart/form-data (**uploading files**).

- multer-gridfs-storage 
Using it for Multer to store **uploaded files directly to MongoDb**.


### Plus Points
- Using JSON for interactions/ communication through APIs
	Sending response using `res.json({})` which send response in json form and for in comming requests I am using `body-parser.json()` in a middleware to parse the incoming requests which are in **application/json** form.  

- Using user token authentication for API access
	Using jwt (jsonwebtoken) package to provide token to user by which they can authenticate themself. Token will generate when user submit right credential and then send to user and then user need to send token with every request by which our api can authorise them. Token need to send by the client in header named "Authorization"

### How to Run Test and Deploy
- Clone this repo, using git clone `https://github.com/jatin0814/jatinGupta_NodejsTask.git`
- Change Directory to `jatinGupta_NodejsTask`, using  `cd jatinGupta_NodejsTask`
- run `npm install` to install required node modules.
- Now run `npm start` it starts local server ( by default on port 3000)

- #### End Points 
	- **For Patients**
``` GET   /patient```     ( Fetching all the patients in an order for a single psychiatrist )
 ``` GET    /patient/stats``` { Fetch the count of how many patients are registered for each psychiatrist in a hospital. This should return, hospital name, psychiatrist name, patients count. }
``` POST /patient/login``` {  Patient Login }
``` POST /patient/register``` { Register Patients }
``` POST``` /patient/edit/:id { Edit existing Patient}

	- **For Psychiatrist**
``` POST  /login ``` { Psychiatrist Login }
``` POST /resgister``` { Psychiatrist Register }


####**Deploy to Heroku**
- First create an app on heroku and install heroku CLI.
- Change directory to your current project directory
- Open terminal and run  `heroku login` and follow the prompts to create a new SSH public key.
- Initialize a git repository using command `git init`  and then run `heroku git:remote -a {your app name}`
- Deploy your application, run the following commands 
```
 git add .
 git commit -m "{commit message}"
 git push heroku master
```