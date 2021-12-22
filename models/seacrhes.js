const fs = require('fs');
const axios = require("axios");
class Searches {
    
    record = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get recordCapital() {
        return this.record.map( place => {

            let words = place.split(' ');
            words = words.map( p => p[0].toUpperCase() + p.substring(1) );

            return words.join(' ')

        })
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'en',
        }
    }

    get paramesOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'en'
        }
    }

    async city(place = '') {
        //HTTP request
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox,
            });
            const res = await instance.get();
            return res.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async weatherPlace(lat, lon) {
        //HTTP request
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramesOpenWeather, lat, lon }
            });

            const res = await instance.get();
            console.log('res',res.data)
            const { weather, main } = res.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            console.log('error');
        }
    }

    addRecord (place=""){
        //avoid duplicates
        if( this.record.includes( place.toLocaleLowerCase() ) ){
            return;
        }
        this.record = this.record.splice(0,5);

        this.record.unshift( place.toLocaleLowerCase() );

        // Grabar en DB
        this.saveDB();
    }

    saveDB() {

        const payload = {
            record: this.record
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    readDB() {

        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );

        this.record = data.record;


    }

}

module.exports = Searches;