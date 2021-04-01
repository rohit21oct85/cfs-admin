import React from 'react'
import {useParams} from 'react-router-dom'
import QuestionHeading from './QuestionHeading';

function QuestionList({faqLists}) {
    const params = useParams();
    return (
        <div className="col-md-12">
            <h4>All Faq Question - {params.faq_category}</h4>
            <hr />
            <div id="questionDiv" style={{ height: '400px', overflow: 'scroll', paddingRight:'15px' }}>
            {faqLists && faqLists.map(content => {
                return(
                    <div className="card p-2 mb-2" key={content._id}>
                        <div className="card-heading">
                            <strong>Question</strong>: {content.question}
                        </div>
                        <div className="card-body p-0">
                            <strong>Answer</strong>: {content.answer}
                        </div>
                        <hr style={{ margin: '5px 0px'}}/>
                        <QuestionHeading content={content}/>
                    </div> 
                );
            })}
            </div>
        </div>
    )
}

export default QuestionList
