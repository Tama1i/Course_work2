<?php

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
require_once(__DIR__ . '/functions.php');

define('SOURCE_FIELD_ID', 270311);  //270311  901797
define('USER_GROUPS', [289515,302031,556225]); // 289515,302031  497126
define('MAIN_LOG_FILE', __DIR__.'/logs/'.date('d_m_Y_H_i_s').'.log');

// НЕ ЗАБЫТЬ УДАЛИТЬ
/*if (array_key_exists('leads', $_REQUEST)) {
    die;
}*/

/*writeDebug([
    'Шаг' => "Получен запрос",
    //'REQUEST' => $_REQUEST,
], true, MAIN_LOG_FILE);*/

if(!array_key_exists('method', $_REQUEST)
    && !array_key_exists('code', $_REQUEST)
    && !array_key_exists('timer', $_REQUEST)
) {

    writeDebug([
        'Шаг' => "В запросе отсутствуют обязательные ключи, выходим",
    ], false, MAIN_LOG_FILE);
    die;
}


//file_put_contents(__DIR__."/log.txt","");
// СОХРЕНЕНИЕ ДАННЫХ АВТОРИЗАЦИИ
if(array_key_exists('code', $_REQUEST)) {
    // Получаем access token
    $result = get_first_access();
    writeDebug([
        'Шаг' => "Получили первый токен",
    ], false, MAIN_LOG_FILE);
    die;

}

// В начале дня обнуляем информацию о лидах, распределенных за сегодня
date_default_timezone_set('Europe/Moscow');
$new_day=0;
if(file_exists(__DIR__.'/tomorrow.txt')) {
    if(file_get_contents(__DIR__."/tomorrow.txt") != null){
        $ch_tomorow=date_format(date_create(file_get_contents(__DIR__."/tomorrow.txt")), 'Y-m-d');
    }
}
else{
    $ch_tomorow=date('Y-m-d', strtotime("+1 day"));
}
$today = date("Y-m-d");
file_put_contents(__DIR__."/date.txt",$ch_tomorow);
if ($today == $ch_tomorow)
{
    $new_day = 1;
    file_put_contents(__DIR__."/today_leads1.json","");
    file_put_contents(__DIR__."/LogAdd.txt","");
    writeDebug([
        'Шаг' => "Это новый день. Очистили историю распределения за сегодня",
    ], false, MAIN_LOG_FILE);

}
else{
    $new_day = 0;

}

$tomorrow = date('Y-m-d', strtotime("+1 day"));
file_put_contents(__DIR__."/tomorrow.txt",$tomorrow);

////////////////////////////////////////////

if($_REQUEST['method'] == 'GET_SETTINGS') {
    writeDebug([
        'Тип запроса' => "Это запрос на получение настроек",
    ], false, MAIN_LOG_FILE);
} elseif ($_REQUEST['method'] == 'SAVE_SETTINGS') {
    writeDebug([
        'Тип запроса' => "Это запрос на сохранение настроек",
    ], false, MAIN_LOG_FILE);
} elseif ($_REQUEST['method'] == 'GET_LEADS_AND_TASKS') {
    writeDebug([
        'Тип запроса' => "Это запрос получение статистики",
    ], false, MAIN_LOG_FILE);
} elseif (array_key_exists('leads', $_REQUEST)) {
    writeDebug([
        'Тип запроса' => "Лид " . $_REQUEST['leads']['update'][0]['name'],
    ], false, MAIN_LOG_FILE);
} elseif (array_key_exists('timer', $_REQUEST)) {
    writeDebug([
        'Тип запроса' => "Вызов по расписанию",
    ], false, MAIN_LOG_FILE);
}

file_put_contents(__DIR__."/log.txt","");

// СОХРЕНЕНИЕ ИЗМЕНЕНИЙ НАСТРОЕК
if($_REQUEST['method'] == 'SAVE_SETTINGS') {
    //file_put_contents(__DIR__."/log1.txt",'save_settings');
    if(file_exists(__DIR__."/check_save.txt")){
        $check_save = file_get_contents(__DIR__."/check_save.txt");
    }
    else{
        $check_save = 0;
    }
    //if($check_save==0){
    file_put_contents(__DIR__."/check_save.txt",1);
    //file_put_contents(__DIR__."/check_save1.txt","1 ",FILE_APPEND);
    $settings = $_REQUEST['data'];

    foreach ($settings[0]['users'] as $user_key=>$data_user){
        if ($data_user['tr_active']!='false'){
            $settings[0]['users'][$user_key]['tr_active_data'] = date("Y-m-d",strtotime(date("Y-m-d")." +1 Day"));
        }
        else{
            $settings[0]['users'][$user_key]['tr_active_data']="";
        }

    }
    $save_time = date('H:i:s');
    if(!file_exists(__DIR__."/overtime_save.txt")){
        $overtime_save = date('H:i:s',strtotime("+120 seconds"));
        file_put_contents(__DIR__."/overtime_save.txt",$overtime_save);
    }
    //if($save_time < date_format(date_create(file_get_contents(__DIR__."/overtime_save.txt")), 'H:i:s')){
        file_put_contents(__DIR__.'/save_settings.txt', print_r($settings,1));
        file_put_contents(__DIR__.'/settings.json', json_encode($settings));
        writeDebug([
            'сохраняем настройки' => "1",
        ], false, MAIN_LOG_FILE);
    /*}else{
        writeDebug([
            'overtime' => "1",
        ], false, MAIN_LOG_FILE);
    }*/
    $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
    //echo(json_encode($_RESULT));
    
    $overtime_save = date('H:i:s',strtotime("+120 seconds"));
    file_put_contents(__DIR__."/overtime_save.txt",$overtime_save);
    
        
    /*writeDebug([
        'Шаг' => "Записали новые настроки",
        'Настройки' => $settings,
    ], false, MAIN_LOG_FILE);*/

    $_RESULT = [
        'result' => true,
        'data' => "Сохранили настройки"
    ];
    echo(json_encode($_RESULT));
    file_put_contents(__DIR__."/check_save.txt",0);

}


// ОТПРАВКА SETTINGS
if(($_REQUEST['method'] == 'GET_SETTINGS')||($new_day==1)||($_REQUEST['method'] == 'SAVE_SETTINGS')) {
    //file_put_contents(__DIR__."/log1.txt",'get_settings'.PHP_EOL);
    get_auth_data();
    writeDebug([
        'Шаг' => "GET_SETTINGS",

    ], false, MAIN_LOG_FILE);
    //file_put_contents(__DIR__."/log1.txt",'get_auth_data'.PHP_EOL,FILE_APPEND);
    
    $settings_data = [];
    
    $settings_data['active_groups'] = USER_GROUPS;
    
    $overtime_save = date('H:i:s',strtotime("+120 seconds"));
    file_put_contents(__DIR__."/overtime_save.txt",$overtime_save);
   
    
    if(file_exists(__DIR__.'/settings.json')) {
        $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
    }
    file_put_contents(__DIR__."/sett_ch.txt",print_r($settings_data,1));
    $today_leads = [];
    if(file_exists(__DIR__.'/today_leads1.json')) {
        $today_leads_file = file_get_contents(__DIR__.'/today_leads1.json');
        if($today_leads_file != "") {
            $today_leads = json_decode($today_leads_file,1);
        }
    }
   
    //file_put_contents(__DIR__."/check_acc2.txt","");
    $now_id = $_REQUEST['user'];
    $settings_data[0]['acc2']=0;
    

    get_users();    // ПОЛУЧАЕМ ПОЛЬЗОВАТЕЛЕЙ
    //

    
    file_put_contents(__DIR__."/log1.txt",print_r($now_id,1).PHP_EOL,FILE_APPEND);
    
    $settings_data[0]['acc']=0;
    if ($settings_data[0]['acc2']==1){
        $settings_data[0]['acc']=1;
    }

    get_pipes();    // ПОЛУЧАЕМ ВОРОНКИ И ЭТАПЫ
    //file_put_contents(__DIR__."/log1.txt",'get_pipes'.PHP_EOL,FILE_APPEND);
    
    get_source();   // ПОЛУЧАЕМ ИСТОЧНИКИ
    //file_put_contents(__DIR__."/log1.txt",'get_source'.PHP_EOL,FILE_APPEND);
    
    set_active();

    $settings_data['active_groups'] = USER_GROUPS;
    $_RESULT = ['data' => $settings_data];
    
    writeDebug([
        'Шаг' => "Сформировали данные для распределения",
        'Данные' => $_RESULT,
    ], false, MAIN_LOG_FILE);

    

    
    if($_REQUEST['method'] != 'SAVE_SETTINGS'){
        //file_put_contents(__DIR__."/log1.txt","!=SAVE_SETTINGS".PHP_EOL);
        //echo(json_encode($_RESULT));
        //die;
        writeDebug([
            'Шаг' => "Отправляем данные на фронт и завершаем работу",
        ], false, MAIN_LOG_FILE);

        echo(json_encode($_RESULT));
        die;
    }
   

}

////////////////////////////////////////////


// СОБИРАЕМ ДАНЫЕ О СДЕЛКАХ В РАБОТЕ И О ПРОСРОЧЕННЫХ ЗАДАЧАХ
if($_REQUEST['method'] == 'GET_LEADS_AND_TASKS') {

    $data = [];
    $set = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
    foreach($set[0]['users'] as $key=>$val) {
        if($val['active'] == "true"){
            $data[$val['user_id']] = [
                'leads' => 0,
                'overdue' => 0,
                'today_leads'=>0,
                'leads_with_tasks'=>0,

            ];
        }
    }
    writeDebug([
        'Шаг' => "Формируем данные статистики",
        'Данные' => $data,
    ], false, MAIN_LOG_FILE);
    
    get_auth_data();
    table_leads($data); // ПОЛУЧАЕМ СДЕЛКИ ДЛЯ ТАБЛИЦЫ С ФИЛЬТРОМ ПО ЭТАПАМ
    table_tasks($data); //  ПОЛУЧАЕМ ЗАДАЧИ

    writeDebug([
        'Шаг' => "Сформировали данные статистики. Завершаем.",
        //'Данные' => $data,
    ], false, MAIN_LOG_FILE);

    $_RESULT = [
        'result' => true,
        'data' => $data
    ];

    echo(json_encode($_RESULT));
    die;

}

// РАСПРЕДЕЛЯЕМ
if(
    array_key_exists('timer', $_REQUEST)
    //|| (array_key_exists('method', $_REQUEST) && $_REQUEST['method'] == 'SAVE_SETTINGS')
    //|| $new_day==1 
    ) {
    try{
        if(file_exists(__DIR__."/rezerv_time.txt")){
            $rezerv_timer = file_get_contents(__DIR__."/rezerv_time.txt");
            //file_put_contents(__DIR__."/LOG_time.txt",date_format(date_create($rezerv_timer), 'Y-m-d H:i')." -- ".date('Y-m-d H:i'));
            if(date_format(date_create($rezerv_timer), 'Y-m-d H:i')<date('Y-m-d H:i') && file_get_contents(__DIR__."/check_start1.txt")==1){
                file_put_contents(__DIR__."/check_start1.txt",0);
                writeDebug([
                    'Шаг' => "Принудительно обнуляем check_start1",
                ], false, MAIN_LOG_FILE);
            }
        }
        
        writeDebug([
            'Шаг' => "Запускаем распределение",
        ], false, MAIN_LOG_FILE);
    
        //  Проверяем наличие работающей сессии
        $check_start1 = 0;
        if(file_exists(__DIR__.'/check_start1.txt')) {
            $check_start1 = file_get_contents(__DIR__."/check_start1.txt");
        }
        if( $check_start1 == 0 ){
            file_put_contents(__DIR__."/check_start1.txt",1);
        }else{
            writeDebug([
                'Шаг' => "Уже есть активная сессия распределения. Завершаем.",
            ], false, MAIN_LOG_FILE);
            die;
        }
    
        file_put_contents(__DIR__."/log_raspredelenie.txt","");//просто отчистка файла
    
        // Начинаем
        get_auth_data();

    

        writeDebug([
            'Шаг' => "get_auth_data",
        ], false, MAIN_LOG_FILE);
        
        $today_leads = [];
        $data = [];
        $startStatuses = [];
        $targetStatuses = [];
    
        // Убедимся, что есть активные пользователи, выбраны статусы с которых распределяем
        // и на которых считаем лимиты
        if(!file_exists(__DIR__.'/settings.json')) {
            writeDebug([
                'Шаг' => "Файл settings.json не найден. Завершаем.",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            die;
        }
        else{
            $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
        }
        
        if(!array_key_exists('chosenStartStatuses', $settings_data[0]) || empty($settings_data[0]['chosenStartStatuses'][0])) {
            writeDebug([
                'Шаг' => "Не установлены статусы, с которых распределять. Завершаем.",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            die;
        }
    
        if(!array_key_exists('chosenAfterStatuses', $settings_data[0]) || empty($settings_data[0]['chosenAfterStatuses'][0])) {
            writeDebug([
                'Шаг' => "Не установлены статусы, на которые распределять. Завершаем.",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            die;
        }
    
        writeDebug([
            'Шаг' => "перед settings_data",
        ], false, MAIN_LOG_FILE);
    
        $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
        
        writeDebug([
            'Шаг' => "settings_data",
        ], false, MAIN_LOG_FILE);
        
        
        /*if(file_exists(__DIR__.'/check_start1.txt')) {
            $check_start1 = file_get_contents(__DIR__."/check_start1.txt");
        }
        if( $check_start1 == 0 ){
            file_put_contents(__DIR__."/check_start1.txt",1);
        }else{
            writeDebug([
                'Шаг' => "Уже есть активная сессия распределения. Завершаем.",
            ], false, MAIN_LOG_FILE);
            die;
        }*/
        
        $today_leads = [];
        if(file_exists(__DIR__.'/today_leads1.json')) {
            $today_leads_file = file_get_contents(__DIR__.'/today_leads1.json');
            if($today_leads_file != "") {
                $today_leads = json_decode($today_leads_file,1);
            }
        }
        if(array_key_exists('users', $settings_data[0])
            && count($settings_data[0]['users']) != 0
        ) {
            writeDebug([
                'Шаг' => "array_key_exists users",
            ], false, MAIN_LOG_FILE);
            foreach($settings_data[0]['users'] as $key=>$user) {
                if($user['active'] == 'true') {
                    $data[$user['user_id']] = [
                        'leads' => $user['leads'],
                        'limit'=>$user['limit'],
                        'today_leads' => $today_leads[$user['user_id']],
                        'rights' => $user['rights']
                    ];
    
                }
            }
        }
        $chosenUserDeal = [];
        $startStatuses = $settings_data[0]['chosenStartStatuses'];
        $targetStatuses = $settings_data[0]['chosenAfterStatuses'];
        foreach($settings_data[0]['chosenUserDeal'] as $key => $user){
            array_push($chosenUserDeal,$user['chosenUserDeal_id']);
        }
        //$chosenUserDeal = $settings_data[0]['chosenUserDeal'];
        $chosenStageDeal = $settings_data[0]['chosenStageDeal'];
        file_put_contents(__DIR__."/chosenUserDeal.txt", print_r($chosenUserDeal,1));
        
        
        
        writeDebug([
                'Шаг' => "Получаем массив сделок на первом статусе",
            ], false, MAIN_LOG_FILE);
        
        // Получаем массив сделок на первом статусе
        $leads_on_start_statuses = leads_on_start_statuses();
        /*writeDebug([
                'leads_on_start_statuses' => $leads_on_start_statuses,
            ], false, MAIN_LOG_FILE);*/
            
        // Если нет сделок к распределению выходим
        if(count($leads_on_start_statuses) == 0) {
            writeDebug([
                'Шаг' => "Нет сделок к распределению. Завершаем.",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            die;
        }else{
            writeDebug([
                'Шаг' => "Получили массив сделок на первом статусе.",
            ], false, MAIN_LOG_FILE);
        }
    
        table_leads($data);
    
        $all_ocher = prioritet($leads_on_start_statuses); //  СОСТАВЛЯПМ ПРИОРИТЕТЫ
    
        if( empty($all_ocher) ) {
            writeDebug([
                'Шаг' => "Нет сделок к распределению с выбранными в приоритетах источниками. Завершаем.",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            die;
        }else{
            writeDebug([
                'Шаг' => "Есть массив сделок к распределению.",
            ], false, MAIN_LOG_FILE);
        }
    
        writeDebug([
            'Сделки по пользователям' => $data,
            //'Лиды к распределению' => $all_ocher,
        ], false, MAIN_LOG_FILE);
        //file_put_contents(__DIR__."/log2.txt","");
        //file_put_contents(__DIR__."/log2.txt",print_r($all_ocher,1).PHP_EOL,FILE_APPEND);
        $arr_ch = [];
        $res = 0;
        file_put_contents(__DIR__."/CHECK_REPEATED.txt","");
        $cc = 0;
        $hh = 0;
        foreach ($all_ocher as $key_all => $ocheredd ){
            if($ocheredd != null){
                
                foreach(array_reverse($ocheredd) as $key => $one_lead ){
                    if($one_lead!=null){
                        $res = ochered($data,$startStatuses,$targetStatuses,$one_lead,$chosenUserDeal,$chosenStageDeal); // ФУНКЦИЯ ДЛЯ ОБРАБОТКИ ПЕРВОЙ-ТРЕТЬЕЙ ОЧЕРЕДИ
                        $hh++;
                        file_put_contents(__DIR__."/CheckHH.txt",$hh);
                    }else{
                        writeDebug([
                            'Ошибка' => "В список лидов к распределению попал пустой лид",
                        ], false, MAIN_LOG_FILE);
                        file_put_contents(__DIR__."/check_error.txt","onelead!=null".PHP_EOL);
                        file_put_contents(__DIR__."/check_start1.txt",0);
                    }
                    file_put_contents(__DIR__."/check_error.txt",$res.PHP_EOL);
                    $res =0;
                }
            }else{
                file_put_contents(__DIR__."/check_start1.txt",0);
                writeDebug([
                    'Ошибка' => "В списке лидов к распределению пустой массив с приоритетами",
                ], false, MAIN_LOG_FILE);
                $cc++;
                if($cc == 2){
                    die;
                }
            }
    
        }
        //file_put_contents(__DIR__."/check_error.txt","OK ".PHP_EOL,FILE_APPEND);
        file_put_contents(__DIR__."/check_start1.txt",0);
        
        writeDebug([
            'Шаг' => "Распределение завершено",
        ], false, MAIN_LOG_FILE);
    }
    catch(Exception $e)
    {
         file_put_contents(__DIR__."/check_start1.txt",0);  
         writeDebug([
          'error' => $e->getMessage()
         ]);
         die();
    }

}




// ПОЛУЧАЕМ ПОЛЬЗОВАТЕЛЕЙ
function get_users(){
    
    global $new_day;
    global $settings_data;
    global $now_id;
    global $today_leads;
    
    
    get_auth_data();
    //file_put_contents(__DIR__."/log1.txt",'get_auth_data_users'.PHP_EOL,FILE_APPEND);
    //$acc = call('account');
    $users = call("users");
    //file_put_contents(__DIR__."/CHECK_USERS.txt",print_r($users,1));
    /*writeDebug([
        'users' => $users,
    ]);*/


    $new_settings_users = [];
    //file_put_contents(__DIR__."/ACC.txt",print_r($acc,1));

    file_put_contents(__DIR__."/check_step.txt",PHP_EOL."users ".print_r($users,1).PHP_EOL);


    file_put_contents(__DIR__."/USERS.txt",print_r($users,1));
    $settings_data[0]['acc2']=0;
    //file_put_contents(__DIR__."/CHWORK.txt","");
    foreach ($users['data']['_embedded']['users'] as $key => $val) {

        if($val['id']==$now_id['id']){
            
            file_put_contents(__DIR__."/now_id.txt",$now_id['id']." ");
            if($val['rights']['is_admin']==1){
                $settings_data[0]['acc2']=1;
                file_put_contents(__DIR__."/acc2.txt",$settings_data[0]['acc2']." ");
                
            }

        }
        //file_put_contents(__DIR__."/Check_work.txt","now_id ".$now_id['id']." val ".$val['id'].PHP_EOL,FILE_APPEND);
        if(in_array($val['rights']['group_id'], USER_GROUPS)&&($val['rights']['is_active']==1)){//добавил $val['rights']['group_id']==null

            //file_put_contents(__DIR__."/CHWORK.txt","1".PHP_EOL,FILE_APPEND);
            $updated_settings_data = [
                'user_id' => $val['id'],
                'active' => false,
                'tr_active' => false,
                'limit' => 0,
                'leads' => '-',
                'today_leads'=>'-',
                'overdue' => '-',
                'leads_with_tasks'=>'-',
            ];

            foreach ($settings_data[0]['users'] as $key_in_settings => $val_in_settings) {

                if($val['id'] == $val_in_settings['user_id']) {

                    //file_put_contents(__DIR__."/check_step.txt",PHP_EOL."Польователь найден ".print_r($val_in_settings,1).PHP_EOL,FILE_APPEND);

                    //file_put_contents(__DIR__."/NEW_DAY.txt",$new_day." ",FILE_APPEND);
                    if($new_day==1){

                        $updated_settings_data['today_leads'] =0;
                        if($val_in_settings['tr_active'] == "true"){
                            file_put_contents(__DIR__."/check_TR_active.txt"," tr ".$val_in_settings['tr_active']." id ".$val_in_settings['user_id'].PHP_EOL);
                            // $updated_settings_data['tr_active'] = "false";
                            //$updated_settings_data['active'] = "true";
                            if(array_key_exists('active', $val_in_settings)) {
                                $updated_settings_data['active'] = "true";
                            }
                        }
                    }
                    else{
                        if(array_key_exists('active', $val_in_settings)) {
                            $updated_settings_data['active'] = $val_in_settings['active'];
                        }
                    }

                    //file_put_contents(__DIR__."/check_step.txt"," newday ".$new_day." - val ".print_r($val_in_settings,1).PHP_EOL,FILE_APPEND);

                    if(array_key_exists('limit', $val_in_settings)) {
                        $updated_settings_data['limit'] = $val_in_settings['limit'];
                        //file_put_contents(__DIR__."/check_step.txt"," обновили limit ".PHP_EOL,FILE_APPEND);
                    }

                    if(array_key_exists('tr_active', $val_in_settings)) {
                        $updated_settings_data['tr_active'] = $val_in_settings['tr_active'];
                        //file_put_contents(__DIR__."/check_step.txt"," обновили tr_active ".PHP_EOL,FILE_APPEND);
                    }
                    if(array_key_exists('tr_active_date', $val_in_settings)) {
                        $updated_settings_data['tr_active_date'] = $val_in_settings['tr_active_date'];
                        //file_put_contents(__DIR__."/check_step.txt"," обновили tr_active_date ".PHP_EOL,FILE_APPEND);
                    }

                    //file_put_contents(__DIR__."/check_step.txt", print_r($today_leads, 1).PHP_EOL,FILE_APPEND);

                    if(array_key_exists($val_in_settings['user_id'], $today_leads)) {
                        if($today_leads[$val_in_settings['user_id']]<0){
                            $updated_settings_data['today_leads'] = 0;
                        }else{
                            $updated_settings_data['today_leads'] = $today_leads[$val_in_settings['user_id']];
                        }
                        file_put_contents(__DIR__."/check_step.txt"," обновили today_leads ".PHP_EOL);
                    }

                }
            }

            //file_put_contents(__DIR__."/check_step.txt",PHP_EOL." - updated_settings_data ".print_r($updated_settings_data,1).PHP_EOL,FILE_APPEND);

            $new_settings_users[] = $updated_settings_data;
        }

        //file_put_contents(__DIR__."/new_settings_users.txt",PHP_EOL." - new_settings_users ".print_r($new_settings_users,1).PHP_EOL,FILE_APPEND);

        if($val['rights']['is_active']==1){
            //file_put_contents(__DIR__."/check_active.txt",print_r($val,1));
            if ($val['rights']['is_admin']==1){
                $settings_data[0]['admin_users'][$val['name']] = $val['id'];
                // Если текущий пользователь - админ, фиксируем, что это админ
                //if($acc['data']['current_user_id'] == $val['id']) {
                //$settings_data[0]['acc2']=1;
                //file_put_contents(__DIR__."/check_acc2.txt",PHP_EOL."admin",FILE_APPEND);
                //}
            } else {
                $settings_data[0]['all_users'][$val['id']] = $val['name'];
            }
            file_put_contents(__DIR__."/check_acc3.txt",$val['id']." ".$now_id['id']);
            if($val['id']==$now_id['id']){

                if($val['rights']['is_admin']==1){
                    $settings_data[0]['acc2']=1;
                    file_put_contents(__DIR__."/check_acc2.txt",PHP_EOL."admin2");

                }
            }

            foreach($settings_data[0]['chosenUsers'] as $chUse){
                //file_put_contents(__DIR__."/check_setadmin2.txt",PHP_EOL."выбранный пользователь ".$chUse['chosenUser_id'].PHP_EOL."текущий пользователь ".print_r($now_id,1),FILE_APPEND);
                if ($now_id['id']==$chUse['chosenUser_id']){
                    //file_put_contents(__DIR__."/check_setadmin.txt",print_r($val['id'],1),FILE_APPEND);
                    $settings_data[0]['acc2']=1;
                    $settings_data[0]['admin_users'][$chUse['chosenUser_name']] = $chUse['chosenUser_id'];
                    //file_put_contents(__DIR__."/check_acc2.txt",PHP_EOL."chosenuser",FILE_APPEND);
                }
            }
        }else{
            //file_put_contents(__DIR__."/check_active.txt","0",FILE_APPEND);
        }
        //}


    }
    //file_put_contents(__DIR__."/set_check.txt", 'settings_data: '.PHP_EOL);
    //file_put_contents(__DIR__."/set_check.txt",print_r($settings_data,1), FILE_APPEND);
    //file_put_contents(__DIR__."/admin_check.txt",print_r($settings_data[0]['admin_users'],1),FILE_APPEND);
    //file_put_contents(__DIR__."/check_active.txt",'New: '.print_r($new_settings_users,1));
    file_put_contents(__DIR__."/set_check.txt","");
    $settings_data[0]['users'] = $new_settings_users;

    /*writeDebug([
        'settings_data users' => $settings_data[0]['users'],
    ]);*/
    file_put_contents(__DIR__."/set_check.txt",print_r($settings_data,1));
    /*writeDebug([
        'Шаг' => "settings_data",
        'Данные' => $settings_data[0]['users'],
    ], false, MAIN_LOG_FILE);
*/
}

// УСТАНАВЛИВАЕМ АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ
function set_active(){
    global $settings_data;
    foreach($settings_data[0]['users'] as $key=>$user){
        if(date("Y-m-d",strtotime($user['tr_active_data']))==date("Y-m-d",time())){

            // На текущий день ставим ту активность, которая стояла "на завтра"
            $settings_data[0]['users'][$key]['active']=$settings_data[0]['users'][$key]['tr_active'];

            // Для даты "на завтра" устанавливаем дату следующего дня
            $settings_data[0]['users'][$key]['tr_active_date']=date('Y-m-d', strtotime($user['tr_active_data'] . ' +1 day'));

        }
    }
}

// ПОЛУЧАЕМ ВОРОНКИ И ЭТАПЫ
function get_pipes(){
    global $settings_data;

    $pip = call('leads/pipelines');

    $settings_data[0]['pipes']['pipeline'] = $pip['data']['_embedded']['pipelines'];
    foreach($settings_data[0]['pipes']['pipeline'] as $keyp=>$pip){
        $settings_data[0]['pipes']['pip_name'][$pip['id']]= $pip['name'];
        foreach($pip['_embedded']['statuses'] as $keyl => $lead){
            $settings_data[0]['pipes']['lead_name'][$pip['id']][$lead['id']] = $lead['name'];
        }
    }
}

// ПОЛУЧАЕМ ИСТОЧНИКИ
function get_source(){
    global $settings_data;
    //file_put_contents(__DIR__."/get_source.txt",1);
    $deals_custom_fields = call('leads/custom_fields/'.SOURCE_FIELD_ID.'?limit=250');
    //file_put_contents(__DIR__."/get_source.txt",print_r($deals_custom_fields,1),FILE_APPEND);
    $all_sourc = $deals_custom_fields['data']['enums'];
    foreach($all_sourc as $key=>$val){
        $settings_data[0]['source'][$key] = $val['value'];
    }

}

// ПОЛУЧАЕМ СДЕЛКИ ДЛЯ ТАБЛИЦЫ С ФИЛЬТРОМ ПО ЭТАПАМ
function table_leads(&$data) {

    get_auth_data();
    writeDebug([
            'Шаг' => "table_leads",
    ], false, MAIN_LOG_FILE);
    // Получаем настройки
    $settings_data = [];
    if(file_exists(__DIR__.'/settings.json')) {
        $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
    }

    $today_leads = [];
    if(file_exists(__DIR__.'/today_leads1.json')) {
        $today_leads_file = file_get_contents(__DIR__.'/today_leads1.json');
        if($today_leads_file != "") {
            $today_leads = json_decode($today_leads_file,1);
        }
    }
    // Если нет настроек или не выбраны статусы, выходим
    if(count($settings_data) == 0 || !array_key_exists('chosenPipes', $settings_data[0]) || count($settings_data[0]['chosenPipes']) == 0) {
        writeDebug([
            'Шаг' => "нет настроек или не выбраны статусы, выходим.",
        ], false, MAIN_LOG_FILE);
        return;
    }

    // Устанавливаем фильтры по выбранным статусам
    $statuses_filter = "";
    $i=0;
    foreach($settings_data[0]['chosenPipes'] as $ch_key=>$choos_pipe){
        $statuses_filter.="&filter[statuses][".$i."][pipeline_id]=".$choos_pipe['chosenPipe_id']."&filter[statuses][".$i."][status_id]=".$choos_pipe['chosenStatus_id'];
        $i++;
    }

    $id_user_for_call_task = "";
    // Ищем данные по каждому пользователю
    foreach($data as $user_id => $user_data){

        //Добавляем в фильтр отбор по ответственному
        $filter = $statuses_filter."&filter[responsible_user_id]=".$user_id;

        // ДОСТАЕМ СДЕЛКИ
        $all_leads = [];

        $leads = call('leads?limit=250'.$filter.'order[created_at]=asc');
        if(($leads['result']!=0)||($leads['result']!=null)){
            $all_leads = array_merge($all_leads, $leads['data']["_embedded"]["leads"]);
            while(array_key_exists("next", $leads['data']["_links"])) {
                $leads = amo_get_next($leads['data']["_links"]["next"]["href"]);
                $all_leads = array_merge($all_leads, $leads['data']["_embedded"]["leads"]);
            }
        }

        //file_put_contents(__DIR__."/LEADS.txt",print_r($all_leads,1));
        if((!count($all_leads)==0)||(!count($all_leads)==null)){
            $data[$user_id]['leads'] = count($all_leads);
        }
        //$data[$user_id]['leads'] = count($all_leads);
        /**/
    }
    foreach($settings_data[0]['users'] as $key=>$val){
        if(array_key_exists($val['user_id'],$today_leads)){
            $data[$val['user_id']]['today_leads'] = $today_leads[$val['user_id']];
        }
    }

}

// ПОЛУЧАЕМ СДЕЛКИ К РАСПРЕДЕЛЕНИЮ
function leads_on_start_statuses() {

    get_auth_data();

    // Получаем настройки
    $settings_data = [];
    if(file_exists(__DIR__.'/settings.json')) {
        $settings_data = json_decode(file_get_contents(__DIR__.'/settings.json'),1);
    }

    // Если нет настроек или не выбраны статусы, выходим
    if(count($settings_data) == 0 || !array_key_exists('chosenStartStatuses', $settings_data[0]) || count($settings_data[0]['chosenStartStatuses']) == 0) {
        return [];
    }

    // Устанавливаем фильтры по выбранным статусам
    $statuses_filter = "";
    $i=0;
    foreach($settings_data[0]['chosenStartStatuses'] as $ch_key=>$choos_pipe){
        $statuses_filter.="&filter[statuses][".$i."][pipeline_id]=".$choos_pipe['chosenPipe_id']."&filter[statuses][".$i."][status_id]=".$choos_pipe['chosenStatus_id'];
        $i++;
    }
    // ДОСТАЕМ СДЕЛКИ
    $all_leads = [];
    $leads = call('leads?with=contacts&limit=250'.$statuses_filter);
    if(count($leads["data"]) == 0 || $leads['result'] == false){
        file_put_contents(__DIR__."/check_start1.txt",0);
    }
   /*writeDebug([
        'Шаг' => $leads,
    ], false, MAIN_LOG_FILE);*/ 
        
    if($leads['result'] == null) {
        writeDebug([
            'Шаг' => "Нет сделок к распределению. Завершаем.",
        ], false, MAIN_LOG_FILE);
        file_put_contents(__DIR__."/check_start1.txt",0);
        die;
    }
    
    $all_leads = array_merge($all_leads, $leads['data']["_embedded"]["leads"]);

    while(array_key_exists("next", $leads['data']["_links"])) {
        $leads = amo_get_next($leads['data']["_links"]["next"]["href"]);
        $all_leads = array_merge($all_leads, $leads['data']["_embedded"]["leads"]);
    }
    return $all_leads;

}



//  ПОЛУЧАЕМ ЗАДАЧИ
function table_tasks(&$data) {
    $count_leads = [];
    $all_tasks_l = [];
    global $today;
    writeDebug([
            'Шаг' => "table_tasks",
    ], false, MAIN_LOG_FILE);
    // Ищем данные по каждому пользователю
    foreach($data as $user_id => $user_data) {
        $all_tasks = [];
        $used_lead = [];
        $tasks = call('tasks?limit=250&filter[is_completed]=0&filter[responsible_user_id]='.$user_id);
        
        
        
        if(($tasks['result']!=null) || ($tasks['result']!=0)){
            $all_tasks = array_merge($all_tasks, $tasks['data']["_embedded"]["tasks"]);
            while(array_key_exists("next", $tasks['data']["_links"])) {
                $tasks = amo_get_next($tasks['data']["_links"]["next"]["href"]);
                $all_tasks = array_merge($all_tasks, $tasks['data']["_embedded"]["tasks"]);
            }
        }
         /*writeDebug([
            'Шаг' => "table_tasks tasks",
            'tasks' => $all_tasks,
        ], false, MAIN_LOG_FILE);*/
        //file_put_contents(__DIR__."/TASKS.txt",print_r($tasks,1));
        $overdue = 0;

        foreach($all_tasks as $task=> $val){
            if($val["complete_till"]<time()){
                $overdue++;

            }
            if(strtotime(date('Y-m-d',$val["complete_till"]))<=strtotime(date('Y-m-d'))){
                //file_put_contents(__DIR__."/check_tasks_time.txt",date('Y-m-d',$val["complete_till"])." 1 ".date('Y-m-d',time()).PHP_EOL,FILE_APPEND);
                $used_lead[$val['entity_id']]+=1;
            }
        }
        writeDebug([
            'Шаг' => "table_tasks overdue",
        ], false, MAIN_LOG_FILE);
        
        $data[$user_id]['overdue'] = $overdue;

        foreach($used_lead as $key => $val){
            if($val >=1){
                if((!$data[$user_id]['leads_with_tasks'])||($data[$user_id]['leads_with_tasks'] == 0)){
                    $data[$user_id]['leads_with_tasks']=1;
                }else{
                    $data[$user_id]['leads_with_tasks']+=1;
                }
            }
        }

    }
    writeDebug([
            'Шаг' => "table_tasks end",
    ], false, MAIN_LOG_FILE);

}


//  СОСТАВЛЯПМ ПРИОРИТЕТЫ
function prioritet($firsts_leads){
    global $settings_data;
    $fk = 0;
    $sk = 0;
    $tk = 0;

    $us_leads = 0;
    $sr = 0;
    $thc_ch=$settings_data[0]['source'];



    $frs_ch=[];
    $scn_fc=[];
    $kk = 0;

    foreach($settings_data[0]['firstchosenSource'] as $key=>$val){
        $frc_ch[$key]=$val['firstchosenSource_name'];
        $kk=array_search($val['firstchosenSource_name'],$thc_ch);
        unset($thc_ch[$kk]);
    }

    foreach($settings_data[0]['secondchosenSource'] as $key=>$val){

        $scn_fc[$key]=$val['secondchosenSource_name'];
        $kk=array_search($val['secondchosenSource_name'],$thc_ch);
        unset($thc_ch[$kk]);

    }

    $fr_leads = [];
    $sc_leads = [];

    foreach ($firsts_leads as $lead){
        if($lead['custom_fields_values']!=null){
            foreach($lead['custom_fields_values'] as $key => $custom_fields_values){
                foreach($custom_fields_values as $fname=>$field_name){

                    if($field_name=='Источник прихода'){
                        if (in_array($lead['custom_fields_values'][$key]['values'][0]['value'],$frc_ch)){
                            $fr_leads[$fk] = $lead;
                            $fk += 1;
                        }
                        elseif(in_array($lead['custom_fields_values'][$key]['values'][0]['value'],$scn_fc)){
                            $sc_leads[$sk] = $lead;
                            $sk += 1;
                        }
                    }

                }
            }
        }
    }

    $all_ocher = [$fr_leads,$sc_leads];

    return ($all_ocher);
}




function ochered(&$data, $startStatuses, $targetStatuses, $one_lead, $chosenUserDeal, $chosenStageDeal){
    try{
        global $settings_data;
        file_put_contents(__DIR__."/rezerv_time.txt",date("Y-m-d H:i", strtotime("+30 minutes"))); // ставим время для снятия ключя из-за занятости распределения через час
        writeDebug([
            'Распределяем лид с id' => $one_lead['id'],
        ], false, MAIN_LOG_FILE);
        
        /*writeDebug([
            'Состояние пользователей' => $data,
        ], false, MAIN_LOG_FILE);*/
        
        //file_put_contents(__DIR__."/log2.txt",'Распределяем лид с id'.PHP_EOL,FILE_APPEND);
        $today_leads = [];
        if(file_exists(__DIR__.'/today_leads1.json')) {
            $today_leads_file = file_get_contents(__DIR__.'/today_leads1.json');
            if($today_leads_file != "") {
                $today_leads = json_decode($today_leads_file,1);
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //file_put_contents(__DIR__."/СhosenUserDeal.txt",print_r($chosenUserDeal,1));
        get_auth_data();
        $id_contact = $one_lead['_embedded']['contacts'][0]['id'];
        file_put_contents(__DIR__."/OneLead.txt",print_r($one_lead,1));
        if( $one_lead['_embedded']['contacts'][0]['id'] != null){
            $contacts = call("contacts/".$id_contact); //?with=leads
        }
        else{
             $contacts = 0;
        }
        file_put_contents(__DIR__."/FullContactID.txt",$id_contact);
        file_put_contents(__DIR__."/FullContacts.txt",print_r($contacts,1)." ".$id_contact);
        
        
        writeDebug([
            'Контакты' => $contacts,
        ], false, MAIN_LOG_FILE);
        
        $repeated_deal = 0;
        if($contacts != 0){
            foreach($contacts['data']['custom_fields_values'] as $key=>$custom_fields){
                if($custom_fields['field_id']==577568){
                    if($custom_fields['values'][0]['value']!=0 && $custom_fields['values'][0]['value']!=null && $custom_fields['values'][0]['value']>=1){
                        $repeated_deal = 1;
                        writeDebug([
                            'сделка повторная' => $custom_fields['values'][0]['value'],
                        ], false, MAIN_LOG_FILE);
                         file_put_contents(__DIR__."/CHECK_REPEATED.txt",$custom_fields['values'][0]['value'].PHP_EOL);
                         break;
                    }
                    else{
                        $repeated_deal = 0;
                        writeDebug([
                            'сделка ' => 'первична',
                        ], false, MAIN_LOG_FILE);
                        file_put_contents(__DIR__."/CHECK_REPEATED.txt",$custom_fields['values'][0]['value'].PHP_EOL);
                    }
                }
            }
        }else{
            $repeated_deal = 0;
            //writeDebug([
              //  'сделка ' => 'первична',
            //], false, MAIN_LOG_FILE);
            //file_put_contents(__DIR__."/CHECK_REPEATED.txt",$custom_fields['values'][0]['value'].PHP_EOL,FILE_APPEND);
        }
        file_put_contents(__DIR__."/CHECK_REPEATED.txt",$repeated_deal.PHP_EOL);
        
        if($repeated_deal !=1){
             writeDebug([
                'сделка ' => 'первична',
            ], false, MAIN_LOG_FILE);
        }
    
        $work_pipe = 0;
        $target_status_id = 0;
    
        foreach($startStatuses as $key=>$val){
            if ($one_lead['status_id'] == $val['chosenStatus_id']){
                $work_pipe = $val['chosenPipe_id'];
                break;
            }
        }
        //file_put_contents(__DIR__."/check_stop1.txt","startStatuses".PHP_EOL,FILE_APPEND);
        foreach ($targetStatuses as $key=>$val){
            if ($val['chosenPipe_id'] == $work_pipe){
                $target_status_id = $val['chosenStatus_id'];
            }
        }
    
        if($work_pipe == 0 || $target_status_id == 0) {
            //file_put_contents(__DIR__."/log2.txt","Не удалось определить целевой статус для лида".PHP_EOL,FILE_APPEND);
            writeDebug([
                'Ошибка' => "Не удалось определить целевой статус для лида",
            ], false, MAIN_LOG_FILE);
            return false;
        }
    
        $user_ids = array_keys($data);
        $first_key = $user_ids[0]; // id первого пользователя в списке
        $last_key = $user_ids[count($user_ids)-1]; // id последнего пользователя в списке
        $targetUser = $first_key; // по умолчанию нужно начать с первого в списке
        $last_user = 0;
    
        // Если известно на кого распределили в прошлый раз и он есть в списке, начнем отсчет с него
        if( file_exists(__DIR__.'/last_user.txt') ) {
            $last_user_form_file = file_get_contents(__DIR__ . "/last_user.txt");
            if(!empty($last_user_form_file)) {
                if(in_array($last_user_form_file, $user_ids)) {
                    $last_user = $last_user_form_file;
                    writeDebug([
                        'Последний раз распределяли на' => $last_user,
                    ], false, MAIN_LOG_FILE);
                }
                else{
                    $last_user = $first_key;
                    writeDebug([
                        'Последний пользователь отключен от распределения, в качестве последнего пользователя бкрем первого из активных' => $last_user,
                    ], false, MAIN_LOG_FILE);
                }
            }
        }
    
        $targetUserFound = false;
        if($last_user != $first_key) {
            $startIndex = array_search($last_user, $user_ids);
            $slicedArray = array_slice($data, $startIndex, null, true);
            foreach ($slicedArray as $uskey => $val) {
    
                // Того, на которого распределяли ранее пропускаем
                if($uskey == $last_user) {
                    continue;
                }
                
         
                writeDebug([
                    'Проверяем пользователя' => $uskey,
                    'Это' => "вротая часть массива",
                    'Его статус' => $val,
                ], false, MAIN_LOG_FILE);
                
                if( $val['leads'] < $val['limit'] && $one_lead['responsible_user_id'] != $uskey) {
                     if($repeated_deal == 1){
                        if(in_array($uskey,$chosenUserDeal)){
                            $targetUserFound = true;
                            $targetUser = $uskey;
                            writeDebug([
                                'Шаг' => "Нашли на кого распределить повторку",
                            ], false, MAIN_LOG_FILE);
                            break;
                        } else{
                            writeDebug([
                                'Шаг' => "повторная сделка безуспешно",
                            ], false, MAIN_LOG_FILE);
                        }
                    }else{
                        if(!in_array($uskey,$chosenUserDeal)){
                            $targetUserFound = true;
                            $targetUser = $uskey;
                            writeDebug([
                                'Шаг' => "Нашли на кого распределить в ифе",
                            ], false, MAIN_LOG_FILE);
                            break;
                        }
                        else{
                            writeDebug([
                                'Шаг' => "НЕ нашли на кого распределить в ифе",
                            ], false, MAIN_LOG_FILE);
                        }
                    }
                }
            }
    
        }
    
        if(!$targetUserFound) {
            foreach ($data as $uskey => $val) {
    
                writeDebug([
                    'Проверяем пользователя' => $uskey,
                    'Это' => "первая часть массива",
                    'Его статус' => $val,
                ], false, MAIN_LOG_FILE);
    
                if($last_user == $uskey && count($data) > 1 ) {
                    writeDebug([
                        'Это' => "на него распределяли в прошлый раз, пропускаем",
                    ], false, MAIN_LOG_FILE);
                    continue;
                }
                
                if( $val['leads'] < $val['limit'] && $one_lead['responsible_user_id'] != $uskey) {
                    if($repeated_deal == 1){
                        if(in_array($uskey,$chosenUserDeal)){
                            $targetUserFound = true;
                            $targetUser = $uskey;
                            writeDebug([
                                'Шаг' => "Нашли на кого распределить повторку",
                            ], false, MAIN_LOG_FILE);
                            break;
                        } else{
                            writeDebug([
                                'Шаг' => "повторная сделка безуспешно",
                            ], false, MAIN_LOG_FILE);
                        }
                    }else{
                        if(!in_array($uskey,$chosenUserDeal)){
                            $targetUserFound = true;
                            $targetUser = $uskey;
                            writeDebug([
                                'Шаг' => "Нашли на кого распределить в ифе",
                            ], false, MAIN_LOG_FILE);
                            break;
                        }
                        else{
                            writeDebug([
                                'Шаг' => "НЕ нашли на кого распределить в ифе",
                            ], false, MAIN_LOG_FILE);
                        }
                    }
                }
            }
        }
        if(!$targetUserFound && $last_user != 0){
            if( $data[$last_user]['leads'] < $data[$last_user]['limit'] && $one_lead['responsible_user_id'] != $last_user ) {
                if($repeated_deal != 1){
                    if(!in_array($last_user,$chosenUserDeal)){
                        $targetUserFound = true;
                        $targetUser = $last_user;
                        writeDebug([
                                'Шаг' => "Нашли на кого распределить в ПОСЛЕДНЕМ ифе",
                        ], false, MAIN_LOG_FILE);
                    }
                }else{
                     if(in_array($last_user,$chosenUserDeal)){
                        $targetUserFound = true;
                        $targetUser = $last_user;
                        writeDebug([
                                'Шаг' => "Нашли на кого распределить в ПОСЛЕДНЕМ ифе",
                        ], false, MAIN_LOG_FILE);
                     }
                }
            }
        }
        
        if(!$targetUserFound){
            writeDebug([
                'Шаг' => "Нет работников со свободным лимитом",
            ], false, MAIN_LOG_FILE);
            file_put_contents(__DIR__."/check_start1.txt",0);
            file_put_contents(__DIR__."/check_stop1.txt","Нет работников со свободным лимито".PHP_EOL);
            
        }    
        elseif($data[$targetUser]['leads'] < $data[$targetUser]['limit']){
            writeDebug([
                'Нашли подходящего пользователя' => "ыфапфыап",
                'repeated_deal'=>$repeated_deal,
            ], false, MAIN_LOG_FILE);
            writeDebug([
                'Нашли подходящего пользователя' => $targetUser,
            ], false, MAIN_LOG_FILE);
            
            if($repeated_deal!=1){
                $dat=[
                    'responsible_user_id' => (int)$targetUser,
                    'pipeline_id' => (int)$targetStatuses[0]['chosenPipe_id'],
                    'status_id' => (int)$targetStatuses[0]['chosenStatus_id'],
                ];
            } else{
                $dat=[
                    'responsible_user_id' => (int)$targetUser,
                    'pipeline_id' => (int)$chosenStageDeal[0]['chosenDealPipe_id'],
                    'status_id' => (int)$chosenStageDeal[0]['chosenDealStatus_id']
                ];
            }
            file_put_contents(__DIR__."/check_dat.txt",print_r($dat,1).PHP_EOL);
            $add = call2update('leads/'.$one_lead['id'],$dat);
            
            file_put_contents(__DIR__."/LogAdd.txt","---------------".date('H:i:s')."---------------"."chosenUserDeal ".print_r($chosenUserDeal,1).PHP_EOL."add".PHP_EOL.print_r($add,1).PHP_EOL."dat".PHP_EOL.print_r($dat,1).PHP_EOL."repeated_deal ".$repeated_deal.PHP_EOL,FILE_APPEND);
            writeDebug([
                'Отправили в амо' => $dat,
                'результат распределения' => $add['result']
            ], false, MAIN_LOG_FILE);
        
           
            if( $add['result'] == 1 ) {
                $data[$targetUser]['leads']++;
                foreach($settings_data[0]['users'] as $key2=>$val2){
                    if($val2['user_id'] == $one_lead['responsible_user_id']){
                        if( array_key_exists($one_lead['responsible_user_id'], $today_leads)
                            && $today_leads[$one_lead['responsible_user_id']]>0 ) {
                            $today_leads[$one_lead['responsible_user_id']] -=1;
                            writeDebug([
                                'Уменьшили кол-во лидов на пользователе' => $one_lead['responsible_user_id'],
                                "Теперь у него лидов" => $today_leads[$one_lead['responsible_user_id']]
                            ], false, MAIN_LOG_FILE);
                        }
                        if( array_key_exists('today_leads', $settings_data[0]['users'][$key2])
                            && $settings_data[0]['users'][$key2]['today_leads'] > 0 ) {
                            $settings_data[0]['users'][$key2]['today_leads'] -= 1;
                        }
                    }// elseif($val2['user_id'] == $targetUser) {
                        
                        
                    //}
                }
        
                if( array_key_exists($targetUser, $today_leads)) {
                    $today_leads[$targetUser]++;
                } else {
                    $today_leads[$targetUser] = 1;
                }
                writeDebug([
                    'Добавили кол-во лидов на пользователе' => $targetUser,
                    "Теперь у него лидов" => $today_leads[$targetUser]
                ], false, MAIN_LOG_FILE);
        
        /*
                if( array_key_exists('today_leads', $settings_data[0]['users'][$key2])) {
                    $settings_data[0]['users'][$key2]['today_leads']++;
                } else {
                    $settings_data[0]['users'][$key2]['today_leads'] = 1;
                }
        */
        
                file_put_contents(__DIR__."/today_leads1.json", json_encode($today_leads));
                file_put_contents(__DIR__."/last_user.txt", $targetUser);
            }
        }
    return true;
    }

    catch(Exception $e)
    {
     file_put_contents(__DIR__."/check_start1.txt",0);  
     writeDebug([
      'error' => $e->getMessage()
     ]);
     die;
    }
    
}
