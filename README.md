### Framework
- Express.js

### Plus Points
- Using JSON for interactions/ communication through APIs
	Sending response using `res.json({})` which send response in json form and for in comming requests I am using `body-parser.json()` in a middleware to parse the incoming requests which are in **application/json** form.  

- Using user token authentication for API access
	Using jwt (jsonwebtoken) package to authenticate user by providing them a token which will be send by the client in header named "Authorization"

### How to Run and Deploy
- Clone this repo, using git clone `https://github.com/jatin0814/jatinGupta_NodejsTask.git`
- Change Directory to `jatinGupta_NodejsTask`, using  `cd jatinGupta_NodejsTask`
- run `npm install` to install required node modules.

	**Deploy to Heroku**
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