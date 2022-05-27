import moment from "moment";
import Swal from "sweetalert2";

function MessageComp({ own, text, img,time }) {
    const openImage =()=>{
        Swal.fire({
            imageUrl: img,
            imageHeight: '100%',
            imageWidth: '100%',
            imageAlt: 'image',
            width:'80%',
          })
    }
    return (
        <>
            <div className={`${own == true ? 'flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end' : 'flex w-full mt-2 space-x-3 max-w-xs'}`}>
                <div>
                    <div className={`${own == true ? 'bg-indigo-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 dark:bg-gray-700 dark:text-white p-3 rounded-r-lg rounded-bl-lg '} `}>
                        <p className="text-md">{text}</p>
                        {img !== null && img !== '' ?
                            <img onClick={openImage} className=" w-auto h-44 rounded-md mt-2" src={img} alt="" />
                            : <></>}
                    </div>
                    <p style={{ 'fontSize': '8pt', }} className={`${own == true ?' text-right':'text-left'} mb-1 text-gray-800/80 dark:text-gray-200/50`}>{moment(time).fromNow()}</p>
                </div>
            </div>
        </>
    );
}

export default MessageComp;