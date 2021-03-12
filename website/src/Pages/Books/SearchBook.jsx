import React from 'react'
import {useHistory} from 'react-router-dom'
import * as api from '../../Helper/ApiHelper';
import {Form} from 'react-bootstrap';
import {MakeSlug, GenerateImage} from '../../utils/MakeSlug';

function SearchBook() {
    const history = useHistory();
    const [search, setSearch] = React.useState('');
    const [searchData, setSearchData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleSearchItem = (e) => {
        setSearch(e.target.value)   
    }
    
    React.useEffect( () => {
        async function searchResult(search){
            if(search && search.length >= 3){
                setIsLoading(true);
                const response = await api.get(`books/search/${search}`);
                const responseData = response.data.data;
                
                if(responseData.length){
                    setSearchData(responseData);
                    setIsLoading(false);
                    console.log(searchData.length)
                }else{
                    setIsLoading(true);    
                    setSearchData([]);
                    console.log(searchData.length)
                }
                
            }else{
                setIsLoading(true);
                setSearchData([]);
            }
        }
        searchResult(search)
    },[search,searchData.length])
    const handleAdd = async (isbn, book, id) => {
        const book_name = await MakeSlug(book);
        console.log(book_name);
        history.push(`/upload-chapters/${isbn}/${book_name}/${id}`);
    }
    return (
        <div className="row p-0" style={{ position: 'relative', width: '512px' }}>
            <div className="col-md-12">
            <Form style={{  display: 'flex', justifyContent: 'space-between' }}>
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
            <div className="col-md-12 search-result">
                <ul>
                    {searchData && searchData.map(data => (
                        <li className="items" key={data._id}
                        onClick={handleAdd.bind(this,data.ISBN13,data.BookName,data._id)}
                        >
                            <div className="row p-2">
                                <div className="col-md-3 pl-0 pr-0">
                                    <img src={`https://www.crazyforstudy.com/uploads/book-images-with-text/IMG-${data.ISBN13}.jpg`} className="img-responsive" style={{ width: "80%"}}/>
                                </div>
                                <div className="col-md-9 pl-0">
                                    <p className="book_item">
                                        <span>Subject: </span>
                                        <span>{data.sub_subject_name}</span>
                                    </p>
                                    <p className="book_item">
                                        <span>ISBN: </span>
                                        <span onClick={GenerateImage}>{data.ISBN13}</span>
                                    </p>
                                    <p className="book_item">
                                        <span>Edition: </span>
                                        <span>{data.Edition}</span>
                                    </p>
                                    <p className="book_item">
                                        <span>Author: </span>
                                        <span>{data.Author1.substr(0,20)}</span>
                                    </p>
                                    <p className="book_item">
                                        <span>BookName: </span>
                                        <span>{data.BookName.substr(0,20) }</span>
                                    </p>
                                </div>
                            </div>
                            
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
