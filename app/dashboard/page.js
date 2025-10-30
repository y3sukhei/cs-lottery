"use client"
import { Button, Input, Chip, Card, CardFooter, Image, CardHeader } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

const DashBoardPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [winnerCount, setWinnerCount] = useState(0);
  const [img, setImg] = useState("");

  const [gifts, setGifts] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [percent, setPercent] = useState(0);

  const [ticketList, setTicketList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false)
  const [updateId, setUpdateId] = useState(0)

  const [isLookTv, setIsLookTv] = useState(false);

  // Use ref for CSV data
  const csvDataRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleToggle = () => {
    const newValue = !isLookTv;
    setIsLookTv(newValue);
    localStorage.setItem('giveawayType', newValue ? 'looktv' : 'univision');
  };

  useEffect(() => {
    const savedType = localStorage.getItem('giveawayType');
    if (savedType === 'looktv') {
      setIsLookTv(true);
    } else if (savedType === 'univision') {
      setIsLookTv(false);
    }
  }, []);

  let BATCH_SIZE = 1000;

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
      body: JSON.stringify({ name, description, img, winnerCount }),
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
      setWinnerCount(0)
      setImg("")
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setGifts([...gifts, data])
    }
  }

  const updateGift = async () => {
    const res = await fetch(`/api/gift/${updateId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description, img, winnerCount }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      setUpdateId(0);
      setName("")
      setDescription("")
      setWinnerCount(0)
      setImg("")
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsUpdate(false);
      const data = await res.json();
      const index = gifts.findIndex((item) => item.id == updateId);
      const newData = [...gifts];
      newData[index] = data;
      setGifts(newData)
    }
  }

  const deleteAllParticipant = async () => {
    const res = await fetch(`/api/ticket/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("after delete all :", data);
    setTickets([]);
  }

  const deleteAllGift = async () => {
    const res = await fetch(`/api`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    console.log("after delete all :", data);
    setGifts([]);
  }

  const handleGift = async (param, id) => {
    if (param == "delete") {
      const res = await fetch(`/api/gift/${id}`, {
        method: 'DELETE',
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
      setWinnerCount(data[0].winnerCount)
      setImg(data[0].img)

      if (!isUpdate) {
        setIsUpdate(true);
      }
    }
  }

  // FIXED: Use csvDataRef.current instead of csvData state
  async function addParticipants() {
    console.log("CSV Data length:", csvDataRef.current.length);
    
    if (!csvDataRef.current || csvDataRef.current.length === 0) {
      alert("Please upload a CSV file first!");
      return;
    }

    setIsAdding(true);
    setPercent(0);

    for (let i = 0; i < csvDataRef.current.length; i += BATCH_SIZE) {
      const batch = csvDataRef.current.slice(i, i + BATCH_SIZE);
      try {
        const response = await fetch("/api/ticket/batch", {
          method: 'POST',
          body: JSON.stringify({ ticketList: batch }),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("responseData :", responseData);
        setTickets(prevTickets => [...prevTickets, ...responseData]);
        
        // Update progress
        const progress = Math.min(((i + batch.length) / csvDataRef.current.length) * 100, 100);
        setPercent(Math.round(progress));

      } catch (error) {
        console.error(`Error fetching:`, error);
      }
    }

    setIsAdding(false);
    setPercent(0);
  }

  const handleCsvFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "text/csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("CSV parsed, rows:", result.data.length);
            csvDataRef.current = result.data;
            alert(`CSV loaded successfully! ${result.data.length} rows found.`);
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            alert("Error parsing CSV file.");
          },
        });
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  // FIXED: Handle image upload properly
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
        console.log("Image loaded, size:", reader.result.length);
      };
      reader.onerror = () => {
        alert("Error reading image file");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-16 py-6">
      <div className="flex flex-col gap-4 max-h-screen">
        <div className="flex flex-col gap-4 h-auto rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
          <div className="flex flex-row gap-2 overflow-hidden">
            <div className="flex flex-col gap-4 w-3/12">
              <div className="text-2xl font-bold">Add Gift</div>
              <button 
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  isLookTv ? 'bg-[#00b7b1] text-white' : 'bg-[#47be37] text-white'
                }`} 
                onClick={handleToggle}
              >
                {isLookTv ? 'Look TV giveaway' : 'Univision giveaway'}
              </button>
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
                onChange={(e) => setWinnerCount(parseInt(e.target.value) || 0)}
                isRequired
                type="number"
                label="Winner Count"
                className="max-w-sm"
                value={winnerCount}
              />
              
              {img && (
                <div className="max-w-sm">
                  <p className="text-sm mb-2">Preview:</p>
                  <Image
                    src={img}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <input
                ref={fileInputRef}
                onChange={handleImageUpload}
                type="file"
                accept="image/*"
                className="max-w-sm border rounded-lg p-2"
              />
              
              {!isUpdate ?
                (<Button color="primary" className="max-w-sm" onClick={addGift}>
                  Add
                </Button>) : 
                (<Button color="primary" className="max-w-sm" onClick={updateGift}>
                  Update
                </Button>)
              }
              <Button color="primary" className="max-w-sm" onClick={deleteAllGift}>
                Delete All Gift
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 overflow-auto">
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
                    alt={item.name}
                    className="object-cover"
                    height={200}
                    src={item.img}
                    width={200}
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <Button color="primary" onClick={() => handleGift("edit", item.id)}>
                      Edit
                    </Button>
                    <Button color="primary" onClick={() => handleGift("delete", item.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col h-auto gap-4 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-4 w-3/12">
              <div className="text-2xl font-bold">Add Participants</div>
              <input
                onChange={handleCsvFileUpload}
                type="file"
                accept=".csv"
                className="max-w-sm border rounded-lg p-2"
              />
              <Button 
                color="primary" 
                className="max-w-sm" 
                onClick={addParticipants}
                disabled={isAdding}
              >
                {isAdding ? `Adding... ${percent}%` : 'Add Tickets'}
              </Button>

              <Button color="primary" className="max-w-sm" onClick={deleteAllParticipant}>
                Delete All Tickets
              </Button>
              
              <div className="text-lg font-bold">
                {isAdding ? `LOADING ${percent}%` : `Total: ${tickets.length} tickets`}
              </div>
            </div>

            <div className="grid grid-cols-8 gap-4 p-4 w-9/12 rounded-lg border-2 border-stone-950 max-h-[45vh] overflow-auto">
              {tickets.map((item, i) => (
                <Chip key={i}>
                  {item.ticketId || item.phone_no || item.sub_id}
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