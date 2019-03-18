module.exports =
{
	protoo :
		{
			host: process.env.PROTOO_HOST || '192.168.1.100',
            listenPort : process.env.PROTOO_PORT,
			options:
				{
					retries    : 10,
					factor     : 2,
					minTimeout : 1 * 1000,
					maxTimeout : 8 * 1000
				}
		},
    webapp: {
        host: process.env.WEBAPP_HOST || '192.168.1.100',
        port:  process.env.WEBAPP_PORT
    },
	db :
		{
			name : process.env.DB_NAME || 'PDAPP'
		},
	googleapis:
		{
            client_id : process.env.GOOGLE_CLIENT_ID,
            client_secret : process.env.GOOGLE_CLIENT_SECRET,
            redirect_to: process.env.GOOGLE_CLIENT_REDIRECT_TO
		},
	microsoftapis:
		{
			client_id : process.env.MICROSOFT_CLIENT_ID,
			client_secret : process.env.MICROSOFT_CLIENT_SECRET,
			redirect_to: process.env.MICROSOFT_CLIENT_REDIRECT_TO || 'https://localhost:1234/ms-connect',
            scope: process.env.MICROSOFT_SCOPE || 'https://graph.microsoft.com/.default'
		},
	pexip:
		{
			node: 'pexip-conf.yourdomainhere.com',
			bandwidth: '1280'
		}
};
