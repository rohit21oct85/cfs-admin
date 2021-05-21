import React from 'react'
import {useHistory} from 'react-router-dom'
import Answers from './Answers'

import '../Chapters/math.css';
// import HighlighterComponent from '../../components/HighlighterComponent';

function Question({problem, search}) {
    
    const history = useHistory();
    const manageQuestion = (e) => {
        history.push(`/book-chapter-add-question/${e?.q_id}`)
    }
    let answers = '';
    if(problem?.source == "bartelby"){
        answers = JSON.parse(problem?.answer);
    }else{
        answers = problem?.answer;
    }

    return (
        <>
        <div className="card col-md-12 mb-2" key={problem?.problem_no}>
        <div className="card-title col-md-12 p-0 mb-0" id={problem?.problem_no}> 
            <div className="subject-card-heading pt-2"> 
                <div className="problem_no">Q.No: {problem?.problem_no} </div>
                <div>
                    <button className="btn btn-sm dark"
                    onClick={manageQuestion.bind(this,{q_id: problem?.q_id})}>Manage Question</button>
                </div>    
                
            </div>
        </div>
        {console.log(problem)}
        {problem?.question != '' &&  (

            <div className="card-body" style={{ padding: '0px 0px 10px 0px' }}>
            <hr style={{ padding: '0px', margin: '5px 0px' }}/>
            
            
            <div className="card-text question" id="high" dangerouslySetInnerHTML={{ __html: problem?.question  }} />
            {problem?.image && (
                <div style={{ height: '130px', overflow: 'hidden', marginTop: '10px' }}>
                    <img src={problem?.image} />
                </div>
            )}
            {problem?.source === "bartelby" ? (
                <Answers answers={answers} key={problem?.q_id}/>
            ) : (

                <div className="answer" dangerouslySetInnerHTML={{ __html: answers  }} />
            )}
                
            </div>
        )}
        
        </div>    
        </>
    )
}

export default Question
