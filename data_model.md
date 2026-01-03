Events

Event Schema {
    id:string;
    title:string;
    description:string;
    slug:string;
    date:datetime;
    duration:string;
    time:datetime;
    audience:string[];
    location:string;
    venue:string;
    mode:string;ENUM "In-Person"|"Online"|"Hybrid;
    agenda:string[];
    organizer:string;
    tags:string[];
}


//seats:number//integer


Events 1 -- M bookings


bookings

id:string;
name:string;
email:string;
event:event_id//ref
status:enum
//timestamp





