import { useEffect, useState } from "react";

function LocationSelector({ change, divission, district, upozilla, union, start }) {
    const ApiServer = process.env.NEXT_PUBLIC_API_URL

    //after change parent
    const [dist, setDist] = useState([]);
    const [upoz, setUpoz] = useState([]);
    const [unio, setUnio] = useState([]);

    //selected value
    const [div, setDiv] = useState('');
    const [dis, setDis] = useState('');
    const [upo, setUpo] = useState('');
    const [uni, setUni] = useState('');

    const [divState, setDivState] = useState([]);
    const [disState, setDisState] = useState([]);
    const [upoState, setUpoState] = useState([]);
    const [uniState, setUniState] = useState([]);
    //new selected items
    const [divStateNew, setDivStateNew] = useState('');
    const [disStateNew, setDisStateNew] = useState('');
    const [upoStateNew, setUpoStateNew] = useState('');
    const [uniStateNew, setUniStateNew] = useState('');
    async function data() {
        await (await fetch(`${ApiServer}/divissions`)).json().then(data => { setDivState([{ name: '' }].concat(data.divissions)) }).then(async () => {
            await (await fetch(`${ApiServer}/districts`)).json().then(data => {
                setDisState(data.districts);
                setDist([{ name: district }])
            })
        }).then(async () => {
            await (await fetch(`${ApiServer}/upozillas`)).json().then(data => {
                setUpoState(data.upazillas);
            }).then(() => {
                setUpoz([{ name: upozilla }]);
            })
        }).then(async () => {
            await (await fetch(`${ApiServer}/unions`)).json().then(data => {
                setUniState(data.unions)
            }).then(() => {
                setUnio([{ name: union }]);
            })
        })
            .then(() => { setDiv(divission) })
            .then(() => { setDis(district) })
            .then(() => { setUpo(upozilla) })
            .then(() => { setUni(union) })
    }
    useEffect(() => {
        data()
        return () => { };
    }, [start]);


    const divChange = (e) => {
        setDiv(e.target.value);
        setDis('');
        setUpo('');
        setUni('');
        //--
        setDivStateNew(e.target.value);
        setDisStateNew('');
        setUpoStateNew('');
        setUniStateNew('');
        //--
        let newData = disState.filter((el) => { return el.divission == e.target.value });
        setDist([{ divission: e.target.value, name: '' }].concat(newData));
        setUpoz([{ divission: e.target.value, name: '' }]);
        setUnio([{ divission: e.target.value, name: '' }]);
        //--
        change(e.target.value, '', '', '');
    }
    const disChange = (e) => {
        setDis(e.target.value);
        setUpo('');
        setUni('');
        //--
        setDisStateNew(e.target.value);
        setUpoStateNew('');
        setUniStateNew('');
        //--
        let newData = upoState.filter((el) => { return el.district == e.target.value });
        setUpoz([{ district: e.target.value, name: '' }].concat(newData));
        setUnio([{ divission: e.target.value, name: '' }]);
        //--
        change(divStateNew, e.target.value, '', '');
    }
    const upoChange = (e) => {
        setUpo(e.target.value);
        setUni('');
        //--
        setUpoStateNew(e.target.value);
        setUniStateNew('');
        //--
        let newData = uniState.filter((el) => { return el.upazilla == e.target.value });
        setUnio([{ upazilla: e.target.value, name: '' }].concat(newData));
        //--
        change(divStateNew, disStateNew, e.target.value, uniStateNew);
    }
    const uniChange = (e) => {
        setUni(e.target.value);

        change(divStateNew, disStateNew, upoStateNew, e.target.value);
    }


    return (
        <div>
            <div className=' w-full' >
                <div className="flex w-full flex-wrap mt-2 mb-2 border border-indigo-500 rounded-lg p-6">
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Divission</label>
                        <div className="relative">
                            <select onChange={(event) => { divChange(event) }} value={div.toString() || divission} className="block appearance-none w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-900 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                {divState.map((item, index) => (<option onClick={(event) => { divChange(event) }} key={index} value={item.name} >{item.name ? item.name : 'Select one'}</option>))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">District</label>

                        <div className="relative">
                            <select onChange={(event) => { disChange(event) }} value={dis.toString() || district} className="block appearance-none w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-900 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                {dist.map((item, index) => (<option key={index} value={item.name} >{item.name ? item.name : 'Select one'}</option>))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Upazila</label>

                        <div className="relative">
                            <select onChange={(event) => { upoChange(event) }} value={upo.toString() || upozilla} className="block appearance-none w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-900 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                {upoz.map((item, index) => (<option key={index} value={item.name} >{item.name ? item.name : 'Select one'}</option>))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">

                        <label className="block text-gray-800 dark:text-gray-200 mb-1">Union</label>
                        <div className="relative">
                            <select onChange={(event) => { uniChange(event) }} value={uni.toString() || union} className="block appearance-none w-full bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-900 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                {unio.map((item, index) => (<option key={index} value={item.name} >{item.name ? item.name : 'Select one'}</option>))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}



export default LocationSelector;