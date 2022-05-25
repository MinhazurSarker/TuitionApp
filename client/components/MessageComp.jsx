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
                        <p className="text-sm">{text}</p>
                        {img !== null && img !== '' ?
                            <img onClick={openImage} className=" w-auto h-44 rounded-md mt-2" src={img} alt="" />
                            : <></>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessageComp;