import React from 'react'
import AnswerSecond from './AnswerSecond';

export default function Answers({answers}) {
    return (
        <>
            {answers?.map( answer => {
                let SubSections = answer?.solutionSubsections
                return (
                    <div key={answer?.sectionSequence}
                    className="pb-2">
                        <div dangerouslySetInnerHTML={{__html: answer?.sectionHeaderText}}></div>
                        <AnswerSecond SubSections={SubSections}/>
                    </div>
                );
            })}
        </>
    )
}
