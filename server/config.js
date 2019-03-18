module.exports =
{
	// DEBUG env variable For the NPM debug module.
	// Listening hostname for `gulp live|open`.
	domain : process.env.WEBRTC_DOMAIN || 'localhost',
	tls    :
	{
		cert : process.env.WEBRTC_CERTIFICATE || `${__dirname}/certs/danube-localhost.crt`,
		key  : process.env.WEBRTC_KEY || `${__dirname}/certs/danube-localhost.key`
	},
	protoo :
	{
		listenIp   : '0.0.0.0',
		listenPort : process.env.PROTOO_PORT || 3443
	},
	webapp: {
		port:  process.env.WEBAPP_PORT || 11443
	},
    googleapis:
        {

            client_id : process.env.GOOGLE_CLIENT_ID,
            client_secret : process.env.GOOGLE_CLIENT_SECRET,
            redirect_to: process.env.GOOGLE_CLIENT_REDIRECT_TO || 'https://localhost:1234/gsuite-connect'
        }
};
