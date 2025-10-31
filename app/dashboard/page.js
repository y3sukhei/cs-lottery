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
    if (!confirm("Are you sure you want to delete all tickets?")) return;
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
    if (!confirm("Are you sure you want to delete all gifts?")) return;
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
      if (!confirm("Are you sure you want to delete this gift?")) return;
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
 
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
 
  const cancelEdit = () => {
    setIsUpdate(false);
    setUpdateId(0);
    setName("");
    setDescription("");
    setWinnerCount(0);
    setImg("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage giveaway gifts and participants</p>
            </div>
            <button
              className={`px-6 py-3 w-32 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                isLookTv ? 'bg-[#00b7b1] text-white' : 'bg-[#47be37] text-white'
              }`}
              onClick={handleToggle}
            >
              {isLookTv ? 'Look TV' : 'Univision'}
            </button>
          </div>
        </div>
 
        {/* Gift Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Section */}
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-4">
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    isRequired
                    type="text"
                    label="Gift Name"
                    placeholder="Enter gift name"
                    value={name}
                    variant="bordered"
                  />
                  
                  <Input
                    onChange={(e) => setDescription(e.target.value)}
                    isRequired
                    type="text"
                    label="Gift Description"
                    placeholder="Enter description"
                    value={description}
                    variant="bordered"
                  />
                  
                  <Input
                    onChange={(e) => setWinnerCount(parseInt(e.target.value) || 0)}
                    isRequired
                    type="number"
                    label="Winner Count"
                    placeholder="Number of winners"
                    value={winnerCount}
                    variant="bordered"
                    min="0"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Image
                    </label>
                    <input
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                    />
                  </div>
                  
                  {img && (
                    <div className="relative">
                      <Image
                        src={img}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setImg("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
 
                <div className="space-y-2 pt-4">
                  {!isUpdate ? (
                    <Button
                      color="primary"
                      className="w-full"
                      onClick={addGift}
                      isDisabled={!name || !description || winnerCount <= 0}
                    >
                      Add Gift
                    </Button>
                  ) : (
                    <>
                      <Button
                        color="primary"
                        className="w-full"
                        onClick={updateGift}
                      >
                        Update Gift
                      </Button>
                      <Button
                        variant="bordered"
                        className="w-full"
                        onClick={cancelEdit}
                      >
                        Cancel Edit
                      </Button>
                    </>
                  )}
                  
                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    onClick={deleteAllGift}
                    isDisabled={gifts.length === 0}
                  >
                    Delete All Gifts
                  </Button>
                </div>
              </div>
              
              {/* Gift Grid Section */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Current Gifts</h3>
                    <span className="text-sm text-gray-500">{gifts.length} items</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {gifts.length === 0 ? (
                      <div className="col-span-full text-center py-12 text-gray-400">
                        No gifts added yet
                      </div>
                    ) : (
                      gifts.map((item, i) => (
                        <Card
                          isFooterBlurred
                          key={i}
                          radius="lg"
                          className="border-none hover:shadow-lg transition-shadow"
                        >
                          <CardHeader className="flex-col items-start px-4 pt-4 pb-2">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">Winners: {item.winnerCount}</p>
                          </CardHeader>
                          <Image
                            alt={item.name}
                            className="object-cover"
                            height={150}
                            src={item.img}
                            width="100%"
                          />
                          <CardFooter className="justify-between bg-white/90 border-t border-gray-200 py-2 px-4">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={() => handleGift("edit", item.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onClick={() => handleGift("delete", item.id)}
                            >
                              Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Participants Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Upload Section */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    onChange={handleCsvFileUpload}
                    type="file"
                    accept=".csv"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload a CSV file with participant data</p>
                </div>
 
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{tickets.length}</div>
                    <div className="text-sm text-gray-500">Total Tickets</div>
                  </div>
                </div>
 
                {isAdding && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading...</span>
                      <span className="text-sm font-bold text-blue-900">{percent}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
 
                <div className="space-y-2">
                  <Button
                    color="primary"
                    className="w-full"
                    onClick={addParticipants}
                    isDisabled={isAdding || csvDataRef.current.length === 0}
                  >
                    {isAdding ? `Uploading ${percent}%` : 'Add Tickets'}
                  </Button>
                  
                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    onClick={deleteAllParticipant}
                    isDisabled={tickets.length === 0}
                  >
                    Delete All Tickets
                  </Button>
                </div>
              </div>
              
              {/* Tickets Grid Section */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Participant Tickets</h3>
                    <span className="text-sm text-gray-500">{tickets.length} tickets</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 max-h-[500px] overflow-y-auto pr-2">
                    {tickets.length === 0 ? (
                      <div className="w-full text-center py-12 text-gray-400">
                        No tickets uploaded yet
                      </div>
                    ) : (
                      tickets.map((item, i) => (
                        <Chip
                          key={i}
                          variant="flat"
                          size="sm"
                        >
                          {item.ticketId || item.phone_no || item.sub_id}
                        </Chip>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default DashBoardPage;