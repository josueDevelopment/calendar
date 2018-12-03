const express=require("express");
const app=express();
const auth=require("./authentication.js");
const {google}=require("googleapis");
app.set('PORT',process.env.PORT||8080);
app.use(express.json());


app.get("/",(req,res)=>{
  res.send("Hello!")
})



app.post("/webhook",async (req,res)=>{
  console.log("entro")
  const parameters=req.body.queryResult.parameters;
  const email_patient=parameters.email;
  const start_date=new Date(parameters.date.date_time);
  console.log("date: ",start_date)
  const end_date=new Date(parameters.date.date_time);
  end_date.setHours(end_date.getHours()+1);
  const name_patient=parameters.name;

  const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const OAuth2=await auth();
  const result=await addNewEvent(OAuth2,start_date,end_date,email_patient,name_patient)
  const link=result.data.htmlLink;
    res.json({
      "fulfillmentText":`Tu cita ha sido creada. Puedes verla en Google Calendar! ${link}`
    })
    
    
  
    
})

async function addNewEvent(...parameters){
	var event = {
  'summary': `Cita con Doc. Enrique, Paciente: ${parameters[4]}`,
  'location': 'Guatemala City',
  'description': 'Cita con el Doctor Enrique',
  'start': {
    'dateTime': parameters[1].toISOString(),
    'timeZone': 'America/Guatemala',
  },
  'end': {
    'dateTime':parameters[2].toISOString(),
    'timeZone': 'America/Guatemala',
  },
  //'recurrence': [
    //'RRULE:FREQ=DAILY;COUNT=2'
  //],
  'attendees': [
    {'email': parameters[3],
    "responseStatus":"accepted",
     'self':true,
     'organizer':true
    }
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method':'email','minutes':24 * 60},
      // {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};
  const auth=parameters[0];
const calendar=google.calendar({version:"v3",auth})
  return calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    // sendUpdates:'all',
    'sendNotifications':true
  });
}



app.listen(app.get('PORT'));
