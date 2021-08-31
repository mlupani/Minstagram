import { useEffect, useState } from "react";
import router from "next/router";
import {
	geocodeByAddress,
} from "react-places-autocomplete";

const useLocation = () => {

    const [search, setSearch] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [selectedPlace, setSelectedPlace] = useState("");
	const [placeLoaded, setPlaceLoaded] = useState(null);

		useEffect(() => {
			var tag = document.createElement("script");
			tag.setAttribute("id", "scriptGoogle");
			tag.src =
				"https://maps.googleapis.com/maps/api/js?&key=" +
				process.env.NEXT_PUBLIC_APIKEY_GOOGLE +
				"&libraries=places";
			tag.addEventListener("load", () => setLoaded(true));

			if (!loaded) {
				if (!document.getElementById("scriptGoogle"))
					document.body.appendChild(tag);
				else setLoaded(true);
			}

			if (window.localStorage.getItem("placeSelected") && !placeLoaded) {
				setSelectedPlace(localStorage.getItem("placeSelected"));
				setPlaceLoaded(1);
			}
		}, []);

		const handleChange = (address) => {
			setSearch(address);
		};

		const handleSelect = (address) => {
			geocodeByAddress(address)
				.then(() => {
					window.localStorage.setItem("placeSelected", address);
					router.back();
				})
				.catch((error) => console.error("Error", error));
		};

		const handleRemovePlace = () => {
			window.localStorage.removeItem("placeSelected");
			setSelectedPlace("");
		};

    return {
			search,
			loaded,
			handleChange,
			handleSelect,
			handleRemovePlace,
			selectedPlace,
			placeLoaded,
		};
}

export default useLocation
