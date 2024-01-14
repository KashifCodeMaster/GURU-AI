import axios from 'axios';

let handler = async (m, { args }) => {
    try {
        if (!args[0]) {
            m.react('🤦🏻‍♀️');
            throw '*Oh dear, where do you want to know the weather? Please provide a place.*';
        }

        m.react('⌛');

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: args.join(' '),
                units: 'metric',
                appid: '060a6bcfa19809c2cd4d97a212b19273'
            }
        });

        const data = response.data;
        const place = data.name;
        const country = data.sys.country;
        const weatherDescription = data.weather[0].description;
        const temperature = `${data.main.temp}°C`;
        const minTemperature = `${data.main.temp_min}°C`;
        const maxTemperature = `${data.main.temp_max}°C`;
        const humidity = `${data.main.humidity}%`;
        const windSpeed = `${data.wind.speed}km/h`;

        const weatherInfo = `🌍 *Place:* ${place}, ${country}\n🌦️ *Weather:* ${weatherDescription}\n🌡️ *Temperature:* ${temperature}\n💡 *Min Temperature:* ${minTemperature}\n🔥 *Max Temperature:* ${maxTemperature}\n💧 *Humidity:* ${humidity}\n💨 *Wind Speed:* ${windSpeed}`;

        m.reply(weatherInfo);
        m.react('🌤️');
    } catch (error) {
        console.error('Error in weather command:', error);
        m.reply('*❌ Oops! There seems to be a glitch in the weather forecast. Please try again later.*');
        m.react('🥺');
    }
};

handler.help = ['weather *<place>*'];
handler.tags = ['tools'];
handler.command = /^(climate|weather)$/i;
export default handler;
