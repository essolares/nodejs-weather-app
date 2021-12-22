require('dotenv').config()
const { readInput, inquireMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/seacrhes");


const main = async () => {
    const searches = new Searches();
    let opt;

    do {
        opt = await inquireMenu();
        switch (opt) {
            case 1:
                const place = await readInput('City:');
                const places = await searches.city(place);
                const id = await listPlaces(places);
                if (id === '0') continue;

                const selectedPlace = places.find(p => p.id === id);

                //SAVE ON DB
                searches.addRecord(selectedPlace.name);

                const weather = await searches.weatherPlace(selectedPlace.lat, selectedPlace.lng);
                console.log(weather);

                //Show results
                console.clear();
                console.log('\nCity Info\n'.green);
                console.log('City: ', selectedPlace.name);
                console.log('Lat: ', selectedPlace.lat);
                console.log('Lng: ', selectedPlace.lng);
                console.log('Temperature: ', weather.temp);
                console.log('Min: ', weather.min);
                console.log('Max: ', weather.max);
                console.log('How is the weather: ', weather.desc);

                break;

            case 2:
                    searches.recordCapital.forEach((place,i)=>{
                        const idx = `${ i + 1 }.`.green;
                        console.log( `${ idx } ${ place } ` );
                    })

        }

        await pause();
    } while (opt !== 0)
};

main();