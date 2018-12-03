const tokens=require("./token_auth/tokenAPI.json");
const client=require("./secret/secret_client.json");
const {google}=require("googleapis");

function authentication(){
  return new Promise(resolve=>{ 
    const {client_secret,client_id,redirect_uris}=client.installed;
    const OAuth2Client=new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
    OAuth2Client.credentials=tokens;
    resolve(OAuth2Client)
  });
}

module.exports=authentication;