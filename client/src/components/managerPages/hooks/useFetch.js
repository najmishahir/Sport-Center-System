//Part of code was taken from GitHub
//https://github.com/safak/youtube2022/tree/mern-booking
//youtube2022/client/src/hooks/useFetch.js

import {useEffect, useState} from "react"
import axios from 'axios';

const useFetch = (url) =>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=> {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                setError(error) 
            }
            setLoading(false);
        };
        fetchData(); 
    }, [url])
    return {data, loading, error}
};

export default useFetch; 