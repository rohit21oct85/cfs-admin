import React from 'react'

export default function AnswerSecond({SubSections}) {
    return (
        <>
        {SubSections?.map(solution => {
            return(
                <div key={solution?.sectionSequence}
                style={{ width: '99%', margin: '0 auto', boxShadow: '1px 0px 1px 1px rgba(0,0,0,0.2)'}}
                className="br-10 mb-2 mt-1 card p-2">
                    <h4>{solution?.sectionName}</h4>
                    <hr className="mt-1 mb-2"/>
                    <div dangerouslySetInnerHTML={{__html: solution?.sectionText}}></div>
                </div>
            );
        })}
        </>
    )
}
