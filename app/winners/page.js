"use client"

import { useEffect, useState } from "react";
import {
    Image,
    Spinner,
} from "@nextui-org/react";

const WinnersPage = () => {

    const [gifts, setGifts] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetchGifts()
    }, [])

    const fetchGifts = async () => {

        try {
            await fetch("/api", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("gifts :", data);
                    setGifts(data)
                });

        }
        catch (err) {
            console.error("Error fetching gifts:", err);
        }
        finally {
            setLoading(false)

        }

    }
    if (loading) return <div className="bg-[#0f123f] h-screen flex justify-center items-center">
        <Spinner />
    </div>

    return (

        <div className="flex flex-col justify-between bg-[#0f123f] h-screen p-12 gap-y-5 pt-12">
            <div className="flex flex-col items-center justify-center gap-y-4">
                <Image
                    // onClick={() => { if (!disabled) { getWinner() } else { console.log("Lottery running") } }}
                    alt="Card background"
                    className="object-cover h-16"
                    src="assets/looktv_logo.png"
                />
                <h1 className="text-[#00b7b1] text-5xl font-sans font-bold ">Бэлгийн эзэд</h1>
            </div>
            <div className="grid grid-cols-4 gap-10 overflow-auto">

                {gifts.map((item, i) => (
                    <div className="flex flex-col items-center gap-4" key={i}>
                        <Image
                            alt={i}
                            className="object-cover"
                            src={item.img}
                        />
                        {item.participants.length > 0 ?

                            item.participants.map((participant, i) => (
                                <div key={i} className="flex gap-2">
                                    {
                                        participant.tickedId.split('').map((item, i) => (
                                            <div className="flex flex-col items-center justify-center rounded-full bg-white size-8" key={i}>
                                                <dd className="order-first font-bold tracking-tight text-gray-900 text-2xl">
                                                    <span id={`value${i + 1}`}>
                                                        {item}
                                                    </span>
                                                </dd>
                                            </div>
                                        ))
                                    }
                                </div>

                            ))


                            : <h1 className="text-white"> no winner </h1>}
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-x-2 items-center justify-center">
                <h1 className="text-white text-4xl font-sans ">Бэлгийн эзэн тодруулах</h1>
                <h1 className="bg-[#00b7b1] rounded-lg px-2 py-1 text-white text-4xl font-sans ">LIVE</h1>

            </div>
        </div>
    );
}

export default WinnersPage;