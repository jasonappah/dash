import { Redis } from '@upstash/redis'

const callback = async (req, res) => {
    
    // console.log(headers)
    
    let body = new URLSearchParams()
    body.append("grant_type", "authorization_code")
    body.append("code",req.query.code)
    body.append("scope", "tasks:read")
    body.append("redirect_uri",process.env.TICKTICK_REDIRECT_URI)

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        // TODO: Make this good lol
        "Authorization": "Basic " + Buffer.from(`${process.env.TICKTICK_CLIENT_ID}:${process.env.TICKTICK_CLIENT_SECRET}`).toString("base64url")
    }
    console.log(headers, process.env)
    const token = await fetch("https://ticktick.com/oauth/token", {
        headers,
        body: body.toString(),
        method: "POST",
    })
    try {
        const [token_str, access] = await check(token)

        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN
        })
        
        await redis.set('dash:ticktick_access', token_str);
        res.send(access)
    } catch (e) {
        res.status(500).send(e.toString()||"")
    }

    
}

interface TicktickToken {
    access_token: string
}

async function check(i: Response): Promise<[token:string, res:any]> {
    const input = await i.json()
    if (input["access_token"] && typeof input["access_token"] === "string") {
        return [input["access_token"], input]
    } else {
        throw new Error()
    }
}

export default callback