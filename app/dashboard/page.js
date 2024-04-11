"use client"
import {Button, Input, Listbox, ListboxItem} from "@nextui-org/react";
import { useEffect, useState } from "react";

const DashBoardPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");

    const [tickedId, setTickedId]= useState("");


    useEffect(() => {
    
    },[]);

    const addGift = async () => {
        const res = await fetch("http://localhost:3000/api",{
            method : 'POST',
            body: JSON.stringify({name, description, img}),
            headers: {
                'Content-Type': 'application/json'
              }
        })
        const data = await res.json();

        console.log("data :", data);
    }

    const addParticipant = async () => {
        const res = await fetch("http://localhost:3000/api/ticket",{
            method : 'POST',
            body: JSON.stringify({tickedId}),
            headers: {
                'Content-Type': 'application/json'
              }
        })
        const data = await res.json();

        console.log("participant data :", data);
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
                  />
                <Input
                  onChange={(e)=> setDescription(e.target.value)}
                  isRequired
                  type="text"
                  label="Gift Description"
                  className="max-w-sm"
                  />
                <Input
                  onChange={(e)=> setImg(e.target.value)}
                  isRequired
                  type="text"
                  label="Gift Image URL"
                  className="max-w-sm"
                  />
                <Button color="primary" className="max-w-sm" onClick={()=>{
                    addGift()
                }}>Add</Button>
                  </div>
                  <div className="grid grid-cols-12 gap-x-2 w-9/12 rounded-lg border-2 border-stone-950 overflow-auto">
                 
                  {new Array(100).fill("88118811").map((item)=>(
                    <div>{item}</div>
                  ))}
                
                  </div>
                  </div>
                </div>
                <div className="flex flex-col h-auto gap-4 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <div className="flex flex-row gap-2 ">
                    <div className="flex flex-col gap-4 w-3/12">
                        <div >Insert Participant </div>
                        <Input
                          onChange={(e)=>{
                            setTickedId(e.target.value);
                          }}
                          isRequired
                          type="text"
                          label="Enter Code"
                          className="max-w-sm"
                          />
                        <Button color="primary" className="max-w-sm" onClick={()=>{
                            addParticipant()
                        }} >Add Ticket</Button>
                  </div>
                  <div className="grid grid-cols-12 gap-2 w-9/12 rounded-lg border-2 border-stone-950 max-h-[45vh] overflow-auto" >
                  {new Array(1000).fill("88118811").map((item)=>(
                      <div>{item}</div>
                    ))}
                  </div>
                </div>
                    </div>

                 </div>
            </div>
    );
}

export default DashBoardPage;