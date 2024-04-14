import JSConfetti from 'js-confetti'
import { useEffect } from 'react';
import {Image,Code} from "@nextui-org/react"
const WinnerModal = (props) => {
    useEffect(()=>{
        const jsConfetti = new JSConfetti()
        console.log("props :", props)
        jsConfetti.addConfetti()
    },[])
    return (
        <div className='flex flex-col gap-4 p-8 items-center'>
            <div className='text-black font text-4xl text-center font-bold'>
                {props.gift.name}
            </div>
            {/* <p className='text-sm'>{props.gift.description}</p> */}
                <Image
                  removeWrapper
                  alt="Relaxing app background"
                  className="z-0 w-1/2 h-1/2 object-fit"
                  src={props.gift?.img}
                />
                  <Code className='text-black font text-6xl text-center font-bold'>{props.number}</Code>
                <div className='text-black font text-4xl text-center font-bold'>
                 Баяр хүргэе та азтан боллоо <br/> &#127881; &#127881; &#127881;
            </div>
        </div>
       
      
       
    );
}

export default WinnerModal;