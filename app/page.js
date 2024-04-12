"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Image,
  Modal, ModalContent, ModalBody, ModalFooter,  useDisclosure
} from "@nextui-org/react"; 
import WinnerModal from "./components/modal";
import { useEffect, useState } from "react";

export default function Home() {
  const [number, setNumber] =  useState("00000000000");
  const [gifts, setGifts] = useState([]);
  const [chosenGift, setChosenGift] = useState();

  const [tickets, setTickets] = useState([]);


  const {isOpen, onOpen, onClose} = useDisclosure();
  const [backdrop, setBackdrop] = useState('blur')

  const [loading , setLoading] = useState(true);


  const duration = 5000;
  let obj = null;

  useEffect(() => {

    fetchGifts();
    fetchTickets();
  
  },[])

  const fetchGifts = async () => {
    
    await fetch("http://localhost:3000/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    })
      .then((res) => res.json()) 
      .then((data) => {        
        setGifts(data)
        setChosenGift(data[0]);
        setLoading(false)
      }); 

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
        setTickets(data)
        setLoading(false)
      }
      ); 
  }

  const getRandom = (objId = 1) => {
    console.log("obj id :", objId)
    if(objId > number.length){
      onOpen()
    }
    else {

      obj = document.getElementById(`value${objId}`);
    
      // setRandom(Math.floor(Math.random() * 99));
      animateValue(objId, obj, 100, 0, 5000); 
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
      else if(objId <= number.length ) {
        obj.innerHTML = number[objId - 1];
        
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

    <main className="bg-cover bg-[url('/assets/background.webp')]">
      <div className="flex h-screen flex-col justify-between p-12 rounded-lg gap-y-6 pt-72">
      <div className="flex gap-4">
      
      <Button color="primary"  onClick={()=>{getRandom()}}>start</Button>
      <Button color="primary"  onClick={()=>{window.location.reload()}}>Refresh</Button>
      </div>
      <div className="flex flex-col items-center justify-center h-4/6">
                  <Image 
                     alt="Card background"
                     className="object-cover h-14"
                     src="assets/mongolz_text.png"
                     />
                   <Image 
                     alt="Card background"
                     className="object-cover h-96"
                     src="assets/mongolz.png"
                     />
      </div>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
               <WinnerModal gift={chosenGift} number={number}></WinnerModal>
              </ModalBody>
              <ModalFooter >
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
     <div className=" h-2/6">
      <div className="mx-auto max-w-full px-6 lg:px-8">
    <dl className="grid grid-flow-col text-center justify-center">
      {new Array(number.length).fill(0).map((item,i)=>(
      <div className="mx-4 flex w-24 flex-col gap-y-4 rounded-lg border-2 border-white bg-white" key={i}>
      <dd className="order-first text-3xl font-extrabold tracking-tight text-gray-900 sm:text-9xl">
        <span id={`value${i+1}`}>{item}</span>
      </dd>
      </div>
      ))}
    </dl>
     </div>  
    </div> 
    </div>
    </main>
  );
}
