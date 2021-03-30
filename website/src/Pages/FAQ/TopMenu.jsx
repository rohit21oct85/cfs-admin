import React from 'react';
import Pagination from '../../components/Pagination';

function TopMenu({data}) {
    return (
        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <button className="dark mr-1">
                    Add Faq Category
                </button>
                <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                    <Pagination pagination={data && data.pagination}/>
                </div>    
            </div>
        </div>
    )
}

export default TopMenu
