import React,{useEffect,useState} from 'react'
import axios from 'axios'

function BookImage({bookname, isbn}) {
    const [image, setImage] = useState('');
    
    let first_name;
    let middle_name;
    if(bookname){
        const book = bookname.split('-');
        first_name = book[0];
        middle_name = book[1];
    }else{
        first_name = "Sample";
        middle_name = "Book";
    }
    useEffect(() => {
        console.log(isbn)
       async function fetchCoverImage(){
            const response = await axios.get(`https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`);
            if(response.status === 200){
              setImage(`https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`);
            }
       }
       fetchCoverImage();
    },[isbn])
    return (
        <>
        {image && (<img src={image} style={{ width: "100%"}}/>)}
        {!image && (
        <div className="book_image_container">
            <img src={`https://www.crazyforstudy.com/uploads/book-images-with-text/IMG-${isbn}.jpg`} style={{ width: "100%"}}/>
        </div>
        )}
        </>
    )
}

export default BookImage
