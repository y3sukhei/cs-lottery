import {Button} from "@nextui-org/button";
const DashBoardPage = () => {
    return (
        <main className="px-16 py-6">
        <div className="flex flex-col">
            <div className="h-auto rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
                <div >DashBoard Page</div>
                <Button color="primary">Hello</Button>
            </div>
            {/* <div className="flex flex-row rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl m-5">
                <div className="">DashBoard Page</div>
                <Button color="primary">Hello</Button>
            </div> */}
            
        </div>
            </main>
    );
}

export default DashBoardPage;