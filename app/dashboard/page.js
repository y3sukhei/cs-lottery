"use client"
import {Button, Input,Chip,Card,CardFooter,Image, CardHeader} from "@nextui-org/react";
import { useEffect, useState } from "react";

const DashBoardPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");
    
    const [gifts, setGifts] = useState([]);
    const [tickets, setTickets] = useState([]);


    const [tickedId, setTickedId] = useState("");

    // ticketList for POST
    const [ticketList, setTicketList] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false) 
    const [updateId, setUpdateId] = useState(0) 

    useEffect(() => {

      fetchGifts();
      fetchTickets()
    
    },[]);

    const fetchGifts = async() => {
      await fetch("http://localhost:3000/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
      })
        .then((res) => res.json()) 
        .then((data) => {
          setGifts(data)});
    }
    const fetchTickets = async () => {
      await fetch("http://localhost:3000/api/ticket", {
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
      })
        .then((res) => res.json()) 
        .then((data) => {
          setTickets(data)}); 
    }

    const addGift = async () => {
        const res = await fetch("http://localhost:3000/api",{
            method : 'POST',
            body: JSON.stringify({name, description, img}),
            headers: {
                'Content-Type': 'application/json'
              }
        })
        if(res.ok){
          const data = await res.json();
          console.log("data :", data);
          setUpdateId(0);
          setName("")
          setDescription("")
          setImg("")
          setGifts([...gifts, data])
          
        }
    
    }

    const updateGift = async () => {
      const res = await fetch(`http://localhost:3000/api/gift/${updateId}`,{
          method : 'PUT',
          body: JSON.stringify({name, description, img}),
          headers: {
              'Content-Type': 'application/json'
            }
      })
      if (res.ok) {
        setUpdateId(0);
        setName("")
        setDescription("")
        setImg("")
        
        setIsUpdate(false);
        const data = await res.json();
        const index = gifts.findIndex((item)=> item.id == updateId);
        const newData = [...gifts];
        newData[index] = data;
        setGifts(newData)
       
      }
  }


    const makeList = async(e) => {
      setTicketList(e.split(" "));
      console.log(
        "ticket list :", e.split(" ")
      )
    }

    const addParticipant = async (i) => {
      console.log(i);
        const res = await fetch("http://localhost:3000/api/ticket",{
            method : 'POST',
            body: JSON.stringify({tickedId :ticketList[i]}),
            headers: {
                'Content-Type': 'application/json'
              }
        })

        if(res.ok){
          const data = await res.json();
          console.log("participant data :", data);

            if (i < ticketList.length -1) {
              i++;
              setTimeout(() => {
                addParticipant(i);
              },500)
            }
            else console.log('stop2');
        }
        else  console.log('stop1');
    }

    const handleGift = async (param,id) => {
      if (param == "delete") {
        const res = await fetch(`http://localhost:3000/api/gift/${id}`,{
          method : 'DELETE',
          // body: JSON.stringify({tickedId :ticketList[i]}),
          headers: {
              'Content-Type': 'application/json'
            }
      });
      const data = await res.json();
      console.log("adter delete :", data);

      setGifts(gifts.filter((item)=> item.id !== data.id))
          
      }
      else {
        setUpdateId(id);
        const data = gifts.filter((item)=>item.id == id)
        console.log("data :", data[0])

        setName(data[0].name)
        setDescription(data[0].description)
        setImg(data[0].img)
        
        if(!isUpdate){
          setIsUpdate(true);
        }
      }

    }


    return (
        <div className="px-16 py-6">
            <div className="flex flex-col gap-4 max-h-screen">
                <div className="flex flex-col gap-4 h-auto rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <div className="flex flex-row gap-2 overflow-hidden">
                <div className="flex flex-col gap-4 w-3/12">
                <div >Insert Gift </div>
                <Input
                  onChange={(e)=> setName(e.target.value)}
                  isRequired
                  type="text"
                  label="Gift Name"
                  className="max-w-sm"
                  value={name}
                  />
                <Input
                  onChange={(e)=> setDescription(e.target.value)}
                  isRequired
                  type="text"
                  label="Gift Description"
                  className="max-w-sm"
                  value={description}
                  />
                <Input
                  onChange={(e)=> setImg(e.target.value)}
                  isRequired
                  type="text"
                  label="Gift Image URL"
                  className="max-w-sm"
                  value={img}
                  />
                  {!isUpdate ? 
                (<Button color="primary" className="max-w-sm" onClick={()=>{
                  addGift()
              }}>Add</Button>)  : (<Button color="primary" className="max-w-sm" onClick={()=>{
                updateGift()
            }}>Update</Button>)}
                
                  </div>
                  <div className="grid grid-cols-6 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 overflow-auto">
                 
                  {gifts.map((item,i)=>(
                     <Card
                     isFooterBlurred
                     key={i}
                     radius="lg"
                     className="border-none"
                   >
                   <CardHeader  className="flex gap-3">
                    {item.name}
                   </CardHeader>
                     <Image
                       alt="Woman listing to music"
                       className="object-cover"
                       height={200}
                       src={item.img}
                       width={200}
                     />
                     <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                       <Button color="primary" onClick={()=>{
                        handleGift("edit", item.id);
                       }}>Edit</Button>
                       <Button color="primary" onClick={()=>{
                        handleGift("delete", item.id);
                       }} >Delete</Button>

                     </CardFooter>
                   </Card>
                  ))}
                
                  </div>
                  </div>
                </div>
                <div className="flex flex-col h-auto gap-4 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <div className="flex flex-row gap-2 ">
                    <div className="flex flex-col gap-4 w-3/12">
                        <div >Insert Participant </div>
                        <Input
                          id="title"
                          onChange={(e)=>{
                            makeList(e.target.value);
                            // setTickedId(e.target.value);
                          }}
                          isRequired
                          type="text"
                          label="Enter Code"
                          className="max-w-sm"
                          />
                        <Button color="primary" className="max-w-sm" onClick={()=>{
                         addParticipant(0);
                        }} >Add Ticket</Button>
                  </div>
                  <div className="grid grid-cols-8 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 max-h-[45vh] overflow-auto">
                  {tickets.map((item, i)=>(
                      <Chip key={i} onClose={() => console.log("close")}>
                        {item.tickedId}
                      </Chip>
                    ))}
                  </div>
                </div>
                    </div>
                 </div>
            </div>
    );
}

export default DashBoardPage;