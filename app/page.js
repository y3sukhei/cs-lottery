"use client";
import {
 
  Image,
  Modal, ModalContent, ModalBody, ModalFooter,  useDisclosure,
  Button
} from "@nextui-org/react"; 
import WinnerModal from "./components/modal";
import { useEffect, useState } from "react";

export default function Home() {

  const [number, setNumber] = useState("00000000000");
  const [gifts, setGifts] = useState([]);
  const [chosenGiftIndex, setChosenGiftIndex] = useState(0);

  const [tickets, setTickets] = useState([]);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [backdrop, setBackdrop] = useState('blur')

  const [loading , setLoading] = useState(true);

  const [disabled, setDisabled] = useState(false);

  let realNumber = "";
  
  const duration = 5000;
  let obj = null;

  useEffect(() => {
    console.log("refresh")

    fetchGifts();
    fetchTickets();
    
  
  },[])

  const fetchGifts = async () => {
    
    await fetch("/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    })
      .then((res) => res.json()) 
      .then((data) => {        
        setGifts(data);
        setLoading(false);
      }); 

  }

  const fetchTickets = async () => {
    await fetch("/api/ticket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    })
      .then((res) => res.json()) 
      .then((data) => {
        setTickets(data)
        setLoading(false)
      }
      ); 
  }
  const handleClose = () => {
    // number = "00000000000";

    console.log("tickets :", tickets);
    onClose()
    if(chosenGiftIndex < gifts.length -1 ){
      console.log("chosenGiftIndex :", chosenGiftIndex);
      
      setChosenGiftIndex(chosenGiftIndex + 1);
    }
    else{
      console.log("working right")
    }
    setNumber("00000000000")
    
  }
  const saveWinner = async(tickedId) => {
    console.log(chosenGiftIndex)
    const res = await fetch(`/api/gift/${gifts[chosenGiftIndex].id}`,{
      method : 'PUT',
      body: JSON.stringify(
      {
        // name: gifts[chosenGiftIndex].name, 
        // description: gifts[chosenGiftIndex].name, 
        // img :gifts[chosenGiftIndex].img,
        participantId:tickedId
      }),
      headers: {
          'Content-Type': 'application/json'
        }
  })
  }
  
  const getWinner = () => {
    setDisabled(true);
    if(gifts.length > 0 && tickets.length > 0 && chosenGiftIndex < gifts.length){

      
      const random = tickets[Math.floor((Math.random() * tickets.length))]
      
      
      setTickets(tickets.filter((item)=>item.id !== random.id))
      
      realNumber = random.tickedId;
      // setNumber(random.tickedId);
      
      // save in db
      saveWinner(random.id);
      
      setTimeout(() => {
        getRandom();
      },1000)
    } else alert("Error")
  }
  const getRandom = (objId = 1) => {
  
    if(objId > number.length) {
      setNumber(realNumber);
      setDisabled(false);
    
      onOpen()
    }
    else {

      obj = document.getElementById(`value${objId}`);
    
      // setRandom(Math.floor(Math.random() * 99));
      animateValue(objId, obj, 100, 0, 3000); 
    }
  }

  async function animateValue(objId,obj,start, end, duration) {
  //  let obj = document.getElementById(`value${objId}`);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML =  Math.floor(Math.random() * 9);
      
      // Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
      else if(objId <= realNumber.length ) {
        obj.innerHTML = realNumber[objId - 1];
        
          getRandom(objId + 1)

      }
    };

    window.requestAnimationFrame(step);
  }

  if (loading) {
    console.log("Loading");
  }
  else
  return (

    <main className=" bg-cover bg-[url('/assets/bvrtgel.jpg')]">
        {/* <div className="flex gap-4">
      
      <Button color="primary"  disabled={chosenGiftIndex < gifts.length ? true :false} onClick={()=>{getWinner()}}>start</Button>
      </div> */}
      <div className="flex h-screen flex-col p-12 rounded-lg gap-y-5 pt-32">
    
      <div className="flex flex-col items-center justify-center mt-20 h-full gap-y-5">
                  {gifts[chosenGiftIndex]?.img?
                  <>
                    <div className="text-white text-6xl font-extrabold">
                   {gifts[chosenGiftIndex]?.description}
                  </div>
                  
                   <Image 
                     onClick={()=>{ if(!disabled) {getWinner()} else {console.log("Lottery running")} }}
                     alt="Card background"
                     className="object-cover h-96"
                     src={gifts[chosenGiftIndex].img}
                
                     /> 
                     
                     </>
                : <a className="text-white text-6xl font-extrabold mb-72" onClick={()=>{
                  if(!disabled) {getWinner()} else {console.log("Lottery running")}
                }}>
                  {gifts[chosenGiftIndex]?.description}
                  </a>
                }       
                <div className="mx-auto max-w-full px-6 lg:px-8">
    <dl className="grid grid-flow-col text-center justify-center">
      {number.split('').map((item,i)=>(
      <div className="mx-4 flex w-32 flex-col gap-y-4 rounded-lg border-2 border-white bg-white" key={i}>
      <dd className="order-first text-3xl font-extrabold tracking-tight text-gray-900 sm:text-9xl">
        <span id={`value${i+1}`}>
          {item}
          </span>
      </dd>
      </div>
      ))}
    </dl>
     </div>           
      </div>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={()=>{
        handleClose()
      }} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
               <WinnerModal gift={gifts[chosenGiftIndex]} number={number}></WinnerModal>
              </ModalBody>
              <ModalFooter >
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
     {/* <div className=" h-1/6 mt-0">
        
    </div>  */}
    </div>
    </main>
  );
}
