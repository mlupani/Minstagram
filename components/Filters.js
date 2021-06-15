import React from 'react';

const Filters = ({dataFilters, setFilter, filterApplied}) => {
    return (
        <div className="container" style={{"padding":"0"}}>
            <div className="row" style={{"overflow":"scroll","padding":"20px","paddingTop":"50px","paddingLeft":"0px"}}>
                <div className="col-12">
                    <ul style={{"display":"flex","textDecoration":"none","listStyle": "none","fontSize":"12px","paddingLeft":"10px","textAlign":"center"}}>
                        {
                            dataFilters.map(filter =>
                                <div key={filter} onClick={()=>setFilter(filter)} className="col-4">
                                    <li>{filter}
                                    <figure className={`filter-${filter.toLowerCase()}`}>
                                        <img style={{"width":"100px","height":"100px", 'border':`${filter.toLowerCase() == filterApplied.toLowerCase() ? '2px solid black':'none'}`}} src="/preview_filter.jpg"></img>
                                    </figure>
                                    </li>
                                </div>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Filters;
