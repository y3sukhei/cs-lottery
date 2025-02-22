"use client";
import {

  Image,
  Modal, ModalContent, ModalBody, ModalFooter, useDisclosure,
  Button
} from "@nextui-org/react";
import WinnerModal from "./components/modal";
import { useEffect, useState } from "react";
import JSConfetti from 'js-confetti'

export default function Home() {

  const [number, setNumber] = useState("        ");
  const [gifts, setGifts] = useState([]);
  const [chosenGiftIndex, setChosenGiftIndex] = useState(0);

  const [tickets, setTickets] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState('blur')

  const [loading, setLoading] = useState(true);

  const [disabled, setDisabled] = useState(false);

  const [isNext, setIsNext] = useState(false);


  const [winnerCount, setWinnerCount] = useState(1);

  let realNumber = "";

  const duration = 5000;
  let obj = null;

  useEffect(() => {
    console.log("refresh")

    fetchGifts();
    fetchTickets();

    if (gifts.length > 0) {

    }






  }, [])
  function countDuplicatesAtIndex(index, key, list) {
    // Ensure the index is valid.
    if (index < 0 || index >= list.length) {
      console.error("Invalid index");
      return 0;
    }

    // Get the value from the object at the given index.
    const valueToCheck = list[index][key];

    // Count how many times that value appears in the list.
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
        setWinnerCount(countDuplicatesAtIndex(chosenGiftIndex, 'img', data))
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
        setTickets(data)
        setLoading(false)
      }
      );
  }
  const handleClose = () => {

    console.log("tickets :", tickets);
    onClose()
    if (chosenGiftIndex < gifts.length - 1) {
      console.log("chosenGiftIndex :", chosenGiftIndex);

      setChosenGiftIndex(chosenGiftIndex + 1);
      setIsNext(false);
    }
    else {
      console.log("working right")
    }
    setNumber("        ")

  }
  const saveWinner = async (tickedId) => {
    console.log(chosenGiftIndex)
    const res = await fetch(`/api/gift/${gifts[chosenGiftIndex].id}`, {
      method: 'PUT',
      body: JSON.stringify(
        {
          // name: gifts[chosenGiftIndex].name, 
          // description: gifts[chosenGiftIndex].name, 
          // img :gifts[chosenGiftIndex].img,
          participantId: tickedId
        }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const getWinner = () => {
    setDisabled(true);
    if (gifts.length > 0 && tickets.length > 0 && chosenGiftIndex < gifts.length) {


      const random = tickets[Math.floor((Math.random() * tickets.length))]


      setTickets(tickets.filter((item) => item.id !== random.id))

      realNumber = random.tickedId;
      // setNumber(random.tickedId);

      // save in db
      saveWinner(random.id);

      setTimeout(() => {
        getRandom();
      }, 1000)
    } else alert("Error")
  }
  const getRandom = (objId = 1) => {

    if (objId > number.length) {
      setNumber(realNumber);
      setDisabled(false);

      const jsConfetti = new JSConfetti()
      // console.log("props :", props)
      jsConfetti.addConfetti()
      setIsNext(true);

      // onOpen()
    }
    else {

      obj = document.getElementById(`value${objId}`);

      // setRandom(Math.floor(Math.random() * 99));
      animateValue(objId, obj, 100, 0, 1000);
    }
  }

  async function animateValue(objId, obj, start, end, duration) {
    //  let obj = document.getElementById(`value${objId}`);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // obj.innerHTML = Math.floor(Math.random() * 9);

      // Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
      else if (objId <= realNumber.length) {
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

      <main className="bg-cover bg-[url('/assets/looktv_background.webp')]">
        {/* <div className="flex gap-4">
      
      <Button color="primary"  disabled={chosenGiftIndex < gifts.length ? true :false} onClick={()=>{getWinner()}}>start</Button>
      </div> */}
        <div className="flex  h-screen flex-col p-12 rounded-lg gap-y-5 pt-32">

          <div className="flex my-40 h-full gap-y-5">
            {/* {gifts[chosenGiftIndex]?.img ?
              <>
                <div className="text-white text-6xl font-extrabold">
                  {gifts[chosenGiftIndex]?.description}
                </div> */}

            <div className="w-1/2 p-4 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                {/* <h1 className="text-white text-4xl font-extrabold mb-4">Winner Count: {winnerCount}</h1> */}
                <h1 className="text-white text-4xl font-extrabold mb-4">{chosenGiftIndex + 1}.{gifts[chosenGiftIndex]?.name}</h1>
                <Image
                  // onClick={() => { if (!disabled) { getWinner() } else { console.log("Lottery running") } }}
                  alt="Card background"
                  className="object-cover h-96 "
                  src={gifts[chosenGiftIndex]?.img}

                />
                <div className="flex gap-4">



                  {isNext ?
                    <Button size="lg" color="success" className=" mt-4 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" onClick={() => { handleClose() }}>ҮРГЭЛЖЛҮҮЛЭХ</Button>
                    : <Button size="lg" color="success" className=" mt-4 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" disabled={disabled} onClick={() => { getWinner() }}>ЭХЛЭХ</Button>
                  }
                </div>

              </div>
            </div>

            {/* </>
              : <a className="text-white text-6xl font-extrabold mb-72" onClick={() => {
                if (!disabled) { getWinner() } else { console.log("Lottery running") }
              }}>
                {gifts[chosenGiftIndex]?.description}
              </a>
            } */}

            <div className="w-1/2 mx-auto px-6 lg:px-8 flex flex-col items-center justify-center gap-y-14">
              {/* {Array.from({ length: winnerCount }, (_, i) => ( */}
              <dl key={0} className="grid grid-flow-col text-center justify-center">
                {number.split('').map((item, i) => (
                  <div className="mx-2 flex items-center justify-center size-16 flex-col gap-y-4 rounded-full border-2 border-white bg-white" key={i}>
                    <dd className="order-first text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                      <span id={`value${i + 1}`}>
                        {item}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* ))} */}







            </div>
          </div>

          <Modal backdrop={backdrop} isOpen={isOpen} onClose={() => {
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
