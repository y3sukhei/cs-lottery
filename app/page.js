"use client";
import {
  Image,
  Modal, ModalContent, ModalBody, ModalFooter, useDisclosure,
  Button
} from "@nextui-org/react";
import WinnerModal from "./components/modal";
import { useEffect, useState } from "react";
import JSConfetti from 'js-confetti'
import { useRouter } from 'next/navigation'
import { useRef } from 'react';

export default function Home() {

  const [number, setNumber] = useState("--------");
  const [gifts, setGifts] = useState([]);
  const [chosenGiftIndex, setChosenGiftIndex] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState('blur')

  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isLookTv, setIsLookTv] = useState(false);

  let realNumber = "";
  const ticketsConst = useRef([]);

  const duration = 5000;
  let obj = null;

  const router = useRouter();

  useEffect(() => {
    console.log("refresh")
    
    // Load giveaway type from localStorage
    const savedType = localStorage.getItem('giveawayType');
    console.log("Loaded giveaway type:", savedType);
    
    if (savedType === 'looktv') {
      setIsLookTv(true);
    } else if (savedType === 'univision') {
      setIsLookTv(false);
    }

    fetchGifts();
    fetchTickets();

  }, [])

  function countDuplicatesAtIndex(index, key, list) {
    if (index < 0 || index >= list.length) {
      console.error("Invalid index");
      return 0;
    }

    const valueToCheck = list[index][key];

    const count = list.reduce((acc, obj) => {
      return obj[key] === valueToCheck ? acc + 1 : acc;
    }, 0);

    return count;
  }

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
        console.log("gifts :", data);
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
        ticketsConst.current = data;
        setLoading(false)
      });
  }

  const handleClose = () => {
    if (chosenGiftIndex < gifts.length - 1) {
      console.log("chosenGiftIndex :", chosenGiftIndex);
      setChosenGiftIndex(chosenGiftIndex + 1);
      setIsNext(false);
    }
    else {
      console.log("working right")
    }
    setNumber("--------")
  }

  const saveWinner = async (ticketId) => {
    console.log(chosenGiftIndex)
    const res = await fetch(`/api/participant/${gifts[chosenGiftIndex].id}`, {
      method: 'PUT',
      body: JSON.stringify({
        participantId: ticketId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getWinner = (winnerCountIndex = 0) => {
    console.log("tickets var :", ticketsConst);
    setNumber("        ")

    if (gifts.length > 0 && ticketsConst.current.length > 0 && chosenGiftIndex < gifts.length) {
      setDisabled(true);

      const random = ticketsConst.current[Math.floor((Math.random() * ticketsConst.current.length))]

      console.log("tickets :", ticketsConst);
      ticketsConst.current = ticketsConst.current.filter((item) => item.id !== random.id)

      realNumber = random.ticketId;

      saveWinner(random.id);

      setTimeout(() => {
        getRandom(0, winnerCountIndex);
      }, 1000)
    } else alert("Error")
  }

  const getRandom = (objId = 0, winnerCountIndex) => {
    console.log("winner Count Index :", winnerCountIndex);

    if (objId >= realNumber.length) {
      setDisabled(false);

      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()

      if (winnerCountIndex < gifts[chosenGiftIndex].winnerCount - 1) {
        console.log("working")
        getWinner(winnerCountIndex + 1);
      } else {
        console.log("duussan next ")
        setIsNext(true);
      }
    }
    else {
      obj = document.getElementById(`value${winnerCountIndex}${objId}`);
      animateValue(objId, obj, 100, 0, 800, winnerCountIndex);
    }
  }

  async function animateValue(objId, obj, start, end, duration, winnerCountIndex) {
    console.log("real number :", realNumber);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
      else if (objId < realNumber.length) {
        obj.innerHTML = realNumber[objId];
        getRandom(objId + 1, winnerCountIndex)
      }
    };

    window.requestAnimationFrame(step);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="">
     {isLookTv === true ? (
      <div className="flex flex-col bg-[#0f123f] h-screen p-12 gap-y-5 pt-12">
        <div className="flex flex-col items-center justify-between h-full gap-y-5">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Image
              alt="Look TV Logo"
              className="object-cover h-20"
              src="/assets/looktv_logo.png"
            />
            <h1 className="text-[#00b7b1] text-5xl font-sans font-bold">
              {new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()} GIVEAWAY
            </h1>
          </div>
          <div className="flex flex-row items-center justify-center gap-x-4">
            <div className="w-1/2 p-4 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <Image
                  alt="Gift Image"
                  className="object-fit h-80"
                  src={gifts[chosenGiftIndex]?.img}
                />
                <div className="flex gap-4">
                  {isNext ?
                    <Button 
                      size="lg" 
                      className="mt-10 bg-[#00b7b1] text-white font-sans text-xl shadow-lg" 
                      onClick={() => { handleClose() }}
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                    : 
                    <Button 
                      size="lg" 
                      color="success" 
                      className="mt-10 bg-[#00b7b1] text-white font-sans text-xl shadow-lg" 
                      disabled={disabled}
                      onClick={() => { getWinner(0) }}
                    >
                      ЭХЛЭХ
                    </Button>
                  }
                </div>
              </div>
            </div>

            <div className="w-1/2 mx-auto px-6 lg:px-8 flex flex-col items-center justify-center gap-y-14">
              {Array.from({ length: gifts[chosenGiftIndex]?.winnerCount || 0 }, (_, winnerIndex) => (
                <dl key={winnerIndex} className="grid grid-flow-col text-center justify-center">
                  {number.split('').map((item, numberIndex) => (
                    <div className="mx-2 flex items-center justify-center size-16 flex-col gap-y-4 rounded-full border-2 border-white bg-white" key={numberIndex}>
                      <dd className="order-first text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        <span id={`value${winnerIndex}${numberIndex}`}>
                          {item}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center justify-center">
            <h1 className="text-white text-4xl font-sans">Бэлгийн эзэн тодруулах</h1>
            <h1 className="bg-[#00b7b1] rounded-lg px-2 py-1 text-white text-4xl font-sans">LIVE</h1>
          </div>
        </div>
        <Modal backdrop={backdrop} isOpen={isOpen} onClose={() => { handleClose() }} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <WinnerModal gift={gifts[chosenGiftIndex]} number={number}></WinnerModal>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
     ) : (
      <div className="bg-black bg-opacity-50 h-screen absolute z-10 top-0 left-0 p-12 w-screen">
        <div className="flex flex-col items-center justify-between h-full gap-y-5">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <Image
              alt="Look TV Logo"
              className="object-cover h-20"
              src="/assets/univision_logo.png"
            />
            <h1 className="bg-[#47be37] rounded-lg px-2 py-1 text-white text-5xl font-sans">GIVEAWAY</h1> 
          </div>
          <div className="flex flex-row items-center justify-center gap-x-4">
            <div className="w-1/2 p-4 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <Image
                  alt="Gift Image"
                  className="object-fit h-80"
                  src={gifts[chosenGiftIndex]?.img}
                />
                <div className="flex gap-4">
                  {isNext ?
                    <Button 
                      size="lg" 
                      className="mt-10 bg-[#47be37] text-white font-sans text-xl shadow-lg" 
                      onClick={() => { handleClose() }}
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                    : 
                    <Button 
                      size="lg" 
                      color="success" 
                      className="mt-10 bg-[#47be37] text-white font-sans text-xl shadow-lg" 
                      disabled={disabled}
                      onClick={() => { getWinner(0) }}
                    >
                      ЭХЛЭХ
                    </Button>
                  }
                </div>
              </div>
            </div>

            <div className="w-1/2 mx-auto px-6 lg:px-8 flex flex-col items-center justify-center gap-y-14">
              {Array.from({ length: gifts[chosenGiftIndex]?.winnerCount || 0 }, (_, winnerIndex) => (
                <dl key={winnerIndex} className="grid grid-flow-col text-center justify-center">
                  {number.split('').map((item, numberIndex) => (
                    <div className="mx-2 flex items-center justify-center size-16 flex-col gap-y-4 rounded-full border-2 border-white bg-white" key={numberIndex}>
                      <dd className="order-first text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        <span id={`value${winnerIndex}${numberIndex}`}>
                          {item}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center justify-center">
            <h1 className="text-white text-4xl font-sans">Бэлгийн эзэн тодруулах</h1>
            <h1 className="bg-[#47be37] rounded-lg px-2 py-1 text-white text-4xl font-sans">LIVE</h1>
          </div>
        </div>
        <Modal backdrop={backdrop} isOpen={isOpen} onClose={() => { handleClose() }} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <WinnerModal gift={gifts[chosenGiftIndex]} number={number}></WinnerModal>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
     )}
    </main>
  );
}