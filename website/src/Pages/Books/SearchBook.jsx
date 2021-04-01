import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios';
import * as cons from '../../Helper/Cons.jsx'
import {Form} from 'react-bootstrap';
import * as utils from '../../utils/MakeSlug';
import BookImage from './BookImage';
import BookHeading from './BookHeading';

import {AuthContext} from '../../context/AuthContext.jsx';

function SearchBook() {
    const history = useHistory();
    const {state } = useContext(AuthContext);
    const [search, setSearch] = React.useState('');
    const [searchData, setSearchData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleSearchItem = (e) => {
        setSearch(e.target.value)   
    }
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    React.useEffect( () => {
        async function searchResult(search){
            if(search && search.length >= 3){
                setIsLoading(true);
                const response = await axios.get(`${API_URL}books/search/${search}`,{
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization':'Bearer '+state.access_token
                    }
                });
                const responseData = response.data.data;
                
                if(responseData.length){
                    setSearchData(responseData);
                    setIsLoading(false);
                    
                }else{
                    setIsLoading(true);    
                    setSearchData([]);
                    
                }
                
            }else{
                setIsLoading(true);
                setSearchData([]);
            }
        }
        searchResult(search)
    },[search,searchData.length])
    const handleAdd = async (isbn, book, id) => {
        const book_name = await utils.MakeSlug(book);
        
        history.push(`/upload-chapters/${isbn}/${book_name}/${id}`);
    }
    return (
        <div style={{ position: 'relative', width: '250px' }}>
            <div>
            <Form>
                <Form.Group style={{ margin: '0px 10px' }}>
                    <Form.Control 
                    name="isbn" 
                    value={search} 
                    placeholder="Search Book by ISBN 13" 
                    autoFocus={true}
                    autoComplete="off"
                    maxLength="13"
                    onChange={handleSearchItem}
                    onKeyDown={ 
                        e => {
                            if(e.key === 'Enter'){
                                e.preventDefault();
                            }
                        }
                    }
                    />
                </Form.Group>
            </Form>
            </div>
            {!isLoading && (
            <div className="search-result">
                <ul>
                    {searchData && searchData.map(books => (
                        
                        <li className="items pb-2" key={books._id}>
                            <div className="row p-2">
                                <div className="col-md-3 pl-0">
                                    <BookImage isbn={books.ISBN13}  width="100%"/>
                                </div>
                                <div className="col-md-9">    
           
            <div className="subject-card-body">
                <div className="admin-name"> 
                    <div className="name-label">
                        BookName: 
                    </div>
                    <div className="name-main">
                        {utils.GetString(books.BookName,20)}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Subject: 
                    </div>
                    <div className="name-main">
                        {books.subject_name}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Sub Subject: 
                    </div>
                    <div className="name-main">
                        {utils.GetName(books.sub_subject_name)}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        ISBN13: 
                    </div>
                    <div className="name-main">
                        {books.ISBN13}
                    </div>
                </div> 
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Book Edition: 
                    </div>
                    <div className="name-main">
                        {books.Edition}
                    </div>
                </div> 
        </div>
        
        </div>
                                
                            </div>
                            <hr className="mt-1 mb-1"/>
                            <BookHeading books={books}/>
                            
                        </li>
                    ))}
                </ul>    
            </div>
            ) }
            {searchData.length === 0 && search.length > 3  && ( 
            <div className="col-md-12 search-result">
                <ul>
                    <li className="items">
                        <p className="book_item">No Matching Results Found</p>
                    </li>
                </ul>
            </div>
            )}
            
        </div>
    )
}

export default SearchBook
