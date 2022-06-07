const redir = (req, res) => {
    const query = new URLSearchParams()
    query.set("client_id", process.env.TICKTICK_CLIENT_ID)
    query.set("scope","tasks:read")
    query.set("redirect_uri", process.env.TICKTICK_REDIRECT_URI)
    query.set("response_type", "code")
    res.redirect("https://ticktick.com/oauth/authorize?"+query.toString())
}

export default redir