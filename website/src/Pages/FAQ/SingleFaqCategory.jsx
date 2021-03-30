import React from 'react'
import Heading from './Heading';

function SingleFaqCategory({faq}) {
    return (
        <div className="small-card" key={faq._id} id={`card-${faq._id}`}>

            <div className="subject-card-body ">
            <div className="admin-name"> 
                <img src={faq.faq_image} style={{ width: '100px'}}/>
                <div className="name-main">
                    {faq.faq_category}
                </div>
            </div>     
            </div> 

            
            
            <hr className="mt-1 mb-1"/>
            <Heading faq={faq}/>

        </div>
    )
}

export default SingleFaqCategory
