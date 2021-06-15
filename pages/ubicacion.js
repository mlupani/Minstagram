import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import router from 'next/router'
import { Arrow_icon } from 'components/icons'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

const Ubicacion = () => {

    const [search, setSearch] = useState('')
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        var tag = document.createElement('script');
        tag.setAttribute("id", "scriptGoogle");
        tag.src = 'https://maps.googleapis.com/maps/api/js?&key='+process.env.NEXT_PUBLIC_APIKEY_GOOGLE+'&libraries=places'
        tag.addEventListener('load', ()=> setLoaded(true))

        if(!loaded)
        {
            if(!document.getElementById("scriptGoogle"))
                document.body.appendChild(tag)
            else
                 setLoaded(true)
        }

    },[])

    const handlePlaceSelected = (e, lugar) => {

        localStorage.setItem("placeSelected", lugar);
        router.back()
    }

    const handleChange = address => {
        setSearch(address)
    };

    const handleSelect = address => {
        geocodeByAddress(address)
        .then(results => {
            localStorage.setItem("placeSelected", address)
            router.back()
        })
        .catch(error => console.error('Error', error));
    };

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
                   {/*<input ref={buscar} onChange={(e)=>setSearch(e.target.value)} className="form-control mr-sm-2" type="search" placeholder="Buscar una ubicacion" aria-label="Search"></input>*/}
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
