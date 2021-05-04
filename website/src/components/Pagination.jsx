import React,{useState, useEffect, useContext} from 'react'
import { Button } from 'react-bootstrap'
import useBooks from  '../hooks/useBooks';
import {AdminContext} from '../context/AdminContext';


function Pagination({pagination}) {
    const [pageno, setPageNo] = useState(1);
    const {dispatch: adminDispatch} = useContext(AdminContext);
    const {isLoading} = useBooks();
    async function paginateFunction() {
        adminDispatch({type: 'Book_CurrentPage',payload: pageno});
        window.localStorage.setItem('pageno', pageno)
    }
    useEffect(paginateFunction,[pageno])
    return (
        <div style={{ display: 'flex', flexContent: 'space-between'}}>
            <Button className="dark" 
            disabled={!pagination?.hasPrevPage}
            onClick={e => setPageNo(parseInt(pagination?.prev))}
            > <span className="fa fa-arrow-circle-o-left text-success"></span></Button>
            <select className="form-control" 
            onChange={e => setPageNo(e.target.value)}
            >
                <option value="1">{isLoading ?'Pro...':'Page'}</option>
                {[...Array(pagination?.pageCount).fill().map( (t,i) => {
                    return (
                        <option value={i+1}
                        key={i+1}
                        selected={(pagination?.currentPage === +i+1)?'selected':''}
                        >{i+1}</option>
                    )
                })]}
            
            </select>
            <Button className="dark"
            disabled={!pagination?.hasNextPage}
            onClick={e => setPageNo(parseInt(pagination?.next))}
            > <span className="fa fa-arrow-circle-o-right text-success"></span></Button>
        </div>
    )
}

export default Pagination
