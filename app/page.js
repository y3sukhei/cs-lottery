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
      })
      .catch((error) => {
        console.error("Error fetching gifts:", error);
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
        console.log("tickets loaded:", data.length);
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      });
  }
 
  const handleClose = () => {
    if (chosenGiftIndex < gifts.length - 1) {
      console.log("chosenGiftIndex :", chosenGiftIndex);
      setChosenGiftIndex(chosenGiftIndex + 1);
      setIsNext(false);
    }
    else {
      console.log("All gifts completed")
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
 
      console.log("Selected ticket:", random);
      ticketsConst.current = ticketsConst.current.filter((item) => item.id !== random.id)
 
      realNumber = random.ticketId || random.phone_no || random.sub_id || "00000000";
 
      saveWinner(random.id);
 
      setTimeout(() => {
        getRandom(0, winnerCountIndex);
      }, 1000)
    } else {
      alert("Error: No gifts or tickets available")
    }
  }
 
  const getRandom = (objId = 0, winnerCountIndex) => {
    console.log("winner Count Index :", winnerCountIndex);
 
    if (objId >= realNumber.length) {
      setDisabled(false);
 
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()
 
      if (winnerCountIndex < gifts[chosenGiftIndex].winnerCount - 1) {
        console.log("Next winner")
        getWinner(winnerCountIndex + 1);
      } else {
        console.log("All winners selected")
        setIsNext(true);
      }
    }
    else {
      obj = document.getElementById(`value${winnerCountIndex}${objId}`);
      if (obj) {
        animateValue(objId, obj, 100, 0, 800, winnerCountIndex);
      }
    }
  }
 
  async function animateValue(objId, obj, start, end, duration, winnerCountIndex) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
 
      if (progress < 1) {
        obj.innerHTML = Math.floor(Math.random() * 10);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <div className="text-white text-2xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }
 
  return (
    <main className="relative overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.4); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.6); }
        }
        @keyframes slide-in {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        .gradient-text {
          background: linear-gradient(90deg, #fff, #e0e0e0, #fff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
      `}</style>
 
     {isLookTv === true ? (
      <div className="relative flex flex-col bg-gradient-to-br from-[#0a0d2e] via-[#0f123f] to-[#1a1f5c] min-h-screen h-screen p-4 gap-y-3 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          <div className="absolute top-10 left-10 w-40 h-40 bg-[#00b7b1] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#00b7b1] rounded-full blur-3xl"></div>
        </div>
 
        <div className="relative flex flex-col items-center justify-between h-full gap-y-2 z-10">
          <div className="flex flex-col items-center justify-center gap-y-2 animate-slide-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 shadow-xl">
              <Image
                alt="Look TV Logo"
                className="object-cover h-8"
                src="/assets/looktv_logo.png"
              />
            </div>
            <h1 className="text-[#00b7b1] text-xl font-bold tracking-wider drop-shadow-xl gradient-text">
              {new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase()} GIVEAWAY
            </h1>
          </div>
          <div className="flex flex-row items-center justify-center gap-x-1 w-full max-w-6xl px-4">
            <div className="w-5/12 flex items-center justify-end">
              <div className="flex flex-col items-center justify-center gap-y-3">
                {gifts[chosenGiftIndex]?.img && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00b7b1] blur-xl opacity-25 animate-pulse"></div>
                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20 animate-float">
                      <Image
                        alt="Gift Image"
                        className="object-contain w-40 h-40"
                        src={gifts[chosenGiftIndex].img}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/20">
                  <h2 className="text-white text-lg font-bold text-center">{gifts[chosenGiftIndex]?.name}</h2>
                </div>
 
                <div className="flex gap-3">
                  {isNext ?
                    <Button
                      size="md"
                      className="mt-1 bg-gradient-to-r from-[#00b7b1] to-[#00d4cd] text-white font-bold text-lg shadow-xl px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
                      onClick={() => { handleClose() }}
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                    :
                    <Button
                      size="md"
                      className="mt-1 bg-gradient-to-r from-[#00b7b1] to-[#00d4cd] text-white font-bold text-lg shadow-xl px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
                      disabled={disabled}
                      onClick={() => { getWinner(0) }}
                    >
                      ЭХЛЭХ
                    </Button>
                  }
                </div>
              </div>
            </div>
 
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-3">
              {Array.from({ length: gifts[chosenGiftIndex]?.winnerCount || 0 }, (_, winnerIndex) => (
                <div key={winnerIndex} className="w-full flex flex-col items-center gap-y-2">
                  <dl className="grid grid-flow-col text-center justify-center gap-1.5">
                    {number.split('').map((item, numberIndex) => (
                      <div
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-white to-gray-100 shadow-xl border-2 border-[#00b7b1] transform hover:scale-110 transition-transform duration-300"
                        key={numberIndex}
                      >
                        <div className="absolute inset-0 bg-[#00b7b1] blur-md opacity-25 rounded-lg"></div>
                        <dd className="relative text-2xl font-black tracking-tight text-gray-900">
                          <span id={`value${winnerIndex}${numberIndex}`}>
                            {item}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/20">
            <h1 className="text-white text-lg font-semibold">Бэлгийн эзэн тодруулах</h1>
            <div className="bg-gradient-to-r from-[#00b7b1] to-[#00d4cd] rounded-lg px-2 py-0.5 animate-pulse">
              <h1 className="text-white text-lg font-bold">LIVE</h1>
            </div>
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
      <div className="relative flex flex-col bg-gradient-to-br from-[#225c2a] via-[#3a7d4a] to-[#4e9c5a] min-h-screen h-screen p-4 gap-y-3 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          <div className="absolute top-10 left-10 w-40 h-40 bg-[#47be37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#47be37] rounded-full blur-3xl"></div>
        </div>
 
        <div className="relative flex flex-col items-center justify-between h-full gap-y-2 z-10">
          <div className="flex flex-col items-center justify-center gap-y-2 animate-slide-in">
            {/* <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 shadow-xl">
              <Image
                alt="Univision Logo"
                className="object-cover h-8"
                src="/assets/univision_logo.png"
              />
            </div> */}
            <h1 className="text-[#47be37] text-xl font-bold tracking-wider drop-shadow-xl gradient-text">
              GIVEAWAY
            </h1>
          </div>
 
          <div className="flex flex-row items-center justify-center gap-x-1 w-full max-w-6xl px-4">
            <div className="w-5/12 flex items-center justify-end">
              <div className="flex flex-col items-center justify-center gap-y-3">
                {gifts[chosenGiftIndex]?.img && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#47be37] blur-xl opacity-25 animate-pulse"></div>
                    <div className="relative bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/20 animate-float">
                      <Image
                        alt="Gift Image"
                        className="object-contain w-40 h-40"
                        src={gifts[chosenGiftIndex].img}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/20">
                  <h2 className="text-white text-lg font-bold text-center">{gifts[chosenGiftIndex]?.name}</h2>
                </div>
                <div className="flex gap-3">
                  {isNext ?
                    <Button
                      size="md"
                      className="mt-1 bg-gradient-to-r from-[#47be37] to-[#3da857] text-white font-bold text-lg shadow-xl px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
                      onClick={() => { handleClose() }}
                    >
                      ҮРГЭЛЖЛҮҮЛЭХ
                    </Button>
                    :
                    <Button
                      size="md"
                      className="mt-1 bg-gradient-to-r from-[#47be37] to-[#3da857] text-white font-bold text-lg shadow-xl px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
                      disabled={disabled}
                      onClick={() => { getWinner(0) }}
                    >
                      ЭХЛЭХ
                    </Button>
                  }
                </div>
              </div>
            </div>
 
            <div className="w-1/2 flex flex-col items-center justify-center gap-y-3">
              {Array.from({ length: gifts[chosenGiftIndex]?.winnerCount || 0 }, (_, winnerIndex) => (
                <div key={winnerIndex} className="w-full flex flex-col items-center gap-y-2">
                  <dl className="grid grid-flow-col text-center justify-center gap-1.5">
                    {number.split('').map((item, numberIndex) => (
                      <div
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-white to-gray-100 shadow-xl border-2 border-[#47be37] transform hover:scale-110 transition-transform duration-300"
                        key={numberIndex}
                      >
                        <div className="absolute inset-0 bg-[#47be37] blur-md opacity-25 rounded-lg"></div>
                        <dd className="relative text-2xl font-black tracking-tight text-gray-900">
                          <span id={`value${winnerIndex}${numberIndex}`}>
                            {item}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-x-2 items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-1.5 border border-white/20">
            <h1 className="text-white text-lg font-semibold">Бэлгийн эзэн тодруулах</h1>
            <div className="bg-gradient-to-r from-[#47be37] to-[#3da857] rounded-lg px-2 py-0.5 animate-pulse">
              <h1 className="text-white text-lg font-bold">LIVE</h1>
            </div>
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