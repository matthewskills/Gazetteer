let mymap

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
maxZoom: 20,
attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


const cityIcon = L.icon({
    iconUrl: './app/markers/city.png',
    iconSize:     [34, 34], // size of the icon

});
const battleIcon = L.icon({
    iconUrl: './app/markers/battle.png',
    iconSize:     [34, 34], // size of the icon
});

const railIcon = L.icon({
    iconUrl: './app/markers/trains.png',
    iconSize:     [34, 34], // size of the icon
});
const hotelsIcon = L.icon({
    iconUrl: './app/markers/hotels.png',
    iconSize:     [34, 34], // size of the icon
});
const touristsIcon = L.icon({
    iconUrl: './app/markers/tourist.png',
    iconSize:     [34, 34], // size of the icon
});

async function setMap(ctry) {

 await   $.ajax({
        url: 'https://mattskills.co.uk/projects/gazetteer/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: { countryName: ctry },
        success: result => {
            console.log(`The map was set with the following data:`)
            console.log(result);

            const homeCountryName = result['homeCountryName'];
            const coords = result['coords'];
            const wiki = result['wiki'];
            let wikiSummary
            try {
            const wikiLink = `( <a href="https://${wiki['wikiUrl']}" target="_blank">Read More</a> )`;
             wikiSummary = wiki['summary'].replace('(...)', wikiLink )
            } catch(err) {
                wikiSummary = "<small>Sorry, Couldn't find data from Wikipedia</small>";
            }

            const countryBorders = result['countryBorders'];
            const countryList = result['countryList'];
            const countryInfo = result['countryInfo'][0];
            const cities = result['cities'];
            const exchangeRates = result['exchangeRates'];
            const weather = result['weather'];
            const poi = result['poi']['features'];
            const railStations = result['railStations']['features'];
            const hotels = result['hotels']['features'];
            const touristSpots = result['touristSpots']['features'];
            const newsProviders = result['newsProviders']['sources'];

            let sunset
            try {
            sunset = new Date(weather['sys']['sunset']);
            } catch(err) {
               console.log(`Couldn't make the sunset time a date, probably because there was no result: ${err}`)
            }



            mymap = L.map('map', {
                layers: [Stadia_AlidadeSmoothDark, Stadia_Outdoors]
            })

            mymap.setView([coords['lat'], coords['lng']],10);

            var baseMaps = {
                "Light Mode": Stadia_Outdoors,
                "Dark Mode": Stadia_AlidadeSmoothDark
            };



            L.geoJSON(countryBorders, {
                style: {color: "#ff0047", fillColor: "#0078ff"} 
            }).addTo(mymap);

            bounds =  L.geoJSON(countryBorders).getBounds();
            mymap.fitBounds(bounds, {padding: [50,50]})

            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>', function(){
                countryMarkerOnClick();
              }).addTo(mymap);

            
            function countryMarkerOnClick() {
            $("#countryInfoBoxLabel").html(`<img src="https://www.countryflags.io/${countryInfo['countryCode']}/flat/64.png"> ${ctry} - ${countryBorders['properties']['iso_a2']} `)
            $("#countryInfoBoxBody").html(`
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Capital City:</strong> ${countryInfo['capital']}
            </p>
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Continent:</strong> ${countryInfo['continentName']}
            </p>
            <p class="modalList" >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            <strong>Population:</strong> ${countryInfo['population']}
            </p>
            <p class="modalList" id="wikiSummary">
            <img src="${wiki['image']}" alt="${ctry}" height="100" />
            ${wikiSummary}
            </p>`);
            $('#countryInfoBox').modal('show');
            }


            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', function(){

                $("#currencyInfoBoxBody").html(``); 

                if (exchangeRates['CAD']) {
                $("#currencyInfoBoxBody").html(`<p>1 ${countryInfo['currencyCode']} equals </p>`);
                $("#datalistCurrencies").show();
                $("#exchangeRateSet").closest('div').show();
                    $("#exchangeRateSet").html(`${parseFloat(exchangeRates['CAD']).toFixed(2)}`);
                    for (const property in exchangeRates) {
                        let opt = document.createElement("option");
                        opt.value = parseFloat(exchangeRates[property]).toFixed(2);
                        opt.text = property;
                        document.getElementById("datalistCurrencies").appendChild(opt,null);
                    }
                } else {
                    $("#currencyInfoBoxBody").html(`Sorry, we couldn't compare the currency <strong>${countryInfo['currencyCode']}</strong> to anything.`);
                    $("#datalistCurrencies").hide();
                    $("#exchangeRateSet").closest('div').hide();
                }
              

                $('#currencyInfoBox').modal('show');
                
            }).addTo(mymap);

            
            L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>', function(){
                $("#countryInfoBoxLabel").html(`Weather (${ctry})`);
                
            if (weather['weather']) {
                $("#countryInfoBoxBody").html(`
               <p class="modalList"> <img src="http://openweathermap.org/img/wn/${weather['weather'][0]['icon']}.png" /> ${weather['weather'][0]['description']}</p>
               <p class="modalList">
               <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>
               <strong>${weather['main']['temp']}&deg;c</strong> , Feels Like ${weather['main']['feels_like']}&deg;c<br>
               <small class="text-muted">High of: ${weather['main']['temp_max']}&deg;c , Low of: ${weather['main']['temp_min']}&deg;c</small>
               </p>
               <p class="modalList">
               <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>
               <strong>${weather['wind']['speed']}mph</strong> , Direction: ${weather['wind']['deg']}&deg;
               </p>
               <p class="modalList">
               <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline></svg>
                <strong>${sunset.toTimeString()}</strong>
               </p>
                `);
            } else {
                $("#countryInfoBoxBody").html(`<p>Sorry, we don't know what the weather is like in ${ctry}.</p>`);
            }
                $('#countryInfoBox').modal('show');
              }).addTo(mymap);
              

              L.easyButton( '<svg viewBox="0 0 31 30" width="24" height="24"  stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', function(){
                $("#newsInfoBoxLabel").html(`News Providers in ${ctry}`);
                $('#newsInfoBoxBody').html(``);
                if (newsProviders[0]) {
                newsProviders.forEach( (item,index) => {
                    let opt = document.createElement("li");
                    opt.className = "list-group-item";

                    opt.innerHTML = `
                    <h5>${newsProviders[index]['name']}</h5>
                    <p>${newsProviders[index]['description']}</p>
                    <p><a href="${newsProviders[index]['url']}" class="btn btn-light btn-sm" target="_blank">Visit Website</a></p>
                    `
                    document.getElementById("newsInfoBoxBody").appendChild(opt,null);
                })  } else {
                    $('#newsInfoBoxBody').html(`<p>Sorry, we couldn't find any news providers in ${ctry}.</p>`);
                }

                $('#newsInfoBox').modal('show');
              }).addTo(mymap);
             

              L.marker([coords['lat'], coords['lng']]).addTo(mymap).on('click', countryMarkerOnClick)

              const cityMarkers = L.markerClusterGroup();
              if(cities[0]['lat']) {
            cities.forEach( (item,index) => {
                cityMarkers.addLayer(L.marker([cities[index]['lat'], cities[index]['lng']], {icon: cityIcon}).on('click', () => {
                    $("#countryInfoBoxLabel").html(`${cities[index]['city']} - ${cities[index]['iso2']}  `);
                    $("#countryInfoBoxBody").html(`
                    <p class="modalList" >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    <strong>Latitude:</strong> ${cities[index]['lat']} , <strong>Longitude:</strong> ${cities[index]['lng']}
                    </p>
                    <p class="modalList" >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    <strong>Population: </strong> ${cities[index]['population']}
                    </p>
                    `)
                    $('#countryInfoBox').modal('show');
                }))
            })
        } else {
            console.log(`Couldn't find any cities in ${ctry}`)
        }


            const battleMarkers = L.markerClusterGroup();
            if(poi) {
            poi.forEach( (item,index) => { 
                battleMarkers.addLayer(L.marker([poi[index]['geometry']['coordinates'][1], poi[index]['geometry']['coordinates'][0]],{icon: battleIcon}).on('click', () => {
                    $("#countryInfoBoxLabel").html(`${poi[index]['properties']['name']}`);
                    $("#countryInfoBoxBody").html(``);
                    getDescription(poi[index]['properties']['wikidata']);
                    $('#countryInfoBox').modal('show');
                }))

            }) }
            else {
                console.log(`Couldn't find any historic battles in ${ctry}`)
            }

            const railwayMarkers = L.markerClusterGroup();

            if(railStations) {
            railStations.forEach( (item,index) => { 
                railwayMarkers.addLayer(L.marker([railStations[index]['geometry']['coordinates'][1], railStations[index]['geometry']['coordinates'][0]],{icon: railIcon}).on('click', () => {
                    $("#countryInfoBoxLabel").html(`${railStations[index]['properties']['name']} `);
                    $("#countryInfoBoxBody").html(``);
                    getDescription(railStations[index]['properties']['wikidata']);
                    $('#countryInfoBox').modal('show');
                }))

            }) }
            else {
                console.log(`Couldn't find any railway stations  in ${ctry}`)
            }

            const hotelsMarkers = L.markerClusterGroup();

            if(hotels) {
            hotels.forEach( (item,index) => { 
                hotelsMarkers.addLayer(L.marker([hotels[index]['geometry']['coordinates'][1], hotels[index]['geometry']['coordinates'][0]],{icon: hotelsIcon}).on('click', () => {
                    $("#countryInfoBoxLabel").html(`${hotels[index]['properties']['name']}`);
                    $("#countryInfoBoxBody").html(``);
                    getDescription(hotels[index]['properties']['wikidata']);
                    $('#countryInfoBox').modal('show');
                }))

            }) }
            else {
                console.log(`Couldn't find any hotels  in ${ctry}`)
            }

            const touristSpotsMarkers = L.markerClusterGroup();

            if(touristSpots) {
            touristSpots.forEach( (item,index) => { 
                touristSpotsMarkers.addLayer(L.marker([touristSpots[index]['geometry']['coordinates'][1], touristSpots[index]['geometry']['coordinates'][0]],{icon: touristsIcon}).on('click', () => {
                    $("#countryInfoBoxLabel").html(`${touristSpots[index]['properties']['name']} `);
                    $("#countryInfoBoxBody").html(``);
                    getDescription(touristSpots[index]['properties']['wikidata']);
                    $('#countryInfoBox').modal('show');
                }))

            }) }
            else {
                console.log(`Couldn't find any tourist spots  in ${ctry}`)
            }


            var overlayMaps = {
                "Cities": cityMarkers,
                "Historic Battles": battleMarkers,
                "Railway Stations": railwayMarkers,
                "hotels": hotelsMarkers,
                "Tourist Attractions": touristSpotsMarkers
            };
            L.control.layers(baseMaps,overlayMaps).addTo(mymap);
            

            countryList.forEach( (country) => {
                let opt = document.createElement("option");
                opt.value = country;
                opt.text = country;
                document.getElementById("datalistCountries").appendChild(opt,null);
            });
            
              
        }
    }).then (() => {
        $('.spinner').hide();
    })
}


function setCurrency(value) {
    $("#exchangeRateSet").html(value);
}

function getDescription(wikidata) {
    $.ajax({
        url: 'https://mattskills.co.uk/projects/gazetteer/app/wikidata.php',
        type: 'POST',
        dataType: 'json',
        data: { dataId: wikidata },
            success: result => {
                if( result['wikidata'][wikidata]['descriptions']['en']['value'] ) {
                $("#countryInfoBoxBody").html(`${result['wikidata'][wikidata]['descriptions']['en']['value']}`);
                } else {
                    $("#countryInfoBoxBody").html(`${result['wikidata'][wikidata]['descriptions']['value']}`);
                }
               
            }
        })
}

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(`Visitor let us use their location, using it to set the map...`)
        $.ajax({
            url: 'https://mattskills.co.uk/projects/gazetteer/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: { homeCoords: position.coords.latitude+' '+position.coords.longitude},
                success: result => {
                    setMap(result['homeCountryName']);
                   
                }
            })
      });
} else {
    console.log(`Visitor didn't let us use their location, going to the bahamas...`)
    setMap('Bahamas');
}

$(document).ready( () => {
       
    $('#changeCountry').on('click', () => {

        if ($('#countriesDataList').val() == '') {
            console.log(`Visitor has requested to change the map but didn't select a location`);
        } else {
        console.log('Visitor has requested '+$('#countriesDataList').val()+', changing the map...');
        mymap.remove();
        setMap($('#countriesDataList').val());
        $('.spinner').show();
        }
    })  

    $('#countriesDataList').on('click', () => {
        $('#countriesDataList').val('');
    })

})

