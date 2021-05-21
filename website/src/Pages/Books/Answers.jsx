import React from 'react'
import AnswerSecond from './AnswerSecond';
import { htmlConverterReact } from 'html-converter-react';

export default function Answers({answers, type}) {
    return (
        <>
            {type == "ans" && answers?.map( answer => {
                let SubSections = answer?.solutionSubsections
                return (

                    <div key={answer?.sectionSequence}
                    className="pb-2">
                        <div dangerouslySetInnerHTML={{__html: answer?.sectionHeaderText}}></div>
                        <AnswerSecond SubSections={SubSections}/>
                    </div>
                );
            })}
            
            {type == "exp_ans" && answers?.map( answer => {
                return (

                    <div key={answer?.answer_sequence}
                    style={{ width: '99%', margin: '0 auto', boxShadow: '1px 0px 1px 1px rgba(0,0,0,0.2)'}}
                    className="br-10 mb-2 mt-1 card p-2">
                        {htmlConverterReact(answer?.answer)}
                    </div>
                );
            })}

        </>
    )
}
