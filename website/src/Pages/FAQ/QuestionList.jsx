import React from 'react'

function QuestionList({faqLists}) {
return (
    <div className="col-md-12">
        {faqLists.map(content => {
            return(
                <div className="card p-2 mb-2" key={content._id}>
                    <div className="card-heading">
                        <strong>Question</strong>: {content.question}
                    </div>
                    <div className="card-body p-0">
                        <strong>Answer</strong>: {content.answer}
                    </div>
                </div> 
            );
        })}
    </div>
)
}

export default QuestionList
