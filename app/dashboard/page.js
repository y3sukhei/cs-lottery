"use client"
import { Button, Input, Chip, Card, CardFooter, Image, CardHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Papa from "papaparse";

const DashBoardPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");

  const [gifts, setGifts] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [isAdding, setIsAdding] = useState(false);

  const [percent, setPercent] = useState(0);



  // ticketList for POST
  const [ticketList, setTicketList] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false)
  const [updateId, setUpdateId] = useState(0)

  // CSV
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {

    fetchGifts();
    fetchTickets()

  }, []);

  const fetchGifts = async () => {
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
      });
  }

  const addGift = async () => {
    const res = await fetch("/api", {
      method: 'POST',
      body: JSON.stringify({ name, description, img }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
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
    const res = await fetch(`/api/gift/${updateId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description, img }),
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
      const index = gifts.findIndex((item) => item.id == updateId);
      const newData = [...gifts];
      newData[index] = data;
      setGifts(newData)

    }
  }


  const makeList = async (e) => {
    setTicketList(e.split(" "));
    console.log(
      "ticket list :", e.split(" ")
    )
  }

  const deleteAllParticipant = async () => {
    const res = await fetch(`/api/ticket/`, {
      method: 'DELETE',
      // body: JSON.stringify({tickedId :ticketList[i]}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("adter delete all :", data);
    setTickets([]);
  }

  const deleteAllGift = async () => {
    const res = await fetch(`/api`, {
      method: 'DELETE',
      // body: JSON.stringify({tickedId :ticketList[i]}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("after delete all :", data);
    setGifts([]);
  }

  const addParticipant = async (i) => {
    setIsAdding(true);
    console.log(i);
    const res = await fetch("/api/ticket", {
      method: 'POST',
      body: JSON.stringify(
        { tickedId: ticketList[i] }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json();
      console.log("added ticket :", data);


      setPercent(prevPercent => parseInt(prevPercent + (100 / ticketList.length)));


      setTickets(prevTickets => [...prevTickets, data]);


      if (i < ticketList.length - 1) {
        i++;
        // setTimeout(() => {
        addParticipant(i);
        // },500)
      }
      else {

        setTimeout(() => {
          setIsAdding(false)
          setPercent(0);


          console.log('stop2');
        }, 1000)


      }

    }
    else {
      setIsAdding(false)

      console.log('stop1');
    }
  }

  const handleGift = async (param, id) => {
    if (param == "delete") {
      const res = await fetch(`/api/gift/${id}`, {
        method: 'DELETE',
        // body: JSON.stringify({tickedId :ticketList[i]}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      setGifts(gifts.filter((item) => item.id !== data.id))

    }
    else {
      setUpdateId(id);
      const data = gifts.filter((item) => item.id == id)
      console.log("data :", data[0])

      setName(data[0].name)
      setDescription(data[0].description)
      setImg(data[0].img)

      if (!isUpdate) {
        setIsUpdate(true);
      }
    }

  }
  const toSubs = async () => {
    csvData.forEach((value) => {
      console.log(value.sub_id);
      setSubs(oldArray => [...oldArray, value.sub_id]);


    });

  }
  async function addParticipants() {
    for (const data of csvData) {
      try {
        const response = await fetch("/api/ticket", {
          method: 'POST',
          body: JSON.stringify(
            { tickedId: data.phone_no }
          ),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setTickets(prevTickets => [...prevTickets, responseData]);


      } catch (error) {
        console.error(`Error fetching:`, error);
        // results.push(null);
      }
    }
  }


  const handleCsvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true, // If the CSV has headers
          skipEmptyLines: true,
          complete: (result) => {
            console.log("result :", result);



            setCsvData(result.data); // Parsed data

            // toSubs();

            // setError("");
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            setError("Error parsing CSV file.");
          },
        });
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };


  return (
    <div className="px-16 py-6">
      <div className="flex flex-col gap-4 max-h-screen">
        <div className="flex flex-col gap-4 h-auto rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
          <div className="flex flex-row gap-2 overflow-hidden">
            <div className="flex flex-col gap-4 w-3/12">
              <div >Insert Gift </div>
              <Input
                onChange={(e) => setName(e.target.value)}
                isRequired
                type="text"
                label="Gift Name"
                className="max-w-sm"
                value={name}
              />
              <Input
                onChange={(e) => setDescription(e.target.value)}
                isRequired
                type="text"
                label="Gift Description"
                className="max-w-sm"
                value={description}
              />
              <Input
                onChange={(e) => setImg(e.target.value)}
                isRequired
                type="text"
                label="Gift Image URL"
                className="max-w-sm"
                value={img}
              />
              {!isUpdate ?
                (<Button color="primary" className="max-w-sm" onClick={() => {
                  addGift()
                }}>Add</Button>) : (<Button color="primary" className="max-w-sm" onClick={() => {
                  updateGift()
                }}>Update</Button>)}
              <Button color="primary" className="max-w-sm" onClick={() => {
                deleteAllGift()
              }}>Delete All Gift</Button>

            </div>
            <div className="grid grid-cols-6 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 overflow-auto">

              {gifts.map((item, i) => (
                <Card
                  isFooterBlurred
                  key={i}
                  radius="lg"
                  className="border-none"
                >
                  <CardHeader className="flex gap-3">
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
                    <Button color="primary" onClick={() => {
                      handleGift("edit", item.id);
                    }}>Edit</Button>
                    <Button color="primary" onClick={() => {
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
              <div >Insert Participants </div>
              <input
                id="title"
                onChange={(e) => {
                  handleCsvFileUpload(e);
                  // makeList(e.target.value);
                  // setTickedId(e.target.value);
                }}
                type="file"
                accept=".csv"
                // label="Enter CSV File"
                className="max-w-sm"
              />
              <Button color="primary" className="max-w-sm" onClick={() => {
                addParticipants();
              }} >Add Ticket</Button>

              <Button color="primary" className="max-w-sm" onClick={() => {
                deleteAllParticipant();
              }} >Delete All Tickets</Button>
              {
                isAdding ? <div className="text-lg">LOADING {percent} %</div> :

                  <div>
                    {tickets.length}
                  </div>
              }

            </div>

            <div className="grid grid-cols-8 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 max-h-[45vh] overflow-auto">
              {tickets.map((item, i) => (
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