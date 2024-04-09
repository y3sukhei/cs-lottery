"use client";
import Image from "next/image";
import {
  Tabs,
  Tab,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
} from "@nextui-org/react"; 
import { useState } from "react";

export default function Home() {
  const [random, setRandom] =  useState(0);

  const duration = 5000;

  const getRandom = ()=>{
    setRandom(Math.floor(Math.random() * 99));
    
  }

  return (
    <main className="flex  min-h-screen flex-col items-center justify-between p-24 rounded-lg">
      <div>
      <Button onClick={()=>{getRandom()}}>Reset</Button>
      {/* <div>{random}</div> */}
      </div>
     <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
      <div className="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt className="text-base leading-7 text-gray-600">Transactions every 24 hours</dt>
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          <span className="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-transactions)] before:content-[counter(num)]"> <span className="sr-only">44</span>million </span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt className="text-base leading-7 text-gray-600">Assets under holding</dt>
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          $<span className="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-assets)] before:content-[counter(num)]"> <span className="sr-only">119</span> trillion </span>
        </dd>
      </div>
      <div className="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt className="text-base leading-7 text-gray-600">New users annually</dt>
        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          <span className="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-users)] before:content-[counter(num)] before:left-[calc(0.4em * var(--n, 1))]">
            <span className="sr-only">4600</span>
          </span>
        </dd>
      </div>
    </dl>
  </div>
</div> 
    </main>
  );
}
