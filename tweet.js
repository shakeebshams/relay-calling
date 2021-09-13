import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

const createApp = (relay) => {
    console.log("app is hosted and running")
    let tweet
    relay.on(`start`, async () => {
        await relay.say('what would you like to tweet?')
        let infoObj = await relay.listen()
        tweet = infoObj.text
        await relay.say(`are you sure you want to tweet ${tweet}. single tap to confirm`)
    })

    relay.on(`button`, async (button, taps) => {
        if (button.taps === `single`) {
            let text = `publishing your tweet`
            await relay.say(text)
            await axios.post('https://hooks.zapier.com/hooks/catch/10682414/bud88aw', {text: tweet})
            await relay.terminate()
        }  else if (button.taps === `double`) { 
            let text = 'good call, exiting'
            await relay.say(text)
            await relay.terminate()
        }
    })
}

export default createApp
