<?php

const
    SUBDOMAIN = 'spaceschool',
    AUTHLINK = 'https://spaceschool.amocrm.ru/oauth2/access_token', //Формируем URL для запроса; oauth2
    REDIRECT_URI = 'https://spacestudents.ru/widget_amo/handler.php',
    CLIENT_ID = '803606e0-7df9-4611-8d37-8dc582f17396',
    CLIENT_SECRET = '1ejyELuElz9PQYCYGRztAoeFT5b7HmoI1oKnvbuauRHDin4ysBgw3GuJLI5mM47H',
    FIRST_CODE = 'def50200656d7d8f298f514bd393bc030612b79ad187411bbc8ae1e09c9897703e8962a2819b9cef43105396c3d0961ef44744bb65c64608ead12f376991db59f4bc95796ed139625e485a4adadda53b1abebfe937770850ca14bd3bc3da38f0086e03a8d219969f93d6aa0fbbb794d5be277c3c8f482ffef48a326ea8706ffe2323d152972f232bbdadbc570637b06fff78e816bcbad09a5c0d4ef2d470260e4b55a72c51c2cf4e8bcf15e111994c0ad7ebe6573944a6113009634c1057ccd4312491ccbce8604442dcfe77bbeacf33ee54d9fb9c2425a3a66760bc49a686a4710c9367444bd42f901d99152b63dc2249ffb1a2c5dd7695b64742085648a90f46c4e35a0024ea240d5acc7c7d3bdcaca47a0d76d3c1fa2b3888c6cdacdc94968f0cb68458978d492336233431c89c887bdad5201e077e68aa458d51bf2c2ee9260c4e69acf74b8d4d5ed4278cc3b485202b182830907360af8a68b669e28f2cce4dc07cc7ba51992830a221d45629217d6aec3cc8cd8d2264ddb88033ba8015e35cc07a2cdc82ece40a0ecb9d1b8d89e6dc512a68c610716e79593b9ba50f098b06a3803c355b6847a439c0d1708259886c7a061061a601b2c802639912e6a32a9326609ae41026bbfb69c3c3831425e36ce35a89b163b29e943bacc5e044e6f824995162907a54460ddfae34d40b219b5e9e97cf17c266be37bebbf391a1cac647';

$users = array();

$errors = [
	400 => 'Bad request',
	401 => 'Unauthorized',
	403 => 'Forbidden',
	404 => 'Not found',
	500 => 'Internal server error',
	502 => 'Bad gateway',
	503 => 'Service unavailable',
];

$authdata = [];

function get_auth_data() {
    global $authdata;
    
    if(file_exists(__DIR__.'/auth.code')) {
        $authdata = json_decode(file_get_contents(__DIR__.'/auth.code'),1);
    }

}

function get_first_access() {
    
    /** Получаем токен впервые по авторизационному коду */
    $data = [
    	'client_id' => CLIENT_ID,
    	'client_secret' => CLIENT_SECRET,
    	'grant_type' => 'authorization_code',
    	'code' => FIRST_CODE,
    	'redirect_uri' => REDIRECT_URI,
    ];
    
    file_put_contents(__DIR__.'/data.txt', print_r(json_encode($data),1));
    file_put_contents(__DIR__.'/data2.txt', AUTHLINK);

    $curl = curl_init(); //Сохраняем дескриптор сеанса cURL
    /** Устанавливаем необходимые опции для сеанса cURL  */
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, AUTHLINK);
    curl_setopt($curl,CURLOPT_HTTPHEADER,['Content-Type:application/json']);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl,CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    /** Теперь мы можем обработать ответ, полученный от сервера. Это пример. Вы можете обработать данные своим способом. */
    $code = (int)$code;

    file_put_contents(__DIR__.'/data1.txt', print_r($out,1));

    
	if ($code < 200 || $code > 204) {
        writeDebug([
        	'Ошибка' => 'Не удалось получить первичный токен',
        	'Описание' => 'Код ошибки: ' . $code. PHP_EOL .print_r($out,1),
        ]);
	    return false;
	}

    /**
     * Данные получаем в формате JSON, поэтому, для получения читаемых данных,
     * нам придётся перевести ответ в формат, понятный PHP
     */
    $authdata = json_decode($out, true);
    $authdata["expires"] = time() + $authdata["expires_in"];
    
    file_put_contents(__DIR__.'/auth.code', print_r(json_encode($authdata),1));

    writeDebug([
    	'Шаг' => "Успешно авторизоваись по первичному ключу",
    ]);

    return true;

}

if ($authdata['access_token'] != null && $authdata['expires'] < time()) {
    writeDebug([
    	'Шаг' => "Просрочен access token. Получаем новый.",
    ]);
    $authdata = refreshAmoToken($authdata);
}

function refreshAmoToken($authdata) {
    $data = [
    	'client_id' => CLIENT_ID,
    	'client_secret' => CLIENT_SECRET,
    	'grant_type' => 'refresh_token',
    	'refresh_token' => $authdata['refresh_token'],
    	'redirect_uri' => REDIRECT_URI,
    ]; 
    $curl = curl_init(); //Сохраняем дескриптор сеанса cURL
    /** Устанавливаем необходимые опции для сеанса cURL  */
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, AUTHLINK);
    curl_setopt($curl,CURLOPT_HTTPHEADER,['Content-Type:application/json']);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($curl,CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    /** Теперь мы можем обработать ответ, полученный от сервера. Это пример. Вы можете обработать данные своим способом. */
    $code = (int)$code;
    try
    {
    	/** Если код ответа не успешный - возвращаем сообщение об ошибке  */
    	if ($code < 200 || $code > 204) {
    		throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undefined error', $code);
    	}
    }
    catch(\Exception $e)
    {
        writeDebug([
        	'Ошибка' => 'Не удалось обменять рефреш-токен на новый аксесс-токен',
        	'Описание' => $e->getMessage() . PHP_EOL . 'Код ошибки: ' . $e->getCode(),
        ]);
	    die();
    }

    writeDebug([
    	'Шаг' => 'Успешно обменяли рефреш-токен на новый аксесс-токен',
    ]);
    
   /**
     * Данные получаем в формате JSON, поэтому, для получения читаемых данных,
     * нам придётся перевести ответ в формат, понятный PHP
     */
    $authdata = json_decode($out, true);
    $authdata["expires"] = time() + $authdata["expires_in"];

    file_put_contents(__DIR__.'/auth.code', print_r(json_encode($authdata),1));
    
    return $authdata;
}    

function call($metod, $parameters = '') {
    
    global $subdomain, $authdata;
  
    // если токен устарел, обновляем его
    if ($authdata['access_token'] != null && $authdata['expires'] < time()) {
        $authdata = refreshAmoToken($authdata);
    }
   
    if($parameters != '') {
       $parameters = '?'.$parameters; 
    }
    
    $link = 'https://' . SUBDOMAIN . '.amocrm.ru/api/v4/'.$metod.$parameters;
    $headers = [
    	'Authorization: Bearer ' . $authdata['access_token']
    ];


    $curl = curl_init();
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, $link);
    curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $code = (int)$code;

    $thisRESULT = [];
    if ($code < 200 || $code > 201) {
    	$thisRESULT['result'] = false;
    	$thisRESULT['error'] = 'Ошибка: ' . $code .  PHP_EOL . print_r($out, 1);
    	
    	return $thisRESULT;
    }

	$thisRESULT['result'] = true;
	$thisRESULT['code'] = $code;
	$thisRESULT['data'] = json_decode($out, 1);

    return $thisRESULT;
}

function amo_get_next($link) {
    
    global $authdata;
    
    // если токен устарел, обновляем его
    if ($authdata['access_token'] != null && $authdata['expires'] < time()) {
        $authdata = refreshAmoToken($authdata);
    }

    $headers = [
    	'Authorization: Bearer ' . $authdata['access_token']
    ];


    $curl = curl_init();
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, $link);
    curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $code = (int)$code;

    $thisRESULT = [];

    try
    {
    	/* Если код ответа не успешный - возвращаем сообщение об ошибке  */
    	if ($code < 200 || $code > 204) {
    		throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undefined error', $code);
    	}
    }
    catch(\Exception $e)
    {
    	$thisRESULT['result'] = false;
    	$thisRESULT['error'] = 'Ошибка: ' . $e->getMessage() . PHP_EOL . 'Код ошибки: ' . $e->getCode() .  PHP_EOL . print_r($out, 1);
    	return $thisRESULT;
    }

	$thisRESULT['result'] = true;
	$thisRESULT['data'] = json_decode($out, 1);

    return $thisRESULT;
}


function call2add($metod, $parameters) {
    
    global $subdomain, $authdata;
    
    $link = 'https://' . SUBDOMAIN . '.amocrm.ru/api/v4/'.$metod;
    $headers = array(
    	'Authorization: Bearer ' . $authdata['access_token'],
    	'Content-Type:application/json',
    );
    
    $curl = curl_init();
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, $link);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
    curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($parameters));
    curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $code = (int)$code;

    $thisRESULT = [];

	/* Если код ответа не успешный - возвращаем сообщение об ошибке  */
	if ($code < 200 || $code > 204) {
    	$thisRESULT['result'] = false;
    	$thisRESULT['error'] = 'Ошибка: ' . $out;
    	
    	writeDebug(['Ошибка' => $thisRESULT]);
    	
    	return $thisRESULT;
	}

	$thisRESULT['result'] = true;
	$thisRESULT['data'] = json_decode($out, 1);

    return $thisRESULT;
}

function call2update($metod, $parameters) {
    
    global $subdomain, $authdata;
    
    $link = 'https://' . SUBDOMAIN . '.amocrm.ru/api/v4/'.$metod;
    $headers = array(
    	'Authorization: Bearer ' . $authdata['access_token'],
    	'Content-Type:application/json',
    );
    
    $curl = curl_init();
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-oAuth-client/1.0');
    curl_setopt($curl,CURLOPT_URL, $link);
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'PATCH');
    curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($parameters));
    curl_setopt($curl,CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl,CURLOPT_HEADER, false);
    curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, 1);
    curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, 2);
    $out = curl_exec($curl); //Инициируем запрос к API и сохраняем ответ в переменную
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $code = (int)$code;

    $thisRESULT = [];

	/* Если код ответа не успешный - возвращаем сообщение об ошибке  */
	if ($code < 200 || $code > 204) {
    	$thisRESULT['result'] = false;
    	$thisRESULT['error'] = 'Ошибка: ' . $out;
    	
    	writeDebug(['Ошибка' => $thisRESULT]);
    	
    	return $thisRESULT;
	}

	$thisRESULT['result'] = true;
	$thisRESULT['data'] = json_decode($out, 1);

    return $thisRESULT;
}



//////////////////////////////////////////////---CURL----/////////////////////////////////////
/*
function curll($dat, $ur)
{
    $curl = curl_init(); 
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($curl,CURLOPT_URL, $ur); 
    curl_setopt($curl,CURLOPT_HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']); 
    curl_setopt($curl,CURLOPT_HEADER, false); 
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'POST'); 
    curl_setopt($curl,CURLOPT_POSTFIELDS, http_build_query($dat)); 
    $outt = curl_exec($curl); 
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE); 
    curl_close($curl); 
    
    return $outt;
}

function curll_get($dat, $ur)
{
    $curl = curl_init(); 
    curl_setopt($curl,CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($curl,CURLOPT_URL, $ur); 
    curl_setopt($curl,CURLOPT_HTTPHEADER,['Content-Type: application/x-www-form-urlencoded']); 
    curl_setopt($curl,CURLOPT_HEADER, false); 
    curl_setopt($curl,CURLOPT_CUSTOMREQUEST, 'POST'); 
    curl_setopt($curl,CURLOPT_POSTFIELDS, http_build_query($dat)); 
    $outt = curl_exec($curl); 
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE); 
    curl_close($curl); 
    
    return $outt;
}

function get($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $html = curl_exec($ch);
    curl_close($ch);
    $out = json_decode($html);
    return $out;
}
*/
////////////////////////////////////////////////////-------------------//////////////////////////////////////////////

function writeDebug( $params, $drawSeparator = false, $filename = "")
{
	if($filename == "") {
	    $filename = __DIR__.'/log.txt';
	}
	
	ob_start();
	if ( $drawSeparator )
	{
		echo "====================================";
		echo date('Y-m-d H:i:s');
		echo "====================================";
	}
	echo PHP_EOL;
	var_dump($params);
	file_put_contents($filename, ob_get_clean(), FILE_APPEND);
}
