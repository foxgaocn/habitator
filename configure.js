var func = function(){
	console.log('process.env.NODE_ENV is ' + process.env.NODE_ENV);
	switch(process.env.NODE_ENV){
		case 'development':
			return {
				fb: {
    				appId: '144772812392904'
  					, appSecret: '90c2e3d9829758a8c6bbc6b0990146fe'
				}
    			, database: 'mongodb://127.0.0.1/habitor'
    			, cookieSecret: '342kfsdakj'
    		};

    	case 'test' :
    		return {
				fb: {
    				appId: '144772812392904'
  					, appSecret: '90c2e3d9829758a8c6bbc6b0990146fe'
				}
    			, database: 'mongodb://127.0.0.1/habitor_test'
    			, cookieSecret: '342kfsdakj'
    		};

    	default:
	    	return {
					fb: {
	    				appId: '144772812392904'
	  					, appSecret: '90c2e3d9829758a8c6bbc6b0990146fe'
					}
	    			, database: 'mongodb://127.0.0.1/habitor_test'
	    			, cookieSecret: '342kfsdakj'
	    			, port: 3000
	    		};
	}
}

module.exports = func();