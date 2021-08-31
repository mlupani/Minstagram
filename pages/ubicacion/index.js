import React from 'react'
import Head from 'next/head'
import router from 'next/router'
import PlacesAutocomplete from 'react-places-autocomplete';
import { Arrow_icon } from 'components/icons'
import useLocation from 'hooks/useLocation';

const Ubicacion = () => {

    const { loaded, search, handleChange, handleSelect } = useLocation();

    if(loaded)
    return (
        <>
        <Head>
            <title>Agregar ubicaci&oacute;n</title>
        </Head>
        <div className="container" style={{"padding":"0"}}>
            <div className="row">
                <div className="col-1" style={{"paddingLeft": "20px"}} ><a onClick={() => router.back()} style={{"textDecoration":"none", "color":"black"}}><Arrow_icon/></a></div>
                <div className="col-9" style={{"textAlign":"center","marginTop":"7px"}}><h5>Agregar Ubicaci&oacute;n</h5></div>
            </div>
            <div className="row">
                <div className="col-12" >
                   <PlacesAutocomplete value={search} onChange={handleChange} onSelect={handleSelect}>
                       {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                       <div>
                            <input
                            {...getInputProps({
                                placeholder: 'Buscar una ubicacion',
                                className: 'location-search-input form-control mr-sm-2',
                            })}
                            />
                            <div className="autocomplete-dropdown-container">
                            {loading && <div style={{"textAlign":"center"}} className="col-12"><br></br><img width="42" height="42" src='/loading.gif'></img></div>}
                            <ol className="list-group">
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                    <div key={suggestion.placeId}
                                        {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                        })}
                                    >
                                    <li style={{"cursor":"pointer"}} key={suggestion.placeId} className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                        <div className="fw-bold">{suggestion.description}</div>
                                        </div>
                                    </li>
                                    </div>
                                    );
                                })}
                            </ol>
                            </div>
                        </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </div>
        </div>
        </>
    );
    else
        return <div className="col-12" style={{"marginTop":"150px","textAlign":"center"}}><img width="35" height="35" src='loading.gif'></img></div>
}

export default Ubicacion;
