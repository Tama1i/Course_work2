<?php

// удаление файлов log прошедших дней
$files_log = scandir(__DIR__.'/logs',SCANDIR_SORT_NONE);

file_put_contents(__DIR__."/FILES_LOG.txt", "");
foreach ($files_log as $key => $val){
    //$dateObject = strtotime(str_replace("_",".",substr($val,0,strpos($val,"."))));
    //file_put_contents(__DIR__."/FILES_LOG.txt", date("Y-m-d",$dateObject).PHP_EOL,FILE_APPEND);
    if($val != '.' && $val!='..'){
       
        $date_in_name = date("Y-m-d",strtotime(str_replace("_",".",substr($val,0,strpos($val,".")))));
        //file_put_contents(__DIR__."/FILES_LOG.txt", $date_in_name.PHP_EOL,FILE_APPEND);
        if($date_in_name != date("Y-m-d")){
            file_put_contents(__DIR__."/FILES_LOG.txt", $date_in_name.PHP_EOL,FILE_APPEND);
            unlink(__DIR__."/logs/".$val);
        }
    }
}


$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://spacestudents.ru/widget_amo/handler.php?timer=Y');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$jsonData = json_decode(curl_exec($curl), true);
file_put_contents(__DIR__."/timer_rez.txt",print_r($jsonData,1));
curl_close($curl);





