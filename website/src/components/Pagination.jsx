import React,{useState, useEffect, useContext} from 'react'
import { Button } from 'react-bootstrap'
import useBooks from  '../hooks/useBooks';
import {AdminContext} from '../context/AdminContext';


function Pagination({pagination}) {
    const [pageno, setPageNo] = useState(window.localStorage.getItem('pageno'));
    const {dispatch: adminDispatch} = useContext(AdminContext);
    const {isLoading} = useBooks();
    useEffect(() => {
        adminDispatch({type: 'Book_CurrentPage',payload: pageno});
        if(
            window.localStorage.getItem('pageno') === undefined || 
            window.localStorage.getItem('pageno') === null
        ){
            window.localStorage.setItem('pageno', 1)
        }else{
            window.localStorage.setItem('pageno', pageno)
        }
        console.log(" after load " , window.localStorage.getItem('pageno'))
    },[pageno])
    return (
        <div style={{ display: 'flex', flexContent: 'space-between'}}>
            <Button className="dark" 
            disabled={pagination && !pagination.hasPrevPage}
            value={pagination && pagination.prev}
            onClick={e => setPageNo(e.target.value)}
            > <span className="fa fa-arrow-circle-o-left text-success"></span></Button>
            <select className="form-control" 
            onChange={e => setPageNo(e.target.value)}
            >
                <option value="1">{isLoading ?'Pro...':'Page'}</option>
                {[...Array(pagination && pagination.pageCount).fill().map( (t,i) => {
                    return (
                        <option value={i+1}
                        key={i+1}
                        selected={(pagination && pagination.currentPage === +i+1)?'selected':''}
                        >{i+1}</option>
                    )
                })]}
            
            </select>
            <Button className="dark"
            value={pagination && pagination.next}
            disabled={pagination && !pagination.hasNextPage}
            onClick={e => setPageNo(e.target.value)}
            > <span className="fa fa-arrow-circle-o-right text-success"></span></Button>
        </div>
    )
}

export default Pagination
