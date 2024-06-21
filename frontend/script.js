define([
  "jquery",
  "underscore",
  "lib/components/base/modal",
  "twigjs",
], function ($, _, Modal, Twig) {
  var CustomWidget = function () {
    var self = this;

    this.getTemplate = _.bind(function (template, params, callback) {
      params = typeof params == "object" ? params : {};
      template = template || "";

      return this.render(
        {
          href: "/templates/" + template + ".twig",
          base_path: this.params.path,
          v: this.get_version(),
          load: callback,
        },
        params
      );
    }, this);

    this.callbacks = {
      render: function () {
        self.render_template({
          body: "",
          caption: {
            class_name: "widget-distribution",
          },
          render:
            '<button class="widget-show-btn" data-code="open-widget231"> Открыть виджет </button>',
        });
        console.log("render");
        return true;
      },
      init: _.bind(function () {
        console.log("init resp");

        var data = `<div class="advanced-settings" id="{{ widget_code }}__advanced-settings">
          <div class="{{ widget_code }}__white_block__description"></div>
          <div id="preloader">
            <div class="tab"></div>
            <div class="pctr"></div>
          </div>
          <div class="maincontent">
            <table class="responsible_que_rules_table">
            <div class="header-cont">
              <h1 class="header">проходят технические работы, воспользуйтесь другим виджетом</h1>
              <button class="update-button2">Обновить данные</button>
            </div>
              <tr class="table-header">
              <th>Пользователь</th>
              <th>Лимит сделок в активном статусе</th>
              <th>Распределить сегодня</th>
              <th>Распределить завтра</th>
              <th>Лиды с задачами на сегодня</th>
              <th>Новые лиды за сегодня</th>
              <th>Количество лидов</th>
              <th>Просроченные задачи</th>
              </tr>
            </table>
          </div>
        
          <!-- toggled menu -->
        
          <div id="startStatusesMenuBlock" class="select-menu style-block">
            <div class="inner-title">
              <div class="menu-title">Воронки и этапы</div>
              <div class="del" onclick="renderHiddenBlock('startStatusesMenuBlock');">x</div>
            </div>
            <div id="start_statuses_container"></div>
          </div>
        
          <div id="afterStatusesMenuBlock" class="select-menu style-block">
            <div class="inner-title">
              <div class="menu-title">Воронки и этапы</div>
              <div class="del" onclick="renderHiddenBlock('afterStatusesMenuBlock');">x</div>
            </div>
            <div id="after_statuses_container"></div>
          </div>
        
          <div id="pipeMenuBlock" class="select-menu style-block">
            <div class="inner-title">
              <div class="menu-title">Воронки и этапы</div>
              <div class="del" onclick="renderHiddenBlock('pipeMenuBlock');">x</div>
            </div>
            <div id="pipes_container"></div>
          </div>
        
          <div id="roleMenuBlock" class="select-menu style-block">
            <div class="inner-title">
                <div class="menu-title">Пользователи</div>
              <div class="del" onclick="renderHiddenBlock('roleMenuBlock');">x</div>
            </div>
              <div id="users_container"></div>
          </div>
        
          <div id="firstSourceMenuBlock" class="select-menu styleSource">
            <div class="inner-title">
              <div class="menu-title">Источники</div>
              <div class="del" onclick="renderHiddenBlock('firstSourceMenuBlock');">x</div>
            </div>
            <div id="firstSource_container"></div>
          </div>
        
          <div id="secondSourceMenuBlock" class="select-menu styleSource">
            <div class="inner-title">
              <div class="menu-title">Источники</div>
              <div class="del" onclick="renderHiddenBlock('secondSourceMenuBlock');">x</div>
            </div>
            <div id="secondSource_container"></div>
          </div>
        
        </div>
            
        <!------------------->
        
        <!-- Pipes And Roles Container -->
        <div class="pipesRoles_container">
        
          <div class="title">Этапы, с которых распределять сделки</div>
          <div class="list-container">
            <div id="start_statuses" class="pipeline"></div>
            <button class="append-btn" onclick="
              renderHiddenBlock('startStatusesMenuBlock')
            ">+</button>
          </div>
        
          <div class="title">Этапы, на которые распределять сделки</div>
          <div class="list-container">
            <div id="after_statuses" class="pipeline"></div>
            <button class="append-btn" onclick="
              renderHiddenBlock('afterStatusesMenuBlock')
            ">+</button>
          </div>
        
          <div class="title">Этапы "в работе" для определения лимитов</div>
          <div class="list-container">
            <div id="pipeline" class="pipeline"></div>
            <button class="append-btn" onclick="
              renderHiddenBlock('pipeMenuBlock')
            ">+</button>
          </div>
        
          <div class="title">Пользователи</div>
          <div class="list-container">
            <div id="user" class="user"></div>
            <button class="append-btn" onclick="
              renderHiddenBlock('roleMenuBlock')
            ">+</button>
          </div>
        </div>
        <!-------------------------------->
          
        <!--Sources Container-->
        <div class="sourcesContainer">
          <div class="title">Приоритетные источники</div>
          <div class="sourceContent">
            <div class="sideTitle1">Первая очередь</div>
            <div class="listT-container">
              <div id="sourceFirst" class="sourceFirst"></div>
              <button class="append-btn" onclick="
                renderHiddenBlock('firstSourceMenuBlock')
              ">+</button>
            </div>
            <div class="sideTitle">Вторая очередь</div>
            <div class="listT-container">
              <div id="sourceSecond" class="sourceSecond"></div>
              <button class="append-btn" onclick="
                renderHiddenBlock('secondSourceMenuBlock')
              ">+</button>
            </div>
          </div>
        </div>
        <!--------------------->
            
        <div class="action_pannel">
          <div id="save_settings_btn" class="action_btn_green">
            <button class="save-button">Сохранить настройки</button>
          </div>
        </div>	
        <div id="ban1" class="unbanned1">
          <div class="warning-cover">
            <div class="warning-icon"></div>
          </div>
          <div class="warning-text">
            <div class="wrn-txt">Предупреждение!</div>
            <div class="upper-text">У вас отсутствуют права доступа.</div>
            <div class="under-text">Обратитесь к администратору</div>
          </div>
        </div>
        
        <script>

          $(document).mouseup(function (e) {
            // Событие клика по веб-документу
        
            // Проверяем и закрываем мультиселекты
            var multi_selects = $('.style-block');
            $.each(multi_selects, function(index, el) {
              if(!$(el).is(":hidden")) {
                  if ( !$(el).is(e.target) // если клик был не по нашему блоку
                      && $(el).has(e.target).length === 0 ) { // и не по его дочерним элементам
                    $(el).addClass("select-menu"); // скрываем его
                  }
              }
            });
        
            var multi_selects2 = $('.styleSource');
            $.each(multi_selects2, function(index, el) {
              if(!$(el).is(":hidden")) {
                  if ( !$(el).is(e.target) // если клик был не по нашему блоку
                      && $(el).has(e.target).length === 0 ) { // и не по его дочерним элементам
                    $(el).addClass("select-menu"); // скрываем его
                  }
              }
            });
          });
        
          function renderHiddenBlock(menuId) {
            const menuBlock = document.getElementById(menuId);
            if (menuBlock.classList.contains("select-menu")) {
              menuBlock.classList.remove("select-menu");
            } else {
              menuBlock.classList.add("select-menu");
            }
          }
      
          function arrangeAll(existing_settings) {
            if (existing_settings[0].acc == 1) {
            // Формируем массив со списком пользователей и данными из полученных с сервера настроек
              var app_settings = [];
              $.each(APP.constant("managers"), function (key, user_data) {
                group = parseInt(user_data.group.replace("group_", ""), 10);
                // Готовим настройки пользователя по умолчанию: id и имя из системных настроек, лимит и активность - по нулям
                if (user_data.active === false) {
                  return;
                }
                if ($.inArray(group, existing_settings.active_groups) != -1) {
                  let this_user_settings = {
                    user_id: user_data.id,
                    user_name: user_data.title,
                    limit: 0,
                    active: "",
                    tr_active: "",
                    today_leads: 0,
                    leads: 0,
                    overdue: 0,
                    active: false,
                  };

                  // ищем сохраненные данные по этому пользователю в данных с сервер, если находим заменяем ими настройки по умолчанию
                  $.each(
                    existing_settings[0].users,
                    function (key, existing_settings_element) {
                      if (existing_settings_element.user_id == user_data.id) {
                        this_user_settings.limit =
                          existing_settings_element.limit;
                        this_user_settings.leads =
                          existing_settings_element.leads;
                        this_user_settings.overdue =
                          existing_settings_element.overdue;
                        this_user_settings.active =
                          existing_settings_element.active == "true"
                            ? "checked"
                            : "";
                        this_user_settings.tr_active =
                          existing_settings_element.tr_active == "true"
                            ? "checked"
                            : "";
                      }
                    }
                  );
                  // добавляем в массив настроек, из которого будем формировать строки таблицы
                  app_settings.push(this_user_settings);
                }
              });

              chosen_u = [];

              // Отображение выбранных пользователей после перезагрузки
              if (existing_settings[0].chosenUsers) {
                $.each(
                  existing_settings[0].chosenUsers,
                  function (key, existing_settings_element) {
                    $("#user").append(
                      '<div class="chosenUser_container"><div class="chosen_user" user_id="' +
                        existing_settings_element.chosenUser_id +
                        '">' +
                        existing_settings_element.chosenUser_name +
                        '</div><div class="delete_user">x</div></div>'
                    );
                    chosen_u.push({
                      user_name: existing_settings_element.chosenUser_name,
                      user_id: existing_settings_element.chosenUser_id,
                    });
                  }
                );
              }

              // Формирование списка пользователей
              var html_users = "";
              $.each(
                existing_settings[0].all_users,
                function (user_id, user) {
                  let user_hidden = "";
                  $.each(chosen_u, function (key, value) {
                    if (value.user_name == user) {
                      user_hidden = ' style="display: none"';
                      return;
                    }
                  });
                  html_users +=
                    '<div class="user_name" user_id="' +
                    user_id +
                    '"' +
                    user_hidden +
                    ">" +
                    user +
                    "</div>";
                }
              );
              $("#users_container").append(html_users);

              $("#users_container").on("click", ".user_name", function () {
                $(this).hide();
              });

              $(document).on("click", ".delete_user", function (event) {
                $(event.target).parent().remove();
                $("#users_container .user_name").each(function (index, el) {
                  if (
                    $(el).attr("user_id") ==
                    $($(event.target).prev()).attr("user_id")
                  ) {
                    $(el).show();
                  }
                });
              });

              // <<------------
              // статусы, с которых распределять

              chosen_statuses = [];
              // отображение выбранных статусов, с которых будут распределяться лиды
              if (existing_settings[0].chosenStartStatuses) {
                $.each(
                  existing_settings[0].chosenStartStatuses,
                  function (key, existing_settings_element) {
                    $("#start_statuses").append(
                      '<div class="chosenStartStatus_container"><div class="chosen_pipe" status_id="' +
                        existing_settings_element.chosenStatus_id +
                        '" pipe_id="' +
                        existing_settings_element.chosenPipe_id +
                        '">' +
                        existing_settings_element.chosenPipe_name +
                        '</div><div class="delete_start_status">x</div></div>'
                    );
                    chosen_statuses.push({
                      pipe_name: existing_settings_element.chosenPipe_name,
                      pipe_id: existing_settings_element.chosenPipe_id,
                      status_id: existing_settings_element.chosenStatus_id,
                    });
                  }
                );
              }
              if (existing_settings[0].chosenAfterStatuses) {
                $.each(
                  existing_settings[0].chosenAfterStatuses,
                  function (key, existing_settings_element) {
                    $("#after_statuses").append(
                      '<div class="chosenAfterStatus_container"><div class="chosen_pipe" status_id="' +
                        existing_settings_element.chosenStatus_id +
                        '" pipe_id="' +
                        existing_settings_element.chosenPipe_id +
                        '">' +
                        existing_settings_element.chosenPipe_name +
                        '</div><div class="delete_after_status">x</div></div>'
                    );
                    chosen_statuses.push({
                      pipe_name: existing_settings_element.chosenPipe_name,
                      pipe_id: existing_settings_element.chosenPipe_id,
                      status_id: existing_settings_element.chosenStatus_id,
                    });
                  }
                );
              }

              // Формируем список воронок
              $.each(
                existing_settings[0].pipes.pip_name,
                function (pipe_id, pip_type) {
                  var html_start_statuses = "";
                  var html_start_st_child = "";
                  var startStChildContainer = $(
                    '<div class="not_active start_st_child_container"></div>'
                  );

                  $.each(
                    existing_settings[0].pipes.lead_name,
                    function (pipe_id_l, lead) {
                      if (pipe_id_l !== pipe_id) {
                        return;
                      }
                      $.each(lead, function (lead_id, lead_name) {
                        let counter = 0;
                        $.each(chosen_statuses, function (key, val) {
                          if (val.status_id == lead_id) {
                            counter = 1;
                            html_start_st_child +=
                              '<div style="display: none;" class="start_st_child" pipe_in_id = "' +
                              pipe_id_l +
                              '" lead_id="' +
                              lead_id +
                              '">' +
                              lead_name +
                              "</div>";
                            return;
                          }
                        });
                        if (counter == 1) {
                          return;
                        }
                        html_start_st_child +=
                          '<div class="start_st_child" pipe_in_id = "' +
                          pipe_id_l +
                          '" lead_id="' +
                          lead_id +
                          '">' +
                          lead_name +
                          "</div>";
                      });
                    }
                  );

                  html_start_statuses +=
                    '<div class="start_status"  pipe_id="' +
                    pipe_id +
                    '">' +
                    pip_type +
                    "</div>";

                  // Добавляем html_start_st_child к текущему контейнеру
                  startStChildContainer.attr("for_pipe", pipe_id);
                  startStChildContainer.append(html_start_st_child);
                  $("#start_statuses_container").append(html_start_statuses);
                  $("#start_statuses_container").append(
                    startStChildContainer
                  );
                }
              );

              $("#start_statuses_container").on(
                "click",
                ".start_status",
                function () {
                  let pipeId = $(this).attr("pipe_id");
                  var chilElem = $(".start_st_child_container");
                  $.each(chilElem, function (index, el) {
                    if ($(el).attr("for_pipe") === pipeId) {
                      $(el).removeClass("not_active");
                      $(el).addClass("active");
                    } else {
                      $(el).removeClass("active");
                      $(el).addClass("not_active");
                    }
                  });
                }
              );

              $(document).on("click", ".start_st_child", function (e) {
                let pipeId = $(this).attr("pipe_in_id");
                let lead = $(this).text();
                let statusId = $(this).attr("lead_id");
                let curChild = $(this);
                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    if (pipeId === pipe_id) {
                      $("#start_statuses").append(
                        '<div class="chosenStartStatus_container"><div class="chosen_pipe" status_id = "' +
                          statusId +
                          '" pipe_id="' +
                          pipeId +
                          '">' +
                          pip_type +
                          ": " +
                          lead +
                          '</div><div class="delete_start_status">x</div></div>'
                      );
                      curChild.hide();
                      $(".after_st_child_container .after_st_child").each(
                        function (index, el) {
                          if (
                            $(el).attr("lead_id") == statusId &&
                            $(el).attr("pipe_in_id") == pipeId
                          ) {
                            $(el).hide();
                          }
                        }
                      );
                    }
                  }
                );
              });

              $(document).on(
                "click",
                ".delete_start_status",
                function (event) {
                  var statusId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("status_id");
                  var pipeId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("pipe_id");
                  $(event.target).parent().remove();
                  $(".start_st_child_container .start_st_child").each(
                    function (index, el) {
                      if (
                        $(el).attr("lead_id") == statusId &&
                        $(el).attr("pipe_in_id") == pipeId
                      ) {
                        $(el).show();
                      }
                    }
                  );
                  $(".after_st_child_container .after_st_child").each(
                    function (index, el) {
                      if (
                        $(el).attr("lead_id") == statusId &&
                        $(el).attr("pipe_in_id") == pipeId
                      ) {
                        $(el).show();
                      }
                    }
                  );
                }
              );

              //
              $.each(
                existing_settings[0].pipes.pip_name,
                function (pipe_id, pip_type) {
                  var html_after_statuses = "";
                  var html_after_st_child = "";
                  var afterStChildContainer = $(
                    '<div class="not_active after_st_child_container"></div>'
                  );

                  $.each(
                    existing_settings[0].pipes.lead_name,
                    function (pipe_id_l, lead) {
                      if (pipe_id_l !== pipe_id) {
                        return;
                      }
                      $.each(lead, function (lead_id, lead_name) {
                        let counter = 0;
                        $.each(chosen_statuses, function (key, value) {
                          if (value.status_id == lead_id) {
                            counter = 1;
                            html_after_st_child +=
                              '<div style="display: none;" class="after_st_child" pipe_in_id = "' +
                              pipe_id_l +
                              '" lead_id="' +
                              lead_id +
                              '">' +
                              lead_name +
                              "</div>";
                            return;
                          }
                        });
                        if (counter == 1) {
                          return;
                        }
                        html_after_st_child +=
                          '<div class="after_st_child" pipe_in_id = "' +
                          pipe_id_l +
                          '" lead_id="' +
                          lead_id +
                          '">' +
                          lead_name +
                          "</div>";
                      });
                    }
                  );

                  html_after_statuses +=
                    '<div class="after_status"  pipe_id="' +
                    pipe_id +
                    '">' +
                    pip_type +
                    "</div>";

                  // Добавляем html_after_st_child к текущему контейнеру
                  afterStChildContainer.attr("for_pipe", pipe_id);
                  afterStChildContainer.append(html_after_st_child);
                  $("#after_statuses_container").append(html_after_statuses);
                  $("#after_statuses_container").append(
                    afterStChildContainer
                  );
                }
              );
              //

              $("#after_statuses_container").on(
                "click",
                ".after_status",
                function () {
                  let pipeId = $(this).attr("pipe_id");
                  var chilElem = $(".after_st_child_container");
                  $.each(chilElem, function (index, el) {
                    if ($(el).attr("for_pipe") === pipeId) {
                      $(el).removeClass("not_active");
                      $(el).addClass("active");
                    } else {
                      $(el).removeClass("active");
                      $(el).addClass("not_active");
                    }
                  });

                  /*var statusText = $(this).text();
                  $(this).hide();
                  $(
                    "#start_statuses_container .start_status:contains('" +
                      statusText +
                      "')"
                  ).hide();*/
                }
              );

              // отображаем выбранные статусы на которые распределять
              $(document).on("click", ".after_st_child", function (e) {
                let pipeId = $(this).attr("pipe_in_id");
                let lead = $(this).text();
                let statusId = $(this).attr("lead_id");
                let curChild = $(this);

                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    if (pipeId === pipe_id) {
                      $("#after_statuses").append(
                        '<div class="chosenAfterStatus_container"><div class="chosen_pipe" status_id = "' +
                          statusId +
                          '" pipe_id="' +
                          pipeId +
                          '">' +
                          pip_type +
                          ": " +
                          lead +
                          '</div><div class="delete_start_status">x</div></div>'
                      );
                      curChild.hide();
                      $(".start_st_child_container .start_st_child").each(
                        function (index, el) {
                          if (
                            $(el).attr("lead_id") == statusId &&
                            $(el).attr("pipe_in_id") == pipeId
                          ) {
                            $(el).hide();
                          }
                        }
                      );
                    }
                  }
                );
              });

              $(document).on(
                "click",
                ".delete_after_status",
                function (event) {
                  var statusId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("status_id");
                  var pipeId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("pipe_id");
                  $(event.target).parent().remove();

                  $(".after_st_child_container .after_st_child").each(
                    function (index, el) {
                      if (
                        $(el).attr("lead_id") == statusId &&
                        $(el).attr("pipe_in_id") == pipeId
                      ) {
                        $(el).show();
                      }
                    }
                  );
                  $(".start_st_child_container .start_st_child").each(
                    function (index, el) {
                      if (
                        $(el).attr("lead_id") == statusId &&
                        $(el).attr("pipe_in_id") == pipeId
                      ) {
                        $(el).show();
                      }
                    }
                  );
                }
              );

              // статусы, с которых распределять
              // -------- >>

              chosen_p = [];
              // отображение выбранных воронок с этапами после перезагрузки
              if (existing_settings[0].chosenPipes) {
                $.each(
                  existing_settings[0].chosenPipes,
                  function (key, existing_settings_element) {
                    $("#pipeline").append(
                      '<div class="chosenPipe_container"><div class="chosen_pipe" status_id="' +
                        existing_settings_element.chosenStatus_id +
                        '" pipe_id="' +
                        existing_settings_element.chosenPipe_id +
                        '">' +
                        existing_settings_element.chosenPipe_name +
                        '</div><div class="delete_pipe">x</div></div>'
                    );
                    chosen_p.push({
                      pipe_name: existing_settings_element.chosenPipe_name,
                      pipe_id: existing_settings_element.chosenPipe_id,
                      status_id: existing_settings_element.chosenStatus_id,
                    });
                  }
                );
              }

              //
              $.each(
                existing_settings[0].pipes.pip_name,
                function (pipe_id, pip_type) {
                  var html_pipe = "";
                  var html_pipe_child = "";
                  var pipeChildContainer = $(
                    '<div class="not_active pipe_child_container"></div>'
                  );

                  $.each(
                    existing_settings[0].pipes.lead_name,
                    function (pipe_id_l, lead) {
                      if (pipe_id_l !== pipe_id) {
                        return;
                      }
                      $.each(lead, function (lead_id, lead_name) {
                        let counter = 0;
                        $.each(chosen_p, function (key, value) {
                          if (value.status_id == lead_id) {
                            counter = 1;
                            html_pipe_child +=
                              '<div style="display: none;" class="pipe_child" pipe_in_id = "' +
                              pipe_id_l +
                              '" lead_id="' +
                              lead_id +
                              '">' +
                              lead_name +
                              "</div>";
                            return;
                          }
                        });
                        if (counter == 1) {
                          return;
                        }
                        html_pipe_child +=
                          '<div class="pipe_child" pipe_in_id = "' +
                          pipe_id_l +
                          '" lead_id="' +
                          lead_id +
                          '">' +
                          lead_name +
                          "</div>";
                      });
                    }
                  );

                  html_pipe +=
                    '<div class="pipe"  pipe_id="' +
                    pipe_id +
                    '">' +
                    pip_type +
                    "</div>";

                  // Добавляем html_start_st_child к текущему контейнеру
                  pipeChildContainer.attr("for_pipe", pipe_id);
                  pipeChildContainer.append(html_pipe_child);
                  $("#pipes_container").append(html_pipe);
                  $("#pipes_container").append(pipeChildContainer);
                }
              );

              $("#pipes_container").on("click", ".pipe", function () {
                let pipeId = $(this).attr("pipe_id");
                var chilElem = $(".pipe_child_container");
                $.each(chilElem, function (index, el) {
                  if ($(el).attr("for_pipe") === pipeId) {
                    $(el).removeClass("not_active");
                    $(el).addClass("active");
                  } else {
                    $(el).removeClass("active");
                    $(el).addClass("not_active");
                  }
                });
              });

              // отображаем выбранные воронки
              $(document).on("click", ".pipe_child", function (e) {
                let pipeId = $(this).attr("pipe_in_id");
                let lead = $(this).text();
                let statusId = $(this).attr("lead_id");
                let curChild = $(this);

                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    if (pipeId === pipe_id) {
                      $("#pipeline").append(
                        '<div class="chosenPipe_container"><div class="chosen_pipe" status_id = "' +
                          statusId +
                          '" pipe_id="' +
                          pipeId +
                          '">' +
                          pip_type +
                          ": " +
                          lead +
                          '</div><div class="delete_pipe">x</div></div>'
                      );
                      curChild.hide();
                    }
                  }
                );
              });

              $(document).on("click", ".delete_pipe", function (event) {
                var statusId = $(event.target)
                  .parent()
                  .find(".chosen_pipe")
                  .attr("status_id");
                var pipeId = $(event.target)
                  .parent()
                  .find(".chosen_pipe")
                  .attr("pipe_id");
                $(event.target).parent().remove();

                $(".pipe_child_container .pipe_child").each(function (
                  index,
                  el
                ) {
                  if (
                    $(el).attr("lead_id") == statusId &&
                    $(el).attr("pipe_in_id") == pipeId
                  ) {
                    $(el).show();
                  }
                });
              });

              // отображение выбранных источников после перезагрузки
              chosen_s = [];
              if (existing_settings[0].firstchosenSource) {
                $.each(
                  existing_settings[0].firstchosenSource,
                  function (key, existing_settings_element) {
                    $("#sourceFirst").append(
                      '<div class="FirstchosenSource_container"><div class="chosen_sourceOne">' +
                        existing_settings_element.firstchosenSource_name +
                        '</div><div class="delete_sourceOne">x</div></div>'
                    );
                    chosen_s.push({
                      source_name:
                        existing_settings_element.firstchosenSource_name,
                    });
                  }
                );
              }

              if (existing_settings[0].secondchosenSource) {
                $.each(
                  existing_settings[0].secondchosenSource,
                  function (key, existing_settings_element) {
                    $("#sourceSecond").append(
                      '<div class="SecondchosenSource_container"><div class="chosen_sourceTwo">' +
                        existing_settings_element.secondchosenSource_name +
                        '</div><div class="delete_sourceTwo">x</div></div>'
                    );
                    chosen_s.push({
                      source_name:
                        existing_settings_element.secondchosenSource_name,
                    });
                  }
                );
              }

              // Формируем список источников
              var html_firstSources = "";
              $.each(existing_settings[0].source, function (key, source1) {
                let counter = 0;
                $.each(chosen_s, function (key, value) {
                  if (value.source_name == source1) {
                    counter = 1;
                  }
                });
                if (counter == 1) {
                  return;
                }
                html_firstSources +=
                  '<div class="firstSource_name" >' + source1 + "</div>";
              });
              $("#firstSource_container").append(html_firstSources);

              $("#firstSource_container").on(
                "click",
                ".firstSource_name",
                function () {
                  var sourceText = $(this).text();
                  $(this).hide();
                  $(
                    "#secondSource_container .secondSource_name:contains('" +
                      sourceText +
                      "')"
                  ).hide();
                }
              );

              $(document).on("click", ".delete_sourceOne", function (event) {
                $(event.target).parent().remove();
                $("#firstSource_container .firstSource_name").each(function (
                  index,
                  el
                ) {
                  if ($(el).text() == $($(event.target).prev()).text()) {
                    $(el).show();
                  }
                });
                $("#secondSource_container .secondSource_name").each(
                  function (index, el) {
                    if ($(el).text() == $($(event.target).prev()).text()) {
                      $(el).show();
                    }
                  }
                );
              });

              var html_secondSources = "";
              $.each(existing_settings[0].source, function (key, source2) {
                let counter = 0;
                $.each(chosen_s, function (key, value) {
                  if (value.source_name == source2) {
                    counter = 1;
                  }
                });
                if (counter == 1) {
                  return;
                }
                html_secondSources +=
                  '<div class="secondSource_name" >' + source2 + "</div>";
              });
              $("#secondSource_container").append(html_secondSources);

              $("#secondSource_container").on(
                "click",
                ".secondSource_name",
                function () {
                  var sourceText = $(this).text();
                  $(this).hide();
                  $(
                    "#firstSource_container .firstSource_name:contains('" +
                      sourceText +
                      "')"
                  ).hide();
                }
              );

              $(document).on("click", ".delete_sourceTwo", function (event) {
                $(event.target).parent().remove();
                $("#secondSource_container .secondSource_name").each(
                  function (index, el) {
                    if ($(el).text() == $($(event.target).prev()).text()) {
                      $(el).show();
                    }
                  }
                );
                $("#firstSource_container .firstSource_name").each(function (
                  index,
                  el
                ) {
                  if ($(el).text() == $($(event.target).prev()).text()) {
                    $(el).show();
                  }
                });
              });

              console.log("заполненные настройки", app_settings);

              // После добавления странички по шаблону перебираем массив настроек и добавляем на страничку строки таблицы
              // во все ячейки добавлены классы для настройки стилей

              var html = "";
              $.each(app_settings, function (key, settings_data) {
                if (settings_data.active == "checked") {
                  is_active = ' is_active = "true"';
                  leads_tasks_innerHtml = '<div class="loader_anim"></div>';
                } else {
                  is_active = "";
                  leads_tasks_innerHtml = "-";
                }

                html +=
                  '<tr user_id="' +
                  settings_data.user_id +
                  '"' +
                  is_active +
                  '><td class="user_name">' +
                  settings_data.user_name +
                  '</td><td class="user_limit"><input type="text" class="limit_value" value="' +
                  settings_data.limit +
                  '"></td><td class="user_active"><input type="checkbox" class="active_value" ' +
                  settings_data.active +
                  '></td><td class="user_tr_active"><input type="checkbox" class="tr_active_value" ' +
                  settings_data.tr_active +
                  "></td>" +
                  '<td class="user_t_leads_tasks">' +
                  leads_tasks_innerHtml +
                  "</td>" +
                  '<td class="user_today_leads">' +
                  leads_tasks_innerHtml +
                  "</td>" +
                  '<td class="user_current_leads">' +
                  leads_tasks_innerHtml +
                  "</td>" +
                  '<td class="user_current_overdue_tasks">' +
                  leads_tasks_innerHtml +
                  "</td>" +
                  "</tr>";
              });
              $(".responsible_que_rules_table").append(html);

              $("#preloader").hide();

              let active_users = [];
              $.each($('tr[is_active="true"]'), function (index, elem) {
                active_users.push($(elem).attr("user_id"));
              });
              console.log("active_users", active_users);

              $.ajax({
                url: "https://spacestudents.ru/widget_amo/handler.php",
                type: "POST",
                dataType: "json",
                data: {
                  method: "GET_LEADS_AND_TASKS",
                  data: active_users,
                },
                success: function (msg) {
                  console.log("leads and tasks", msg);
                  $.each(msg.data, function (user_id, user_data) {
                    $(
                      'tr[user_id="' + user_id + '"] td.user_t_leads_tasks'
                    ).html(user_data.leads_with_tasks);
                    $('tr[user_id="' + user_id + '"] td.user_today_leads').html(user_data.today_leads);
                    $('tr[user_id="' + user_id + '"] td.user_current_leads').html(user_data.leads);
                    $('tr[user_id="' + user_id + '"] td.user_current_overdue_tasks').html(user_data.overdue);
                  });
                },
                error: function () {
                  alert("Error");
                },
              }); 
              

              $(".update-button2").click(function () {
                $.ajax({
                  url: "https://spacestudents.ru/widget_amo/handler.php",
                  type: "POST",
                  dataType: "json",
                  data: {
                    method: "GET_LEADS_AND_TASKS",
                    data: active_users,
                  },
                  success: 
                  
                  function (msg) {
                    alert('Данные успешно обновлены');
                    console.log("leads and tasks", msg);
                    $.each(msg.data, function (user_id, user_data) {
                      $(
                        'tr[user_id="' + user_id + '"] td.user_t_leads_tasks'
                      ).html(user_data.leads_with_tasks);
                      $('tr[user_id="' + user_id + '"] td.user_today_leads').html(user_data.today_leads);
                      $('tr[user_id="' + user_id + '"] td.user_current_leads').html(user_data.leads);
                      $('tr[user_id="' + user_id + '"] td.user_current_overdue_tasks').html(user_data.overdue);
                    });
                  },
                  error: function () {
                    alert("Error");
                  },
                }); 
              });
            } else {
              const banned1 = document.getElementById("ban1");
              banned1.classList.remove("unbanned1");
              banned1.classList.add("banned1");
            }
          }
        </script>`;
        $(document).on(
          "click." + self.get_settings().widget_code,
          'button[data-code="open-widget231"]',
          function () {
            new Modal({
              // собственный класс для модального окна,
              // если нужно в нем поменять какие-то стили
              class_name: "modal-window",

              // метод, отрабатывающий при
              // готовности модального окна
              // получает в параметр jQuery-объект $modal_body
              // тела модального окна, все внутренности
              // окна будут в нем
              init: function ($modal_body) {
                var $this = $(this);
                $modal_body
                  .trigger("modal:loaded")
                  .append(data)
                  .trigger("modal:centrify");
                let currentUser = APP.constant("user");
                self.crm_post(
                  "https://spacestudents.ru/widget_amo/handler.php",
                  {
                    // Передаем POST данные с помощью объектной модели Javascript
                    method: "GET_SETTINGS",
                    user: currentUser,
                  },
                  function (msg) {
                    console.log("current settings", msg);
                    let sett = JSON.parse(msg);
                    console.log(sett);
                    arrangeAll(sett.data);
                  }
                );
              },

              // кастомный `destroy`, может вернуть `false`,
              // тогда закрытия окна не произойдет
              destroy: _.noop,

              // контейнер, куда попадет
              // модальное окно и относительно
              // какого элемента будет центрироваться
              container: document.body,

              // если нужно запретить закрытие модального окна
              // по клику на оверлэе, просто передаем в options
              // `disable_overlay_click`
              disable_overlay_click: false,

              // если нужно запретить закрытие модального окна
              // по нажатию на escape
              disable_escape_keydown: false,

              // если нужно запретить дефолтную обработку enter
              disable_enter_keydown: false,

              // параметр отвечает за анимацию всплывания
              // модального окна, если передать `true`,
              // то оно запустится с анимацией увеличения и появления
              init_animation: true,

              // по умолчанию оверлей у модалок белый,
              // изменить если нужен темный оверлей
              default_overlay: true,

              // элемент, который получает фокус,
              // по умолчанию это кнопка акцепта. нужен для того,
              // чтобы снимать фокус с кнопки вызвавшей событие
              focus_element: ".js-modal-accept",
            });
          }
        );

        var settings = self.get_settings();
        //   Проверяем подключен ли наш файл css

        if (
          $(
            'link[href="' +
              settings.path +
              "/style.css?v=" +
              settings.version +
              '"'
          ).length < 1
        ) {
          //  Подключаем файл style.css передавая в качестве параметра версию виджета
          $("head").append(
            '<link href="' +
              settings.path +
              "/style.css?v=" +
              settings.version +
              '" type="text/css" rel="stylesheet">'
          );
        }

        AMOCRM.addNotificationCallback(
          self.get_settings().widget_code,
          function (data) {
            console.log(data);
          }
        );

        return true;
      }, this),
      bind_actions: function () {
        console.log("bind_actions");

        // отображаем выбранныx пользователей
        $(document).on("click", ".user_name", function (e) {
          var user_id = $(e.target).attr("user_id");
          var user_name = $(e.target).text();
          $("#user").append(
            '<div class="chosenUser_container"><div class="chosen_user" user_id="' +
              user_id +
              '">' +
              user_name +
              `</div><div class="delete_user">x</div></div>`
          );
        });

        $(document).on("click", ".userDeal_name", function (e) {
          var userDeal_id = $(e.target).attr("userDeal_id");
          var userDeal_name = $(e.target).text();
          $("#userDeal_statuses").append(
            '<div class="chosenUserDeal_container"><div class="chosen_userDeal" userDeal_id="' +
              userDeal_id +
              '">' +
              userDeal_name +
              `</div><div class="delete_userDeal">x</div></div>`
          );
        });

        // отображение выбранных источников
        $(document).on("click", ".firstSource_name", function (e) {
          var firstSource_name = $(e.target).text();
          $("#sourceFirst").append(
            '<div class="FirstchosenSource_container"><div class="chosen_sourceOne">' +
              firstSource_name +
              `</div><div class="delete_sourceOne">x</div></div>`
          );
        });

        $(document).on("click", ".secondSource_name", function (e) {
          var secondSource_name = $(e.target).text();
          $("#sourceSecond").append(
            '<div class="SecondchosenSource_container"><div class="chosen_sourceTwo">' +
              secondSource_name +
              `</div><div class="delete_sourceTwo">x</div></div>`
          );
        });

        // Отправляем настройки введенные пользователем на экране advanced-settings
        $(document).on("click", "#save_settings_btn", function (e) {
          var table_rows = $(".responsible_que_rules_table tr");
          // Перебираем все строки таблички
          var data = [
            {
              chosenUserDeal: [],
              chosenStageDeal: [],
              chosenStartStatuses: [],
              chosenAfterStatuses: [],
              chosenPipes: [],
              chosenUsers: [],
              firstchosenSource: [],
              secondchosenSource: [],
              users: [],
              pipes: [],
              roles: [],
            },
          ];


          $(".responsible_que_rules_table tr").each(function (index, element) {
            limit_input = $(element).find("input.limit_value"); // получаем поле с лимитом
            active_input = $(element).find("input.active_value"); // получаем поле с активностью
            tr_active_input = $(element).find("input.tr_active_value"); // получаем поле с активностью

            // Добавляем в массив для каждого пользователя массив с указанием его id, установленного лимита и состоянием галочки активности
            data[0].users.push({
              user_id: $(element).attr("user_id"),
              limit: $(limit_input).val(),
              active: $(active_input).is(":checked"),
              tr_active: $(tr_active_input).is(":checked"),
            });
          });

          $(".chosen_userDeal").each(function (index, element) {
            data[0].chosenUserDeal.push({
              chosenUserDeal_name: $(element).text(),
              chosenUserDeal_id: $(element).attr("userDeal_id"),
            });
          });

          $(".chosenPipeDeal_container .chosen_pipeDeal").each(function (
            index,
            element
          ) {
            data[0].chosenStageDeal.push({
              chosenDealPipe_name: $(element).text(),
              chosenDealPipe_id: $(element).attr("pipeDeal_id"),
              chosenDealStatus_id: $(element).attr("statusDeal_id"),
            });
          });

          // Добавляем данные в массив о выбраных статусах, с которых распределять
          $(".chosenStartStatus_container .chosen_pipe").each(function (
            index,
            element
          ) {
            data[0].chosenStartStatuses.push({
              chosenPipe_name: $(element).text(),
              chosenPipe_id: $(element).attr("pipe_id"),
              chosenStatus_id: $(element).attr("status_id"),
            });
          });

          // Добавляем данные в массив о выбраных статусах, на которые распределять
          $(".chosenAfterStatus_container .chosen_pipe").each(function (
            index,
            element
          ) {
            data[0].chosenAfterStatuses.push({
              chosenPipe_name: $(element).text(),
              chosenPipe_id: $(element).attr("pipe_id"),
              chosenStatus_id: $(element).attr("status_id"),
            });
          });

          // Добавляем данные в массив о выбранной воронке и этапе
          $(".chosenPipe_container .chosen_pipe").each(function (
            index,
            element
          ) {
            data[0].chosenPipes.push({
              chosenPipe_name: $(element).text(),
              chosenPipe_id: $(element).attr("pipe_id"),
              chosenStatus_id: $(element).attr("status_id"),
            });
          });

          $(".chosen_user").each(function (index, element) {
            data[0].chosenUsers.push({
              chosenUser_name: $(element).text(),
              chosenUser_id: $(element).attr("user_id"),
            });
          });

          $(".chosen_sourceOne").each(function (index, element) {
            data[0].firstchosenSource.push({
              firstchosenSource_name: $(element).text(),
            });
          });

          $(".chosen_sourceTwo").each(function (index, element) {
            data[0].secondchosenSource.push({
              secondchosenSource_name: $(element).text(),
            });
          });

          self.crm_post(
            "https://spacestudents.ru/widget_amo/handler.php",
            {
              // Передаем POST данные с помощью объектной модели Javascript
              method: "SAVE_SETTINGS",
              data: data,
            },
            function (msg) {
              console.log("msg", msg);
              alert("Настройки успешно сохранены");
            },
            "json",
            function () {
              alert("Error");
            }
          );
        });

        return true;
      },
      settings: function () {
        return true;
      },
      onSave: function () {
        console.log(
          "onSave click",
          "https://spacestudents.ru/widget_amo/handler.php"
        );

        self.crm_post(
          "https://spacestudents.ru/widget_amo/handler.php",
          {
            // Передаем POST данные с помощью объектной модели Javascript
            method: "ACTIVATE",
            data: JSON.stringify(self.get_settings()),
          },
          function (msg) {
            console.log("msg", msg);
          },
          "json",
          function () {
            alert("Error");
          }
        );

        return true;
      },
      destroy: function () {},
      advancedSettings: _.bind(function () {
        var $work_area = $("#work-area-" + self.get_settings().widget_code);

        console.log("advancedSettings");

        $(".content__top__preset").css({ float: "left" });

        self.getTemplate("advanced_settings", {}, function (template) {
          var $page = $(
            template.render({
              desc: self.i18n("desc").title,
              widget_code: self.get_settings().widget_code,
            })
          );

          $work_area.append($page);

          var existing_settings = [];

          // Получаем ранее сохраненные настройка с нашего сервера
          console.log("отправляем запрос");
          let currentUser = APP.constant("user");
          self.crm_post(
            "https://spacestudents.ru/widget_amo/handler.php",
            {
              // Передаем POST данные с помощью объектной модели Javascript
              method: "GET_SETTINGS",
              user: currentUser,
            },
            function (msg) {
              console.log("current settings", msg);
              existing_settings = msg.data;
              if (existing_settings[0].acc == 1) {
                // Формируем массив со списком пользователей и данными из полученных с сервера настроек
                var app_settings = [];
                $.each(APP.constant("managers"), function (key, user_data) {
                  group = parseInt(user_data.group.replace("group_", ""), 10);
                  // Готовим настройки пользователя по умолчанию: id и имя из системных настроек, лимит и активность - по нулям
                  if (user_data.active === false) {
                    return;
                  }
                  if ($.inArray(group, existing_settings.active_groups) != -1) {
                    let this_user_settings = {
                      user_id: user_data.id,
                      user_name: user_data.title,
                      limit: 0,
                      active: "",
                      tr_active: "",
                      leads: 0,
                      overdue: 0,
                      active: false,
                    };

                    // ищем сохраненные данные по этому пользователю в данных с сервер, если находим заменяем ими настройки по умолчанию
                    $.each(
                      existing_settings[0].users,
                      function (key, existing_settings_element) {
                        if (existing_settings_element.user_id == user_data.id) {
                          this_user_settings.limit =
                            existing_settings_element.limit;
                          this_user_settings.leads =
                            existing_settings_element.leads;
                          this_user_settings.overdue =
                            existing_settings_element.overdue;
                          this_user_settings.active =
                            existing_settings_element.active == "true"
                              ? "checked"
                              : "";
                          this_user_settings.tr_active =
                            existing_settings_element.tr_active == "true"
                              ? "checked"
                              : "";
                        }
                      }
                    );
                    // добавляем в массив настроек, из которого будем формировать строки таблицы
                    app_settings.push(this_user_settings);
                  }
                });

                chosen_uD = [];

                console.log(existing_settings[0].chosenUserDeal);
                if (existing_settings[0].chosenUserDeal) {
                  $.each(
                    existing_settings[0].chosenUserDeal,
                    function (key, existing_settings_element) {
                      $("#userDeal_statuses").append(
                        '<div class="chosenUserDeal_container"><div class="chosen_userDeal" userDeal_id="' +
                          existing_settings_element.chosenUserDeal_id +
                          '">' +
                          existing_settings_element.chosenUserDeal_name +
                          '</div><div class="delete_userDeal">x</div></div>'
                      );
                      chosen_uD.push({
                        userDeal_name: existing_settings_element.chosenUserDeal_name,
                        userDeal_id: existing_settings_element.chosenUserDeal_id,
                      });
                    }
                  );
                }

                // Формирование списка пользователей
                var html_usersDeal = "";
                $.each(
                  existing_settings[0].all_users,
                  function (userDeal_id, userDeal) {
                    let userDeal_hidden = "";
                    $.each(chosen_uD, function (key, value) {
                      if (value.userDeal_name == userDeal) {
                        userDeal_hidden = ' style="display: none"';
                        return;
                      }
                    });
                    html_usersDeal +=
                      '<div class="userDeal_name" userDeal_id="' +
                      userDeal_id +
                      '"' +
                      userDeal_hidden +
                      ">" +
                      userDeal +
                      "</div>";
                  }
                );
                $("#userDeal_statuses_container").append(html_usersDeal);

                $("#userDeal_statuses_container").on("click", ".userDeal_name", function () {
                  $(this).hide();
                });

                $(document).on("click", ".delete_userDeal", function (event) {
                  $(event.target).parent().remove();
                  $("#userDeal_statuses_container .userDeal_name").each(function (index, el) {
                    if (
                      $(el).attr("userDeal_id") ==
                      $($(event.target).prev()).attr("userDeal_id")
                    ) {
                      $(el).show();
                    }
                  });
                });

                chosen_pD = [];

                if (existing_settings[0].chosenStageDeal) {
                  $.each(
                    existing_settings[0].chosenStageDeal,
                    function (key, existing_settings_element) {
                      $("#stageDeal_statuses").append(
                        '<div class="chosenPipeDeal_container"><div class="chosen_pipeDeal" statusDeal_id="' +
                          existing_settings_element.chosenDealStatus_id +
                          '" pipeDeal_id="' +
                          existing_settings_element.chosenDealPipe_id +
                          '">' +
                          existing_settings_element.chosenDealPipe_name +
                          '</div><div class="delete_pipeDeal">x</div></div>'
                      );
                      chosen_pD.push({
                        pipeDeal_name: existing_settings_element.chosenDealPipe_name,
                        pipeDeal_id: existing_settings_element.chosenDealPipe_id,
                        statusDeal_id: existing_settings_element.chosenDealStatus_id,
                      });
                    }
                  );
                }

                //
                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipeDeal_id, pipDeal_type) {
                    var html_pipeDeal = "";
                    var html_pipeDeal_child = "";
                    var pipeDealChildContainer = $(
                      '<div class="not_active pipeDeal_child_container"></div>'
                    );

                    $.each(
                      existing_settings[0].pipes.lead_name,
                      function (pipeDeal_id_l, leadDeal) {
                        if (pipeDeal_id_l !== pipeDeal_id) {
                          return;
                        }
                        $.each(leadDeal, function (leadDeal_id, leadDeal_name) {
                          let counter = 0;
                          $.each(chosen_pD, function (key, value) {
                            if (value.statusDeal_id == leadDeal_id) {
                              counter = 1;
                              html_pipeDeal_child +=
                                '<div style="display: none;" class="pipeDeal_child" pipeDeal_in_id = "' +
                                pipeDeal_id_l +
                                '" leadDeal_id="' +
                                leadDeal_id +
                                '">' +
                                leadDeal_name +
                                "</div>";
                              return;
                            }
                          });
                          if (counter == 1) {
                            return;
                          }
                          html_pipeDeal_child +=
                            '<div class="pipeDeal_child" pipeDeal_in_id = "' +
                            pipeDeal_id_l +
                            '" leadDeal_id="' +
                            leadDeal_id +
                            '">' +
                            leadDeal_name +
                            "</div>";
                        });
                      }
                    );

                    html_pipeDeal +=
                      '<div class="pipeDeal"  pipeDeal_id="' +
                      pipeDeal_id +
                      '">' +
                      pipDeal_type +
                      "</div>";

                    // Добавляем html_start_st_child к текущему контейнеру
                    pipeDealChildContainer.attr("for_pipeDeal", pipeDeal_id);
                    pipeDealChildContainer.append(html_pipeDeal_child);
                    $("#stageDeal_statuses_container").append(html_pipeDeal);
                    $("#stageDeal_statuses_container").append(pipeDealChildContainer);
                  }
                );

                $("#stageDeal_statuses_container").on("click", ".pipeDeal", function () {
                  let pipeDealId = $(this).attr("pipeDeal_id");
                  var chilDealElem = $(".pipeDeal_child_container");
                  $.each(chilDealElem, function (index, el) {
                    if ($(el).attr("for_pipeDeal") === pipeDealId) {
                      $(el).removeClass("not_active");
                      $(el).addClass("active");
                    } else {
                      $(el).removeClass("active");
                      $(el).addClass("not_active");
                    }
                  });
                });

                // отображаем выбранные воронки
                $(document).on("click", ".pipeDeal_child", function (e) {
                  let pipeDealId = $(this).attr("pipeDeal_in_id");
                  let leadDeal = $(this).text();
                  let statusDealId = $(this).attr("leadDeal_id");
                  let curDealChild = $(this);

                  $.each(
                    existing_settings[0].pipes.pip_name,
                    function (pipeDeal_id, pipDeal_type) {
                      if (pipeDealId === pipeDeal_id) {
                        $("#stageDeal_statuses").append(
                          '<div class="chosenPipeDeal_container"><div class="chosen_pipeDeal" statusDeal_id = "' +
                            statusDealId +
                            '" pipeDeal_id="' +
                            pipeDealId +
                            '">' +
                            pipDeal_type +
                            ": " +
                            leadDeal +
                            `</div><div class="delete_pipeDeal">x</div></div>`
                        );
                        curDealChild.hide();
                      }
                    }
                  );
                });

                $(document).on("click", ".delete_pipeDeal", function (event) {
                  var statusDealId = $(event.target)
                    .parent()
                    .find(".chosen_pipeDeal")
                    .attr("statusDeal_id");
                  var pipeDealId = $(event.target)
                    .parent()
                    .find(".chosen_pipeDeal")
                    .attr("pipeDeal_id");
                  $(event.target).parent().remove();

                  $(".pipeDeal_child_container .pipeDeal_child").each(function (
                    index,
                    el
                  ) {
                    if (
                      $(el).attr("leadDeal_id") == statusDealId &&
                      $(el).attr("pipeDeal_in_id") == pipeDealId
                    ) {
                      $(el).show();
                    }
                  });
                });

                chosen_u = [];

                // Отображение выбранных пользователей после перезагрузки
                console.log(existing_settings[0].chosenUsers);
                if (existing_settings[0].chosenUsers) {
                  $.each(
                    existing_settings[0].chosenUsers,
                    function (key, existing_settings_element) {
                      $("#user").append(
                        '<div class="chosenUser_container"><div class="chosen_user" user_id="' +
                          existing_settings_element.chosenUser_id +
                          '">' +
                          existing_settings_element.chosenUser_name +
                          '</div><div class="delete_user">x</div></div>'
                      );
                      chosen_u.push({
                        user_name: existing_settings_element.chosenUser_name,
                        user_id: existing_settings_element.chosenUser_id,
                      });
                    }
                  );
                }

                // Формирование списка пользователей
                var html_users = "";
                $.each(
                  existing_settings[0].all_users,
                  function (user_id, user) {
                    let user_hidden = "";
                    $.each(chosen_u, function (key, value) {
                      if (value.user_name == user) {
                        user_hidden = ' style="display: none"';
                        return;
                      }
                    });
                    html_users +=
                      '<div class="user_name" user_id="' +
                      user_id +
                      '"' +
                      user_hidden +
                      ">" +
                      user +
                      "</div>";
                  }
                );
                $("#users_container").append(html_users);

                $("#users_container").on("click", ".user_name", function () {
                  $(this).hide();
                });

                $(document).on("click", ".delete_user", function (event) {
                  $(event.target).parent().remove();
                  $("#users_container .user_name").each(function (index, el) {
                    if (
                      $(el).attr("user_id") ==
                      $($(event.target).prev()).attr("user_id")
                    ) {
                      $(el).show();
                    }
                  });
                });

                // <<------------
                // статусы, с которых распределять

                chosen_statuses = [];
                // отображение выбранных статусов, с которых будут распределяться лиды
                if (existing_settings[0].chosenStartStatuses) {
                  $.each(
                    existing_settings[0].chosenStartStatuses,
                    function (key, existing_settings_element) {
                      $("#start_statuses").append(
                        '<div class="chosenStartStatus_container"><div class="chosen_pipe" status_id="' +
                          existing_settings_element.chosenStatus_id +
                          '" pipe_id="' +
                          existing_settings_element.chosenPipe_id +
                          '">' +
                          existing_settings_element.chosenPipe_name +
                          '</div><div class="delete_start_status">x</div></div>'
                      );
                      chosen_statuses.push({
                        pipe_name: existing_settings_element.chosenPipe_name,
                        pipe_id: existing_settings_element.chosenPipe_id,
                        status_id: existing_settings_element.chosenStatus_id,
                      });
                    }
                  );
                }
                if (existing_settings[0].chosenAfterStatuses) {
                  $.each(
                    existing_settings[0].chosenAfterStatuses,
                    function (key, existing_settings_element) {
                      $("#after_statuses").append(
                        '<div class="chosenAfterStatus_container"><div class="chosen_pipe" status_id="' +
                          existing_settings_element.chosenStatus_id +
                          '" pipe_id="' +
                          existing_settings_element.chosenPipe_id +
                          '">' +
                          existing_settings_element.chosenPipe_name +
                          '</div><div class="delete_after_status">x</div></div>'
                      );
                      chosen_statuses.push({
                        pipe_name: existing_settings_element.chosenPipe_name,
                        pipe_id: existing_settings_element.chosenPipe_id,
                        status_id: existing_settings_element.chosenStatus_id,
                      });
                    }
                  );
                }

                // Формируем список воронок
                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    var html_start_statuses = "";
                    var html_start_st_child = "";
                    var startStChildContainer = $(
                      '<div class="not_active start_st_child_container"></div>'
                    );

                    $.each(
                      existing_settings[0].pipes.lead_name,
                      function (pipe_id_l, lead) {
                        if (pipe_id_l !== pipe_id) {
                          return;
                        }
                        $.each(lead, function (lead_id, lead_name) {
                          let counter = 0;
                          $.each(chosen_statuses, function (key, val) {
                            if (val.status_id == lead_id) {
                              counter = 1;
                              html_start_st_child +=
                                '<div style="display: none;" class="start_st_child" pipe_in_id = "' +
                                pipe_id_l +
                                '" lead_id="' +
                                lead_id +
                                '">' +
                                lead_name +
                                "</div>";
                              return;
                            }
                          });
                          if (counter == 1) {
                            return;
                          }
                          html_start_st_child +=
                            '<div class="start_st_child" pipe_in_id = "' +
                            pipe_id_l +
                            '" lead_id="' +
                            lead_id +
                            '">' +
                            lead_name +
                            "</div>";
                        });
                      }
                    );

                    html_start_statuses +=
                      '<div class="start_status"  pipe_id="' +
                      pipe_id +
                      '">' +
                      pip_type +
                      "</div>";

                    // Добавляем html_start_st_child к текущему контейнеру
                    startStChildContainer.attr("for_pipe", pipe_id);
                    startStChildContainer.append(html_start_st_child);
                    $("#start_statuses_container").append(html_start_statuses);
                    $("#start_statuses_container").append(
                      startStChildContainer
                    );
                  }
                );

                $("#start_statuses_container").on(
                  "click",
                  ".start_status",
                  function () {
                    let pipeId = $(this).attr("pipe_id");
                    var chilElem = $(".start_st_child_container");
                    $.each(chilElem, function (index, el) {
                      if ($(el).attr("for_pipe") === pipeId) {
                        $(el).removeClass("not_active");
                        $(el).addClass("active");
                      } else {
                        $(el).removeClass("active");
                        $(el).addClass("not_active");
                      }
                    });
                  }
                );

                $(document).on("click", ".start_st_child", function (e) {
                  let pipeId = $(this).attr("pipe_in_id");
                  let lead = $(this).text();
                  let statusId = $(this).attr("lead_id");
                  let curChild = $(this);
                  $.each(
                    existing_settings[0].pipes.pip_name,
                    function (pipe_id, pip_type) {
                      if (pipeId === pipe_id) {
                        $("#start_statuses").append(
                          '<div class="chosenStartStatus_container"><div class="chosen_pipe" status_id = "' +
                            statusId +
                            '" pipe_id="' +
                            pipeId +
                            '">' +
                            pip_type +
                            ": " +
                            lead +
                            `</div><div class="delete_start_status">x</div></div>`
                        );
                        curChild.hide();
                        $(".after_st_child_container .after_st_child").each(
                          function (index, el) {
                            if (
                              $(el).attr("lead_id") == statusId &&
                              $(el).attr("pipe_in_id") == pipeId
                            ) {
                              $(el).hide();
                            }
                          }
                        );
                      }
                    }
                  );
                });

                $(document).on(
                  "click",
                  ".delete_start_status",
                  function (event) {
                    var statusId = $(event.target)
                      .parent()
                      .find(".chosen_pipe")
                      .attr("status_id");
                    var pipeId = $(event.target)
                      .parent()
                      .find(".chosen_pipe")
                      .attr("pipe_id");
                    $(event.target).parent().remove();
                    $(".start_st_child_container .start_st_child").each(
                      function (index, el) {
                        if (
                          $(el).attr("lead_id") == statusId &&
                          $(el).attr("pipe_in_id") == pipeId
                        ) {
                          $(el).show();
                        }
                      }
                    );
                    $(".after_st_child_container .after_st_child").each(
                      function (index, el) {
                        if (
                          $(el).attr("lead_id") == statusId &&
                          $(el).attr("pipe_in_id") == pipeId
                        ) {
                          $(el).show();
                        }
                      }
                    );
                  }
                );

                //
                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    var html_after_statuses = "";
                    var html_after_st_child = "";
                    var afterStChildContainer = $(
                      '<div class="not_active after_st_child_container"></div>'
                    );

                    $.each(
                      existing_settings[0].pipes.lead_name,
                      function (pipe_id_l, lead) {
                        if (pipe_id_l !== pipe_id) {
                          return;
                        }
                        $.each(lead, function (lead_id, lead_name) {
                          let counter = 0;
                          $.each(chosen_statuses, function (key, value) {
                            if (value.status_id == lead_id) {
                              counter = 1;
                              html_after_st_child +=
                                '<div style="display: none;" class="after_st_child" pipe_in_id = "' +
                                pipe_id_l +
                                '" lead_id="' +
                                lead_id +
                                '">' +
                                lead_name +
                                "</div>";
                              return;
                            }
                          });
                          if (counter == 1) {
                            return;
                          }
                          html_after_st_child +=
                            '<div class="after_st_child" pipe_in_id = "' +
                            pipe_id_l +
                            '" lead_id="' +
                            lead_id +
                            '">' +
                            lead_name +
                            "</div>";
                        });
                      }
                    );

                    html_after_statuses +=
                      '<div class="after_status"  pipe_id="' +
                      pipe_id +
                      '">' +
                      pip_type +
                      "</div>";

                    // Добавляем html_after_st_child к текущему контейнеру
                    afterStChildContainer.attr("for_pipe", pipe_id);
                    afterStChildContainer.append(html_after_st_child);
                    $("#after_statuses_container").append(html_after_statuses);
                    $("#after_statuses_container").append(
                      afterStChildContainer
                    );
                  }
                );
                //

                $("#after_statuses_container").on(
                  "click",
                  ".after_status",
                  function () {
                    let pipeId = $(this).attr("pipe_id");
                    var chilElem = $(".after_st_child_container");
                    $.each(chilElem, function (index, el) {
                      if ($(el).attr("for_pipe") === pipeId) {
                        $(el).removeClass("not_active");
                        $(el).addClass("active");
                      } else {
                        $(el).removeClass("active");
                        $(el).addClass("not_active");
                      }
                    });

                    /*var statusText = $(this).text();
                    $(this).hide();
                    $(
                      "#start_statuses_container .start_status:contains('" +
                        statusText +
                        "')"
                    ).hide();*/
                  }
                );

                // отображаем выбранные статусы на которые распределять
                $(document).on("click", ".after_st_child", function (e) {
                  let pipeId = $(this).attr("pipe_in_id");
                  let lead = $(this).text();
                  let statusId = $(this).attr("lead_id");
                  let curChild = $(this);

                  $.each(
                    existing_settings[0].pipes.pip_name,
                    function (pipe_id, pip_type) {
                      if (pipeId === pipe_id) {
                        $("#after_statuses").append(
                          '<div class="chosenAfterStatus_container"><div class="chosen_pipe" status_id = "' +
                            statusId +
                            '" pipe_id="' +
                            pipeId +
                            '">' +
                            pip_type +
                            ": " +
                            lead +
                            `</div><div class="delete_start_status">x</div></div>`
                        );
                        curChild.hide();
                        $(".start_st_child_container .start_st_child").each(
                          function (index, el) {
                            if (
                              $(el).attr("lead_id") == statusId &&
                              $(el).attr("pipe_in_id") == pipeId
                            ) {
                              $(el).hide();
                            }
                          }
                        );
                      }
                    }
                  );
                });

                $(document).on(
                  "click",
                  ".delete_after_status",
                  function (event) {
                    var statusId = $(event.target)
                      .parent()
                      .find(".chosen_pipe")
                      .attr("status_id");
                    var pipeId = $(event.target)
                      .parent()
                      .find(".chosen_pipe")
                      .attr("pipe_id");
                    $(event.target).parent().remove();

                    $(".after_st_child_container .after_st_child").each(
                      function (index, el) {
                        if (
                          $(el).attr("lead_id") == statusId &&
                          $(el).attr("pipe_in_id") == pipeId
                        ) {
                          $(el).show();
                        }
                      }
                    );
                    $(".start_st_child_container .start_st_child").each(
                      function (index, el) {
                        if (
                          $(el).attr("lead_id") == statusId &&
                          $(el).attr("pipe_in_id") == pipeId
                        ) {
                          $(el).show();
                        }
                      }
                    );
                  }
                );

                // статусы, с которых распределять
                // -------- >>

                chosen_p = [];
                // отображение выбранных воронок с этапами после перезагрузки
                if (existing_settings[0].chosenPipes) {
                  $.each(
                    existing_settings[0].chosenPipes,
                    function (key, existing_settings_element) {
                      $("#pipeline").append(
                        '<div class="chosenPipe_container"><div class="chosen_pipe" status_id="' +
                          existing_settings_element.chosenStatus_id +
                          '" pipe_id="' +
                          existing_settings_element.chosenPipe_id +
                          '">' +
                          existing_settings_element.chosenPipe_name +
                          '</div><div class="delete_pipe">x</div></div>'
                      );
                      chosen_p.push({
                        pipe_name: existing_settings_element.chosenPipe_name,
                        pipe_id: existing_settings_element.chosenPipe_id,
                        status_id: existing_settings_element.chosenStatus_id,
                      });
                    }
                  );
                }

                //
                $.each(
                  existing_settings[0].pipes.pip_name,
                  function (pipe_id, pip_type) {
                    var html_pipe = "";
                    var html_pipe_child = "";
                    var pipeChildContainer = $(
                      '<div class="not_active pipe_child_container"></div>'
                    );

                    $.each(
                      existing_settings[0].pipes.lead_name,
                      function (pipe_id_l, lead) {
                        if (pipe_id_l !== pipe_id) {
                          return;
                        }
                        $.each(lead, function (lead_id, lead_name) {
                          let counter = 0;
                          $.each(chosen_p, function (key, value) {
                            if (value.status_id == lead_id) {
                              counter = 1;
                              html_pipe_child +=
                                '<div style="display: none;" class="pipe_child" pipe_in_id = "' +
                                pipe_id_l +
                                '" lead_id="' +
                                lead_id +
                                '">' +
                                lead_name +
                                "</div>";
                              return;
                            }
                          });
                          if (counter == 1) {
                            return;
                          }
                          html_pipe_child +=
                            '<div class="pipe_child" pipe_in_id = "' +
                            pipe_id_l +
                            '" lead_id="' +
                            lead_id +
                            '">' +
                            lead_name +
                            "</div>";
                        });
                      }
                    );

                    html_pipe +=
                      '<div class="pipe"  pipe_id="' +
                      pipe_id +
                      '">' +
                      pip_type +
                      "</div>";

                    // Добавляем html_start_st_child к текущему контейнеру
                    pipeChildContainer.attr("for_pipe", pipe_id);
                    pipeChildContainer.append(html_pipe_child);
                    $("#pipes_container").append(html_pipe);
                    $("#pipes_container").append(pipeChildContainer);
                  }
                );

                $("#pipes_container").on("click", ".pipe", function () {
                  let pipeId = $(this).attr("pipe_id");
                  var chilElem = $(".pipe_child_container");
                  $.each(chilElem, function (index, el) {
                    if ($(el).attr("for_pipe") === pipeId) {
                      $(el).removeClass("not_active");
                      $(el).addClass("active");
                    } else {
                      $(el).removeClass("active");
                      $(el).addClass("not_active");
                    }
                  });
                });

                // отображаем выбранные воронки
                $(document).on("click", ".pipe_child", function (e) {
                  let pipeId = $(this).attr("pipe_in_id");
                  let lead = $(this).text();
                  let statusId = $(this).attr("lead_id");
                  let curChild = $(this);

                  $.each(
                    existing_settings[0].pipes.pip_name,
                    function (pipe_id, pip_type) {
                      if (pipeId === pipe_id) {
                        $("#pipeline").append(
                          '<div class="chosenPipe_container"><div class="chosen_pipe" status_id = "' +
                            statusId +
                            '" pipe_id="' +
                            pipeId +
                            '">' +
                            pip_type +
                            ": " +
                            lead +
                            `</div><div class="delete_pipe">x</div></div>`
                        );
                        curChild.hide();
                      }
                    }
                  );
                });

                $(document).on("click", ".delete_pipe", function (event) {
                  var statusId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("status_id");
                  var pipeId = $(event.target)
                    .parent()
                    .find(".chosen_pipe")
                    .attr("pipe_id");
                  $(event.target).parent().remove();

                  $(".pipe_child_container .pipe_child").each(function (
                    index,
                    el
                  ) {
                    if (
                      $(el).attr("lead_id") == statusId &&
                      $(el).attr("pipe_in_id") == pipeId
                    ) {
                      $(el).show();
                    }
                  });
                });

                // отображение выбранных источников после перезагрузки
                chosen_s = [];
                if (existing_settings[0].firstchosenSource) {
                  $.each(
                    existing_settings[0].firstchosenSource,
                    function (key, existing_settings_element) {
                      $("#sourceFirst").append(
                        '<div class="FirstchosenSource_container"><div class="chosen_sourceOne">' +
                          existing_settings_element.firstchosenSource_name +
                          '</div><div class="delete_sourceOne">x</div></div>'
                      );
                      chosen_s.push({
                        source_name:
                          existing_settings_element.firstchosenSource_name,
                      });
                    }
                  );
                }

                if (existing_settings[0].secondchosenSource) {
                  $.each(
                    existing_settings[0].secondchosenSource,
                    function (key, existing_settings_element) {
                      $("#sourceSecond").append(
                        '<div class="SecondchosenSource_container"><div class="chosen_sourceTwo">' +
                          existing_settings_element.secondchosenSource_name +
                          '</div><div class="delete_sourceTwo">x</div></div>'
                      );
                      chosen_s.push({
                        source_name:
                          existing_settings_element.secondchosenSource_name,
                      });
                    }
                  );
                }

                // Формируем список источников
                var html_firstSources = "";
                $.each(existing_settings[0].source, function (key, source1) {
                  let counter = 0;
                  $.each(chosen_s, function (key, value) {
                    if (value.source_name == source1) {
                      counter = 1;
                    }
                  });
                  if (counter == 1) {
                    return;
                  }
                  html_firstSources +=
                    '<div class="firstSource_name" >' + source1 + "</div>";
                });
                $("#firstSource_container").append(html_firstSources);

                $("#firstSource_container").on(
                  "click",
                  ".firstSource_name",
                  function () {
                    var sourceText = $(this).text();
                    $(this).hide();
                    $(
                      "#secondSource_container .secondSource_name:contains('" +
                        sourceText +
                        "')"
                    ).hide();
                  }
                );

                $(document).on("click", ".delete_sourceOne", function (event) {
                  $(event.target).parent().remove();
                  $("#firstSource_container .firstSource_name").each(function (
                    index,
                    el
                  ) {
                    if ($(el).text() == $($(event.target).prev()).text()) {
                      $(el).show();
                    }
                  });
                  $("#secondSource_container .secondSource_name").each(
                    function (index, el) {
                      if ($(el).text() == $($(event.target).prev()).text()) {
                        $(el).show();
                      }
                    }
                  );
                });

                var html_secondSources = "";
                $.each(existing_settings[0].source, function (key, source2) {
                  let counter = 0;
                  $.each(chosen_s, function (key, value) {
                    if (value.source_name == source2) {
                      counter = 1;
                    }
                  });
                  if (counter == 1) {
                    return;
                  }
                  html_secondSources +=
                    '<div class="secondSource_name" >' + source2 + "</div>";
                });
                $("#secondSource_container").append(html_secondSources);

                $("#secondSource_container").on(
                  "click",
                  ".secondSource_name",
                  function () {
                    var sourceText = $(this).text();
                    $(this).hide();
                    $(
                      "#firstSource_container .firstSource_name:contains('" +
                        sourceText +
                        "')"
                    ).hide();
                  }
                );

                $(document).on("click", ".delete_sourceTwo", function (event) {
                  $(event.target).parent().remove();
                  $("#secondSource_container .secondSource_name").each(
                    function (index, el) {
                      if ($(el).text() == $($(event.target).prev()).text()) {
                        $(el).show();
                      }
                    }
                  );
                  $("#firstSource_container .firstSource_name").each(function (
                    index,
                    el
                  ) {
                    if ($(el).text() == $($(event.target).prev()).text()) {
                      $(el).show();
                    }
                  });
                });

                console.log("заполненные настройки", app_settings);

                // После добавления странички по шаблону перебираем массив настроек и добавляем на страничку строки таблицы
                // во все ячейки добавлены классы для настройки стилей

                var html = "";
                $.each(app_settings, function (key, settings_data) {
                  if (settings_data.active == "checked") {
                    is_active = ' is_active = "true"';
                    leads_tasks_innerHtml = '<div class="loader_anim"></div>';
                  } else {
                    is_active = "";
                    leads_tasks_innerHtml = "-";
                  }

                  html +=
                    '<tr user_id="' +
                    settings_data.user_id +
                    '"' +
                    is_active +
                    '><td class="user_name">' +
                    settings_data.user_name +
                    '</td><td class="user_limit"><input type="text" class="limit_value" value="' +
                    settings_data.limit +
                    '"></td><td class="user_active"><input type="checkbox" class="active_value" ' +
                    settings_data.active +
                    '></td><td class="user_tr_active"><input type="checkbox" class="tr_active_value" ' +
                    settings_data.tr_active +
                    "></td>" +
                    '<td class="user_t_leads_tasks">' +
                    leads_tasks_innerHtml +
                    "</td>" +
                    '<td class="user_today_leads">' +
                    leads_tasks_innerHtml +
                    "</td>" +
                    '<td class="user_current_leads">' +
                    leads_tasks_innerHtml +
                    "</td>" +
                    '<td class="user_current_overdue_tasks">' +
                    leads_tasks_innerHtml +
                    "</td>" +
                    "</tr>";
                });
                $(".responsible_que_rules_table").append(html);

                $("#preloader").hide();

                let active_users = [];
                $.each($('tr[is_active="true"]'), function (index, elem) {
                  active_users.push($(elem).attr("user_id"));
                });
                console.log("active_users", active_users);

                self.crm_post(
                  "https://spacestudents.ru/widget_amo/handler.php",
                  {
                    // Передаем POST данные с помощью объектной модели Javascript
                    method: "GET_LEADS_AND_TASKS",
                    data: active_users,
                  },
                  function (msg) {
                    console.log("leads and tasks", msg);

                    $.each(msg.data, function (user_id, user_data) {
                      $(
                        'tr[user_id="' + user_id + '"] td.user_t_leads_tasks'
                      ).html(user_data.leads_with_tasks);
                      $(
                        'tr[user_id="' + user_id + '"] td.user_today_leads'
                      ).html(user_data.today_leads);
                      $(
                        'tr[user_id="' + user_id + '"] td.user_current_leads'
                      ).html(user_data.leads);
                      $(
                        'tr[user_id="' +
                          user_id +
                          '"] td.user_current_overdue_tasks'
                      ).html(user_data.overdue);
                    });
                  },
                  "json",
                  function () {
                    alert("Error");
                  }
                );

                $(".update-button").click(function () {
                  self.crm_post(
                    "https://spacestudents.ru/widget_amo/handler.php",
                    {
                      // Передаем POST данные с помощью объектной модели Javascript
                      method: "GET_LEADS_AND_TASKS",
                      data: active_users,
                    },
                    function (msg) {
                      alert("Данные успешно обновлены");
                      console.log("leads and tasks", msg);
                      $.each(msg.data, function (user_id, user_data) {
                        $(
                          'tr[user_id="' + user_id + '"] td.user_t_leads_tasks'
                        ).html(user_data.leads_with_tasks);
                        $(
                          'tr[user_id="' + user_id + '"] td.user_today_leads'
                        ).html(user_data.today_leads);
                        $(
                          'tr[user_id="' + user_id + '"] td.user_current_leads'
                        ).html(user_data.leads);
                        $(
                          'tr[user_id="' +
                            user_id +
                            '"] td.user_current_overdue_tasks'
                        ).html(user_data.overdue);
                      });
                    },
                    "json",
                    function () {
                      alert("Error");
                    }
                  );
                });
              } else {
                const banned = document.getElementById("ban");
                banned.classList.remove("unbanned");
                banned.classList.add("banned");
              }
              ///
            },
            "json",
            function () {
              alert("Error");
            }
          );
        });
      }, self),
    };
    return this;
  };

  return CustomWidget;
});
