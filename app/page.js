"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Image,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,  useDisclosure
} from "@nextui-org/react"; 
import WinnerModal from "./components/modal";
import { useEffect, useState } from "react";

export default function Home() {
  const [number, setNumber] =  useState("86117526");
  const [gifts, setGifts] = useState([]);
  const [chosenGift, setChosenGift] = useState();


  const {isOpen, onOpen, onClose} = useDisclosure();
  const [backdrop, setBackdrop] = useState('blur')


  const duration = 5000;
  let obj = null;

  useEffect(() => {
    console.log(number[4])
  // Get Gifts
      fetch("http://localhost:3000/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json", 
        },
      })
        .then((res) => res.json()) 
        .then((data) => setGifts(data));   
  },[])

  const getRandom = (objId = 1) => {
    console.log("obj id :", objId)
    if(objId > number.length){
      onOpen()
    }
    else{

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
  
  return (
    <main className="flex min-h-screen flex-col justify-between p-12 rounded-lg gap-y-6">
      <div className="flex gap-4">
      <Button color="primary"  onClick={()=>{getRandom()}}>Эхлэх</Button>
      <Button color="primary"  onClick={()=>{window.location.reload()}}>Refresh</Button>
      {/* <div id="value">100</div> */}
      </div>
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-5">
            {gifts.map((gift,i)=>(
              <Card className="py-6 px-6" isPressable key={i}  onPress={() => setChosenGift(gift)}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <p className="text-tiny uppercase font-bold ">Бэлэг {i+1}</p>
                      <h4 className="font-bold text-large">{gift.name}</h4>
                      <small className="text-default-500 truncate overfllow-hidden">{gift.description}</small>
                  </CardHeader>
                <CardBody className="overflow-visible py-2">
              <Image isZoomed 
                     alt="Card background"
                     className="w-full object-cover rounded-lg"
                     src={gift.img}
                     width="100%"
                     />
                </CardBody>
                </Card>
            ))}
      </div>

      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader> */}
              <ModalBody>
               <WinnerModal gift={chosenGift} number={number}></WinnerModal>
              </ModalBody>
              <ModalFooter >
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button> */}
                {/* <Button color="primary" onPress={onClose}>
                  Хаах
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

     <div className="bg-white shadow-blue-500/50 py-12 sm:py-24 w-full rounded-xl shadow-2xl grow">
      <div className="mx-auto  max-w-full px-6 lg:px-8">
    <dl className="grid grid-cols-1 text-center lg:grid-cols-8">
      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
          <span id="value1">0</span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
          <span id="value2">0</span>
        </dd>
      </div>

      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
         <span id="value3">0</span>
        </dd>
      </div>

      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
        <span id="value4">0</span>
        </dd>
      </div>

      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
        <span id="value5">0</span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
        <span id="value6">0</span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
        <span id="value7">0</span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4 rounded-lg border-dashed border-4">
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-9xl">
        <span id="value8">0</span>
        </dd>
      </div>
     
    </dl>
  </div>
</div> 
    </main>
  );
}
