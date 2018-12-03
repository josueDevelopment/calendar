const fs=require("fs");
const readline=require("readline");
const {google}=require("googleapis");
const TOKEN_DIR="./token_auth";
const TOKEN_PATH=TOKEN_DIR+"/tokenAPI.json";
const SCOPES=['https://www.googleapis.com/auth/calendar'];

class Authentication{
	init(callback){
		fs.readFile("./secret/secret_client.json",(err,content)=>{
			if(err){
				throw err;
			}
			this.authorize(JSON.parse(content),callback);
		});
	}

	authorize(content,callback){
	
		const self=this;
		const {client_secret,client_id,redirect_uris}= content.installed;
		let auth=new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
		
		
			
			fs.readFile(TOKEN_PATH,(err,token)=>{
				if(err){
					this.generateNewToken(auth,callback);
					
				}else{
					auth.credentials=JSON.parse(token);

					callback(auth);
				}
			});	
	}

	generateNewToken(oauth2Client,callback){
		const self=this;
		var authUrl = oauth2Client.generateAuthUrl({
		    access_type: 'offline',
		    scope: SCOPES
	  	});
	  	console.log('Authorize this app by visiting this url: ', authUrl);
	  	var rl = readline.createInterface({
		    input: process.stdin,
		    output: process.stdout
	  	});
		  rl.question('Enter the code from that page here: ', function(code) {
		    rl.close();
		    oauth2Client.getToken(code, function(err, token) {
		      if (err) {
		        console.log('Error while trying to retrieve access token', err);
		        return;
		      }
		      oauth2Client.credentials = token;
		      console.log("token: ",token);
		      self.storeToken(token,callback);
		    });
		  });

	}
	storeToken(token,callback){
		let self=this;
		try{
			fs.mkdirSync(TOKEN_DIR);
		}catch(err){
			if(err.code!=="EEXIST"){
				throw err;
			}
		}
		fs.writeFile(TOKEN_PATH,JSON.stringify(token),(err,response)=>{
			if(err) throw err;
			self.init(callback)
		})	
	}
}


let auth=new Authentication();

 module.exports=auth;





