import React from 'react'

export default function Button({placeholder, counter, srNo}) {
    return (
        <button className="btn dark btn-sm br-10 mb-2 text-left"
                    style={{ position: 'relative', width: '150px', overflow: 'hidden'}}>
            {placeholder}: {srNo}
            <span className="badge-success p-1"
            style={{ position: 'absolute', right: '0px', top: '0px'}}>
            {counter}</span>
            
        </button>
    )
}
